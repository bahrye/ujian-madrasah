// @ts-nocheck
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export interface ExamFilterOption {
	id: number;
	title: string;
}

export const load = async ({ platform, url, locals }: Parameters<PageServerLoad>[0]) => {
	if (!locals.user) throw redirect(302, '/login');
	const db = getDB(platform);
	const examFilter = url.searchParams.get('exam_id') || '';

	const exams = await db.prepare(`
		SELECT e.id, e.title 
		FROM exams e 
		JOIN exam_proctors ep ON e.id = ep.exam_id
		WHERE e.is_active = 1 AND e.school_id = ? AND ep.proctor_id = ?
		ORDER BY e.title
	`).bind(locals.user.school_id, locals.user.id).all<ExamFilterOption>();

	let attempts: any[] = [];
	if (examFilter) {
		const result = await db.prepare(`
			SELECT 
				epart.student_id,
				u.name as student_name, 
				u.username, 
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
			ORDER BY 
				CASE WHEN sa.status = 'mengerjakan' THEN 1 
					 WHEN sa.status IS NULL THEN 2 
					 ELSE 3 END ASC,
				u.name ASC
		`).bind(examFilter, locals.user.school_id, locals.user.id).all();
		attempts = result.results;
	}

	const kv = platform?.env?.EXAM_ANSWERS;
	const attemptsWithProgress = await Promise.all(attempts.map(async (a) => {
		let answeredCount = 0;
		let warnings = 0;
		let warningLogs: any[] = [];
		const status = a.status || 'belum_mengerjakan';

		if (status === 'mengerjakan') {
			if (kv && a.attempt_id) {
				const stored = await kv.get(`attempt_${a.attempt_id}_answers`);
				if (stored) {
					try {
						const data = JSON.parse(stored);
						if (data && data.answers) {
							answeredCount = Object.values(data.answers).filter(val => val !== null && val !== '').length;
						}
						if (data && data.warnings) warnings = data.warnings;
						if (data && data.warningLogs) warningLogs = data.warningLogs;
					} catch (e) {}
				}
			}
			if (answeredCount === 0 && a.attempt_id) {
				const dbAnswers = await db.prepare('SELECT COUNT(*) as c FROM student_answers WHERE attempt_id = ? AND answer_given IS NOT NULL AND answer_given != ""').bind(a.attempt_id).first() as any;
				if (dbAnswers && dbAnswers.c) answeredCount = dbAnswers.c;
			}
		} else if (status === 'selesai' || status === 'waktu_habis') {
			warnings = a.violation_count || 0;
			try { warningLogs = a.violation_logs ? JSON.parse(a.violation_logs) : []; } catch(e) {}
			if (a.attempt_id) {
				const dbAnswers = await db.prepare('SELECT COUNT(*) as c FROM student_answers WHERE attempt_id = ? AND answer_given IS NOT NULL AND answer_given != ""').bind(a.attempt_id).first() as any;
				if (dbAnswers && dbAnswers.c) answeredCount = dbAnswers.c;
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
	}));

	return { exams: exams.results, attempts: attemptsWithProgress, examFilter };
};

export const actions = {
	togglePause: async ({ request, platform, locals }: import('./$types').RequestEvent) => {
		if (!locals.user) return fail(401, { error: 'Unauthorized' });
		const db = getDB(platform);
		const form = await request.formData();
		const attemptId = form.get('attempt_id')?.toString();
		const action = form.get('action')?.toString(); // 'pause' or 'resume'
		
		if (!attemptId || !action) return fail(400, { error: 'Data tidak valid.' });

		// Verify attempt belongs to current user's school
		const attemptData = await db.prepare(`
			SELECT sa.id, sa.is_paused, sa.paused_at, sa.end_time FROM student_attempts sa
			JOIN exams e ON sa.exam_id = e.id
			WHERE sa.id = ? AND e.school_id = ?
		`).bind(attemptId, locals.user.school_id).first() as any;

		if (!attemptData) return fail(403, { error: 'Sesi ujian tidak ditemukan atau bukan milik sekolah Anda.' });

		if (action === 'pause') {
			await db.prepare(`UPDATE student_attempts SET is_paused = 1, paused_at = datetime('now') WHERE id = ?`).bind(attemptId).run();
			return { success: 'Ujian berhasil ditahan.' };
		} else if (action === 'resume') {
			if (attemptData.paused_at && attemptData.end_time) {
				// Calculate paused duration and add to end_time
				await db.prepare(`
					UPDATE student_attempts 
					SET 
						is_paused = 0, 
						paused_at = NULL,
						end_time = datetime(end_time, '+' || cast(round((julianday('now') - julianday(paused_at)) * 86400) as int) || ' seconds')
					WHERE id = ?
				`).bind(attemptId).run();
			} else {
				await db.prepare(`UPDATE student_attempts SET is_paused = 0, paused_at = NULL WHERE id = ?`).bind(attemptId).run();
			}
			return { success: 'Ujian berhasil dilanjutkan.' };
		}
		return fail(400, { error: 'Aksi tidak valid.' });
	},
	resetAttempt: async ({ request, platform, locals }: import('./$types').RequestEvent) => {
		if (!locals.user) return fail(401, { error: 'Unauthorized' });
		const db = getDB(platform);
		const form = await request.formData();
		const attemptId = form.get('attempt_id')?.toString();
		if (!attemptId) return fail(400, { error: 'ID tidak valid.' });

		// Verify attempt belongs to current user's school
		const attemptCheck = await db.prepare(`
			SELECT sa.id FROM student_attempts sa
			JOIN exams e ON sa.exam_id = e.id
			WHERE sa.id = ? AND e.school_id = ?
		`).bind(attemptId, locals.user.school_id).first();

		if (!attemptCheck) {
			return fail(403, { error: 'Sesi ujian tidak ditemukan atau bukan milik sekolah Anda.' });
		}

		// Delete all answers and reset attempt
		await db.batch([
			db.prepare('DELETE FROM student_answers WHERE attempt_id = ?').bind(attemptId),
			db.prepare('DELETE FROM student_attempts WHERE id = ?').bind(attemptId)
		]);

		return { success: 'Sesi ujian siswa berhasil direset.' };
	}
};
;null as any as Actions;