// @ts-nocheck
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB, ensureUserLoginColumns } from '$lib/server/db';
import { deleteFromCloudinary } from '$lib/server/cloudinary';
import { env } from '$env/dynamic/private';
import { formatExamTitle } from '$lib/utils/exam';

export interface ExamFilterOption {
	id: number;
	title: string;
}

export const load = async ({ platform, url, locals }: Parameters<PageServerLoad>[0]) => {
	if (!locals.user) throw redirect(302, '/login');
	try {
		const db = getDB(platform);
		const examFilterStr = url.searchParams.get('exam_id') || '';
		const examFilter = parseInt(examFilterStr, 10);
		const sessionFilterStr = url.searchParams.get('session_number') || '';
		const sessionFilter = parseInt(sessionFilterStr, 10);

		const rawExams = await db.prepare(`
			SELECT e.id, e.title, s.name as subject_name, et.code as exam_type_code, c.name as class_name
			FROM exams e 
			JOIN exam_proctors ep ON e.id = ep.exam_id
			LEFT JOIN subjects s ON e.subject_id = s.id
			LEFT JOIN exam_types et ON e.exam_type_id = et.id
			LEFT JOIN classes c ON e.class_id = c.id
			WHERE e.is_active = 1 AND e.school_id = ? AND ep.proctor_id = ?
			ORDER BY e.title
		`).bind(locals.user.school_id, locals.user.id).all<any>();

		const exams: ExamFilterOption[] = (rawExams.results || []).map((e: any) => ({
			id: e.id,
			title: formatExamTitle({
				title: e.title,
				examTypeCode: e.exam_type_code,
				subjectName: e.subject_name,
				className: e.class_name
			})
		}));

		let availableSessions: number[] = [];
		let allowedProctorSessions: number[] | null = null;

		if (!isNaN(examFilter)) {
			// Check proctor assignment for this exam
			const proctorAssignment = await db.prepare(`
				SELECT sessions FROM exam_proctors WHERE exam_id = ? AND proctor_id = ?
			`).bind(examFilter, locals.user.id).first<{ sessions: string | null }>();

			if (proctorAssignment?.sessions) {
				try {
					const parsed = JSON.parse(proctorAssignment.sessions);
					if (Array.isArray(parsed) && parsed.length > 0) {
						allowedProctorSessions = parsed.map((s: any) => parseInt(s, 10));
					}
				} catch (e) {}
			}

			// Get sessions defined in exam_sessions table
			const dbSessions = await db.prepare(`
				SELECT session_number FROM exam_sessions WHERE exam_id = ? ORDER BY session_number
			`).bind(examFilter).all<{ session_number: number }>();

			if (dbSessions.results.length > 0) {
				availableSessions = dbSessions.results.map(s => s.session_number);
			} else {
				availableSessions = [];
			}

			if (allowedProctorSessions && allowedProctorSessions.length > 0) {
				availableSessions = availableSessions.filter(sn => allowedProctorSessions!.includes(sn));
			}
		}

		// Determine active session filter
		let activeSessionFilter: number | null = null;
		if (availableSessions.length > 0) {
			if (!isNaN(sessionFilter) && availableSessions.includes(sessionFilter)) {
				activeSessionFilter = sessionFilter;
			} else if (allowedProctorSessions && allowedProctorSessions.length === 1) {
				activeSessionFilter = allowedProctorSessions[0];
			} else if (availableSessions.length === 1) {
				activeSessionFilter = availableSessions[0];
			}
		}

		let attempts: any[] = [];
		if (!isNaN(examFilter)) {
			let query = `
				SELECT 
					epart.student_id,
					u.name as student_name, 
					u.username, 
					COALESCE(u.session_number, 1) as student_session_number,
					COALESCE(u.is_logged_in, 0) as is_logged_in,
					e.title as exam_title,
					e.duration_minutes,
					(SELECT COUNT(*) FROM questions WHERE exam_id = e.id) as question_count,
					sa.id as attempt_id,
					sa.start_time,
					sa.end_time,
					sa.submit_time,
					sa.score,
					sa.total_points,
					sa.status,
					sa.violation_count,
					sa.violation_logs,
					sa.is_paused,
					sa.paused_at
				FROM exam_participants epart
				JOIN users u ON epart.student_id = u.id
				JOIN exams e ON epart.exam_id = e.id
				JOIN exam_proctors ep ON e.id = ep.exam_id
				LEFT JOIN student_attempts sa ON sa.student_id = epart.student_id AND sa.exam_id = epart.exam_id
				WHERE epart.exam_id = ? AND e.school_id = ? AND ep.proctor_id = ?
				  AND (ep.room_id IS NULL OR ep.room_id = epart.room_id)
			`;

			const bindings: any[] = [examFilter, locals.user.school_id, locals.user.id];

			if (activeSessionFilter !== null) {
				query += ` AND COALESCE(u.session_number, 1) = ?`;
				bindings.push(activeSessionFilter);
			} else if (allowedProctorSessions && allowedProctorSessions.length > 0) {
				const placeholders = allowedProctorSessions.map(() => '?').join(',');
				query += ` AND COALESCE(u.session_number, 1) IN (${placeholders})`;
				bindings.push(...allowedProctorSessions);
			}

			query += `
				ORDER BY 
					CASE WHEN sa.status = 'mengerjakan' THEN 1 
						 WHEN sa.status IS NULL THEN 2 
						 ELSE 3 END ASC,
					u.name ASC
			`;

			const result = await db.prepare(query).bind(...bindings).all();
			attempts = result.results;
		}

		// Fetch all answers count from DB to avoid N+1 queries
		let answeredCountsMap: Record<number, number> = {};
		const attemptIds = attempts.map(a => a.attempt_id).filter(id => id);
		if (attemptIds.length > 0) {
			const countsResult = await db.prepare(`
				SELECT sa.attempt_id, COUNT(*) as c
				FROM student_answers sa
				JOIN student_attempts st ON sa.attempt_id = st.id
				WHERE st.exam_id = ? AND sa.answer_given IS NOT NULL AND sa.answer_given != ''
				GROUP BY sa.attempt_id
			`).bind(examFilter).all();
			
			countsResult.results.forEach((r: any) => {
				answeredCountsMap[r.attempt_id] = r.c;
			});
		}

		const kv = platform?.env?.EXAM_ANSWERS;
		const attemptsWithProgress = await Promise.all(
			attempts.map(async (a) => {
				let answeredCount = 0;
				let warnings = 0;
				let warningLogs: any[] = [];
				const status = a.status || 'belum_mengerjakan';

				if (status === 'mengerjakan') {
					if (kv && a.attempt_id) {
						try {
							const stored = await kv.get(`attempt_${a.attempt_id}_answers`);
							if (stored) {
								const data = JSON.parse(stored);
								if (data && data.answers) {
									answeredCount = Object.values(data.answers).filter(val => val !== null && val !== '').length;
								}
								if (data && data.warnings) warnings = data.warnings;
								if (data && data.warningLogs) warningLogs = data.warningLogs;
							}
						} catch (e) {
							console.error("KV get error:", e);
						}
					}
					if (answeredCount === 0 && a.attempt_id) {
						answeredCount = answeredCountsMap[a.attempt_id] || 0;
					}
				} else if (status === 'selesai' || status === 'waktu_habis') {
					warnings = a.violation_count || 0;
					try { warningLogs = a.violation_logs ? JSON.parse(a.violation_logs) : []; } catch(e) {}
					if (a.attempt_id) {
						answeredCount = answeredCountsMap[a.attempt_id] || 0;
					}
				}

				return {
					...a,
					id: a.attempt_id || `no_attempt_${a.student_id}`,
					attempt_id: a.attempt_id,
					status,
					answeredCount,
					warnings,
					warningLogs,
					is_paused: a.is_paused,
					paused_at: a.paused_at
				};
			})
		);

		return {
			exams: exams.results,
			attempts: attemptsWithProgress,
			examFilter: isNaN(examFilter) ? '' : String(examFilter),
			availableSessions,
			sessionFilter: activeSessionFilter !== null ? String(activeSessionFilter) : ''
		};
	} catch (err: any) {
		console.error("Load Error in monitor page:", err);
		return { exams: [], attempts: [], examFilter: '', availableSessions: [], sessionFilter: '', loadError: err.message || String(err) };
	}
};

export const actions = {
	togglePause: async ({ request, platform, locals }: import('./$types').RequestEvent) => {
		if (!locals.user) return fail(401, { error: 'Unauthorized' });
		const db = getDB(platform);
		const form = await request.formData();
		const attemptIdStr = form.get('attempt_id')?.toString();
		const parsedAttemptId = parseInt(attemptIdStr || '', 10);
		const action = form.get('action')?.toString();
		
		if (isNaN(parsedAttemptId) || !action) return fail(400, { error: 'Data tidak valid.' });

		const attemptData = await db.prepare(`
			SELECT sa.id, sa.is_paused, sa.paused_at, sa.end_time FROM student_attempts sa
			JOIN exams e ON sa.exam_id = e.id
			JOIN exam_participants ep_part ON sa.student_id = ep_part.student_id AND sa.exam_id = ep_part.exam_id
			JOIN users u ON ep_part.student_id = u.id
			JOIN exam_proctors ep ON e.id = ep.exam_id
			WHERE sa.id = ? AND e.school_id = ? AND ep.proctor_id = ?
			  AND (ep.room_id IS NULL OR ep.room_id = ep_part.room_id)
			  AND (ep.sessions IS NULL OR ep.sessions = '[]' OR u.session_number IN (SELECT value FROM json_each(ep.sessions)))
		`).bind(parsedAttemptId, locals.user.school_id, locals.user.id).first() as any;

		if (!attemptData) return fail(403, { error: 'Sesi ujian tidak ditemukan atau bukan milik sekolah Anda.' });

		try {
			if (action === 'pause') {
				await db.prepare(`UPDATE student_attempts SET is_paused = 1, paused_at = datetime('now') WHERE id = ?`).bind(parsedAttemptId).run();
				return { success: 'Ujian berhasil ditahan.' };
			} else if (action === 'resume') {
				if (attemptData.paused_at && attemptData.end_time) {
					await db.prepare(`
						UPDATE student_attempts 
						SET 
							is_paused = 0, 
							paused_at = NULL,
							end_time = datetime(end_time, '+' || cast(round((julianday('now') - julianday(paused_at)) * 86400) as int) || ' seconds')
						WHERE id = ?
					`).bind(parsedAttemptId).run();
				} else {
					await db.prepare(`UPDATE student_attempts SET is_paused = 0, paused_at = NULL WHERE id = ?`).bind(parsedAttemptId).run();
				}
				return { success: 'Ujian berhasil dilanjutkan.' };
			}
			return fail(400, { error: 'Aksi tidak valid.' });
		} catch (e: any) {
			console.error(e);
			return fail(500, { error: e.message || 'Gagal mengubah status ujian.' });
		}
	},
	resetAttempt: async ({ request, platform, locals }: import('./$types').RequestEvent) => {
		if (!locals.user) return fail(401, { error: 'Unauthorized' });
		const db = getDB(platform);
		const form = await request.formData();
		const attemptIdStr = form.get('attempt_id')?.toString();
		const parsedAttemptId = parseInt(attemptIdStr || '', 10);
		if (isNaN(parsedAttemptId)) return fail(400, { error: 'ID tidak valid.' });

		const attemptCheck = await db.prepare(`
			SELECT sa.id, sa.signature FROM student_attempts sa
			JOIN exams e ON sa.exam_id = e.id
			JOIN exam_participants ep_part ON sa.student_id = ep_part.student_id AND sa.exam_id = ep_part.exam_id
			JOIN users u ON ep_part.student_id = u.id
			JOIN exam_proctors ep ON e.id = ep.exam_id
			WHERE sa.id = ? AND e.school_id = ? AND ep.proctor_id = ?
			  AND (ep.room_id IS NULL OR ep.room_id = ep_part.room_id)
			  AND (ep.sessions IS NULL OR ep.sessions = '[]' OR u.session_number IN (SELECT value FROM json_each(ep.sessions)))
		`).bind(parsedAttemptId, locals.user.school_id, locals.user.id).first<{id: number, signature: string | null}>();

		if (!attemptCheck) {
			return fail(403, { error: 'Sesi ujian tidak ditemukan atau bukan milik sekolah Anda.' });
		}

		try {
			if (attemptCheck.signature && attemptCheck.signature.includes('res.cloudinary.com')) {
				const mergedEnv = platform?.env || env;
				await deleteFromCloudinary(attemptCheck.signature, mergedEnv);
			}

			await db.batch([
				db.prepare('DELETE FROM student_answers WHERE attempt_id = ?').bind(parsedAttemptId),
				db.prepare('DELETE FROM student_attempts WHERE id = ?').bind(parsedAttemptId)
			]);

			return { success: 'Sesi ujian siswa berhasil direset.' };
		} catch (e: any) {
			console.error(e);
			return fail(500, { error: e.message || 'Gagal mereset sesi ujian siswa.' });
		}
	},
	resetLogin: async ({ request, platform, locals }: import('./$types').RequestEvent) => {
		if (!locals.user) return fail(401, { error: 'Unauthorized' });
		const db = getDB(platform);
		const form = await request.formData();
		const studentIdStr = form.get('student_id')?.toString();
		const parsedStudentId = parseInt(studentIdStr || '', 10);
		if (isNaN(parsedStudentId)) return fail(400, { error: 'ID Siswa tidak valid.' });

		try {
			await ensureUserLoginColumns(db);
			await db.prepare(`
				UPDATE users SET is_logged_in = 0, session_token = NULL WHERE id = ? AND school_id = ?
			`).bind(parsedStudentId, locals.user.school_id).run();

			return { success: 'Login perangkat siswa berhasil direset.' };
		} catch (e: any) {
			console.error(e);
			return fail(500, { error: e.message || 'Gagal mereset login perangkat siswa.' });
		}
	}
};
;null as any as Actions;