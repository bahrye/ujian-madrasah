import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB, ensureTokenSessionColumn } from '$lib/server/db';
import { generateTokenCode } from '$lib/server/auth';
import { checkSessionTimeWindow } from '$lib/utils/date';

export interface ExamSessionItem {
	session_number: number;
	start_time: string | null;
	end_time: string | null;
}

export interface ExamSelectItem {
	id: number;
	title: string;
	start_time: string | null;
	end_time: string | null;
	sessions: ExamSessionItem[];
}

export const load: PageServerLoad = async ({ platform, locals }) => {
	if (!locals.user) throw redirect(302, '/login');
	const db = getDB(platform);
	await ensureTokenSessionColumn(db);

	const tokens = await db.prepare(`
		SELECT t.*, e.title as exam_title,
		COALESCE((
			SELECT json_group_array(
				json_object(
					'id', u.id, 
					'name', u.name, 
					'username', u.username, 
					'start_time', sa.start_time
				)
			)
			FROM student_attempts sa
			JOIN users u ON sa.student_id = u.id
			WHERE sa.token_id = t.id AND (ep.sessions IS NULL OR ep.sessions = '[]' OR u.session_number IN (SELECT value FROM json_each(ep.sessions)))
		), '[]') as used_by_students_json
		FROM tokens t 
		JOIN exams e ON t.exam_id = e.id
		JOIN exam_proctors ep ON e.id = ep.exam_id
		WHERE t.school_id = ? AND ep.proctor_id = ?
		ORDER BY t.created_at DESC
	`).bind(locals.user.school_id, locals.user.id).all();

	const examsRaw = await db.prepare(`
		SELECT e.id, e.title, e.start_time, e.end_time, ep.sessions as proctor_sessions
		FROM exams e
		JOIN exam_proctors ep ON e.id = ep.exam_id
		JOIN exam_types et ON e.exam_type_id = et.id
		WHERE e.is_active = 1 AND et.is_active = 1 AND e.school_id = ? AND ep.proctor_id = ?
		ORDER BY e.title
	`).bind(locals.user.school_id, locals.user.id).all<any>();

	const examIds = examsRaw.results.map((e: any) => e.id);
	let dbSessions: any[] = [];
	if (examIds.length > 0) {
		const placeholders = examIds.map(() => '?').join(',');
		const sessionsResult = await db.prepare(
			`SELECT exam_id, session_number, start_time, end_time FROM exam_sessions WHERE exam_id IN (${placeholders}) ORDER BY session_number`
		).bind(...examIds).all();
		dbSessions = sessionsResult.results;
	}

	const processedExams: ExamSelectItem[] = examsRaw.results.map((exam: any) => {
		let allowedProctorSessions: number[] | null = null;
		if (exam.proctor_sessions) {
			try {
				const parsed = JSON.parse(exam.proctor_sessions);
				if (Array.isArray(parsed) && parsed.length > 0) {
					allowedProctorSessions = parsed.map((s: any) => parseInt(s, 10));
				}
			} catch (e) {}
		}

		const examDbSessions = dbSessions.filter((s: any) => s.exam_id === exam.id);
		let finalSessions: ExamSessionItem[] = [];

		if (examDbSessions.length > 0) {
			finalSessions = examDbSessions
				.filter((s: any) => allowedProctorSessions === null || allowedProctorSessions.includes(s.session_number))
				.map((s: any) => ({
					session_number: s.session_number,
					start_time: s.start_time || exam.start_time,
					end_time: s.end_time || exam.end_time
				}));

			if (allowedProctorSessions && finalSessions.length === 0) {
				finalSessions = allowedProctorSessions.map(sn => ({
					session_number: sn,
					start_time: exam.start_time,
					end_time: exam.end_time
				}));
			}
		} else {
			const sessionNumbers = allowedProctorSessions && allowedProctorSessions.length > 0 ? allowedProctorSessions : [1];
			finalSessions = sessionNumbers.map(sn => ({
				session_number: sn,
				start_time: exam.start_time,
				end_time: exam.end_time
			}));
		}

		return {
			id: exam.id,
			title: exam.title,
			start_time: exam.start_time,
			end_time: exam.end_time,
			sessions: finalSessions
		};
	});

	const processedTokens = tokens.results.map((t: any) => {
		let usedBy = [];
		try {
			usedBy = t.used_by_students_json ? JSON.parse(t.used_by_students_json) : [];
			if (usedBy.length === 1 && usedBy[0].id === null) usedBy = [];
		} catch (e) {}
		return {
			...t,
			used_by_students: usedBy
		};
	});

	return { tokens: processedTokens, exams: processedExams };
};

export const actions: Actions = {
	generate: async ({ request, platform, locals }) => {
		if (!locals.user) return fail(401, { error: 'Unauthorized' });
		const db = getDB(platform);
		await ensureTokenSessionColumn(db);

		const form = await request.formData();
		const examIdStr = form.get('exam_id')?.toString();
		const parsedExamId = parseInt(examIdStr || '', 10);
		const parsedSessionNumber = parseInt(form.get('session_number')?.toString() || '1', 10);
		const durationHours = parseInt(form.get('duration_hours')?.toString() || '2');

		if (isNaN(parsedExamId)) return fail(400, { error: 'Pilih ujian terlebih dahulu.' });
		if (isNaN(parsedSessionNumber) || parsedSessionNumber < 1) return fail(400, { error: 'Pilih sesi ujian terlebih dahulu.' });

		// Verifikasi penugasan pengawas pada ujian ini
		const proctorAssignment = await db.prepare(`
			SELECT ep.sessions, e.start_time as exam_start_time, e.end_time as exam_end_time
			FROM exams e
			JOIN exam_proctors ep ON e.id = ep.exam_id
			WHERE e.id = ? AND e.school_id = ? AND ep.proctor_id = ?
		`).bind(parsedExamId, locals.user.school_id, locals.user.id).first<any>();

		if (!proctorAssignment) return fail(403, { error: 'Anda bukan pengawas yang ditugaskan untuk ujian ini.' });

		// Cek otorisasi sesi pengawas
		let allowedProctorSessions: number[] | null = null;
		if (proctorAssignment.sessions) {
			try {
				const parsed = JSON.parse(proctorAssignment.sessions);
				if (Array.isArray(parsed) && parsed.length > 0) {
					allowedProctorSessions = parsed.map((s: any) => parseInt(s, 10));
				}
			} catch (e) {}
		}
		if (allowedProctorSessions && !allowedProctorSessions.includes(parsedSessionNumber)) {
			return fail(403, { error: `Anda tidak ditugaskan untuk mengawasi Sesi ${parsedSessionNumber} pada ujian ini.` });
		}

		// Ambil waktu sesi dari exam_sessions jika ada
		const sessionRecord = await db.prepare(`
			SELECT start_time, end_time FROM exam_sessions WHERE exam_id = ? AND session_number = ?
		`).bind(parsedExamId, parsedSessionNumber).first<{ start_time: string | null; end_time: string | null }>();

		const tzOffsetStr = form.get('tz_offset')?.toString();
		const clientTzOffset = tzOffsetStr ? parseInt(tzOffsetStr, 10) : null;

		const startTimeStr = sessionRecord?.start_time || proctorAssignment.exam_start_time;
		const endTimeStr = sessionRecord?.end_time || proctorAssignment.exam_end_time;

		// Aturan 15 menit sebelum waktu sesi ujian
		const timeCheck = checkSessionTimeWindow(startTimeStr, endTimeStr, new Date(), clientTzOffset);
		if (!timeCheck.allowed) {
			if (timeCheck.reason === 'too_early') {
				return fail(400, { error: `Token Sesi ${parsedSessionNumber} baru dapat dibuat 15 menit sebelum waktu sesi ujian dimulai (mulai pukul ${timeCheck.timeFormatted}).` });
			} else if (timeCheck.reason === 'too_late') {
				return fail(400, { error: `Token tidak dapat dibuat karena Sesi ${parsedSessionNumber} telah berakhir.` });
			}
		}

		const nowIso = new Date().toISOString();

		// Check for active token per exam AND session_number
		const activeToken = await db.prepare(`
			SELECT token_code FROM tokens 
			WHERE exam_id = ? AND (session_number = ? OR session_number IS NULL) AND school_id = ? AND expires_at > ?
		`).bind(parsedExamId, parsedSessionNumber, locals.user.school_id, nowIso).first() as { token_code: string } | null;

		if (activeToken) {
			return fail(400, { error: `Gagal: Masih ada token aktif untuk Sesi ${parsedSessionNumber} ujian ini (${activeToken.token_code}). Harap hapus token tersebut dahulu jika ingin membuat yang baru.` });
		}

		const expiresAt = new Date(Date.now() + durationHours * 60 * 60 * 1000).toISOString();

		try {
			// Hapus token lama yang kadaluwarsa dan tidak pernah digunakan oleh siswa untuk sesi ini
			await db.prepare(`
				DELETE FROM tokens 
				WHERE exam_id = ? AND (session_number = ? OR session_number IS NULL) AND school_id = ? 
				  AND id NOT IN (SELECT DISTINCT token_id FROM student_attempts WHERE exam_id = ? AND token_id IS NOT NULL)
			`).bind(parsedExamId, parsedSessionNumber, locals.user.school_id, parsedExamId).run();

			// Generate dengan mekanisme retry jika terjadi collision
			let tokenCode = '';
			let inserted = false;
			let attemptsCount = 0;

			while (!inserted && attemptsCount < 5) {
				attemptsCount++;
				tokenCode = generateTokenCode(6);
				try {
					await db.prepare('INSERT INTO tokens (school_id, exam_id, session_number, token_code, created_by, expires_at) VALUES (?, ?, ?, ?, ?, ?)')
						.bind(locals.user.school_id, parsedExamId, parsedSessionNumber, tokenCode, locals.user.id, expiresAt).run();
					inserted = true;
				} catch (err: any) {
					if (err.message && err.message.includes('UNIQUE')) {
						continue; // Coba lagi dengan kode lain
					}
					throw err;
				}
			}

			if (!inserted) {
				return fail(500, { error: 'Gagal membuat kode token unik. Silakan coba lagi.' });
			}

			return { success: `Token Sesi ${parsedSessionNumber} berhasil dibuat: ${tokenCode}` };
		} catch (e: any) {
			console.error(e);
			return fail(500, { error: e.message || 'Gagal membuat token.' });
		}
	},

	release: async ({ request, platform, locals }) => {
		if (!locals.user) return fail(401, { error: 'Unauthorized' });
		const db = getDB(platform);
		const form = await request.formData();
		const idStr = form.get('id')?.toString();
		const parsedId = parseInt(idStr || '', 10);
		if (isNaN(parsedId)) return fail(400, { error: 'ID tidak valid.' });

		try {
			// Pastikan token terhubung ke ujian yang ditugaskan ke pengawas
			const tokenCheck = await db.prepare(`
				SELECT t.id FROM tokens t
				JOIN exam_proctors ep ON t.exam_id = ep.exam_id
				WHERE t.id = ? AND t.school_id = ? AND ep.proctor_id = ?
			`).bind(parsedId, locals.user.school_id, locals.user.id).first();

			if (!tokenCheck) return fail(403, { error: 'Anda tidak memiliki hak untuk merilis token ini.' });

			await db.prepare('UPDATE tokens SET is_released = 1, released_at = datetime("now") WHERE id = ? AND school_id = ?').bind(parsedId, locals.user.school_id).run();
			return { success: 'Token berhasil dirilis ke siswa.' };
		} catch (e: any) {
			console.error(e);
			return fail(500, { error: e.message || 'Gagal merilis token.' });
		}
	},

	revoke: async ({ request, platform, locals }) => {
		if (!locals.user) return fail(401, { error: 'Unauthorized' });
		const db = getDB(platform);
		const form = await request.formData();
		const idStr = form.get('id')?.toString();
		const parsedId = parseInt(idStr || '', 10);
		if (isNaN(parsedId)) return fail(400, { error: 'ID tidak valid.' });

		try {
			const tokenCheck = await db.prepare(`
				SELECT t.id FROM tokens t
				JOIN exam_proctors ep ON t.exam_id = ep.exam_id
				WHERE t.id = ? AND t.school_id = ? AND ep.proctor_id = ?
			`).bind(parsedId, locals.user.school_id, locals.user.id).first();

			if (!tokenCheck) return fail(403, { error: 'Anda tidak memiliki hak untuk menarik token ini.' });

			await db.prepare('UPDATE tokens SET is_released = 0 WHERE id = ? AND school_id = ?').bind(parsedId, locals.user.school_id).run();
			return { success: 'Token berhasil ditarik.' };
		} catch (e: any) {
			console.error(e);
			return fail(500, { error: e.message || 'Gagal menarik token.' });
		}
	},

	delete: async ({ request, platform, locals }) => {
		if (!locals.user) return fail(401, { error: 'Unauthorized' });
		const db = getDB(platform);
		const form = await request.formData();
		const idStr = form.get('id')?.toString();
		const parsedId = parseInt(idStr || '', 10);
		if (isNaN(parsedId)) return fail(400, { error: 'ID tidak valid.' });

		try {
			const tokenCheck = await db.prepare(`
				SELECT t.id FROM tokens t
				JOIN exam_proctors ep ON t.exam_id = ep.exam_id
				WHERE t.id = ? AND t.school_id = ? AND ep.proctor_id = ?
			`).bind(parsedId, locals.user.school_id, locals.user.id).first();

			if (!tokenCheck) return fail(403, { error: 'Anda tidak memiliki hak untuk menghapus token ini.' });

			const usage = await db.prepare('SELECT COUNT(*) as count FROM student_attempts WHERE token_id = ?').bind(parsedId).first() as {count: number};
			if (usage && usage.count > 0) {
				return fail(400, { error: 'Gagal dihapus: Token ini telah digunakan oleh peserta ujian.' });
			}
			
			await db.prepare('DELETE FROM tokens WHERE id = ? AND school_id = ?').bind(parsedId, locals.user.school_id).run();
			return { success: 'Token berhasil dihapus.' };
		} catch (err: any) {
			console.error('Delete token error:', err);
			return fail(500, { error: 'Terjadi kesalahan sistem saat menghapus token.' });
		}
	}
};

