import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load: PageServerLoad = async ({ platform, url, locals }) => {
	if (!locals.user) throw redirect(302, '/login');
	const db = getDB(platform);
	const examFilter = url.searchParams.get('exam_id') || '';

	const exams = await db.prepare(`
		SELECT e.id, e.title 
		FROM exams e 
		JOIN exam_proctors ep ON e.id = ep.exam_id
		WHERE e.is_active = 1 AND e.school_id = ? AND ep.proctor_id = ?
		ORDER BY e.title
	`).bind(locals.user.school_id, locals.user.id).all();

	let attempts: any[] = [];
	if (examFilter) {
		const result = await db.prepare(`
			SELECT sa.*, u.name as student_name, u.username, e.duration_minutes,
				(SELECT COUNT(*) FROM questions WHERE exam_id = e.id) as question_count
			FROM student_attempts sa
			JOIN users u ON sa.student_id = u.id
			JOIN exams e ON sa.exam_id = e.id
			JOIN exam_proctors ep ON e.id = ep.exam_id
			WHERE sa.exam_id = ? AND e.school_id = ? AND ep.proctor_id = ?
			ORDER BY sa.status DESC, sa.start_time DESC
		`).bind(examFilter, locals.user.school_id, locals.user.id).all();
		attempts = result.results;
	} else {
		const result = await db.prepare(`
			SELECT sa.*, u.name as student_name, u.username, e.title as exam_title, e.duration_minutes,
				(SELECT COUNT(*) FROM questions WHERE exam_id = e.id) as question_count
			FROM student_attempts sa
			JOIN users u ON sa.student_id = u.id
			JOIN exams e ON sa.exam_id = e.id
			JOIN exam_proctors ep ON e.id = ep.exam_id
			WHERE sa.status = 'mengerjakan' AND e.school_id = ? AND ep.proctor_id = ?
			ORDER BY sa.start_time DESC
		`).bind(locals.user.school_id, locals.user.id).all();
		attempts = result.results;
	}

	const kv = platform?.env?.EXAM_ANSWERS;
	const attemptsWithProgress = await Promise.all(attempts.map(async (a) => {
		let answeredCount = 0;
		let warnings = 0;
		let warningLogs: any[] = [];
		if (a.status === 'mengerjakan') {
			if (kv) {
				const stored = await kv.get(`attempt_${a.id}_answers`);
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
			if (answeredCount === 0) {
				const dbAnswers = await db.prepare('SELECT COUNT(*) as c FROM student_answers WHERE attempt_id = ? AND answer_given IS NOT NULL AND answer_given != ""').bind(a.id).first() as any;
				if (dbAnswers && dbAnswers.c) answeredCount = dbAnswers.c;
			}
		} else {
			warnings = a.violation_count || 0;
			try { warningLogs = a.violation_logs ? JSON.parse(a.violation_logs) : []; } catch(e) {}
			const dbAnswers = await db.prepare('SELECT COUNT(*) as c FROM student_answers WHERE attempt_id = ? AND answer_given IS NOT NULL AND answer_given != ""').bind(a.id).first() as any;
			if (dbAnswers && dbAnswers.c) answeredCount = dbAnswers.c;
		}

		return {
			...a,
			answeredCount,
			warnings,
			warningLogs
		};
	}));

	return { exams: exams.results, attempts: attemptsWithProgress, examFilter };
};

export const actions: Actions = {
	resetAttempt: async ({ request, platform, locals }) => {
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
