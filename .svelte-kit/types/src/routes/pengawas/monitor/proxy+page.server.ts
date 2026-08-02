// @ts-nocheck
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load = async ({ platform, url, locals }: Parameters<PageServerLoad>[0]) => {
	const db = getDB(platform);
	const examFilter = url.searchParams.get('exam_id') || '';

	const exams = await db.prepare(`
		SELECT e.id, e.title 
		FROM exams e 
		JOIN exam_proctors ep ON e.id = ep.exam_id
		WHERE e.is_active = 1 AND e.school_id = ? AND ep.proctor_id = ?
		ORDER BY e.title
	`).bind(locals.user!.school_id, locals.user!.id).all();

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
		`).bind(examFilter, locals.user!.school_id, locals.user!.id).all();
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
		`).bind(locals.user!.school_id, locals.user!.id).all();
		attempts = result.results;
	}

	const kv = platform?.env?.EXAM_ANSWERS;
	const attemptsWithProgress = await Promise.all(attempts.map(async (a) => {
		let answeredCount = 0;
		if (a.status === 'mengerjakan') {
			if (kv) {
				const stored = await kv.get(`attempt_${a.id}_answers`);
				if (stored) {
					try {
						const data = JSON.parse(stored);
						if (data && data.answers) {
							answeredCount = Object.values(data.answers).filter(val => val !== null && val !== '').length;
						}
					} catch (e) {}
				}
			}
			if (answeredCount === 0) {
				const dbAnswers = await db.prepare('SELECT COUNT(*) as c FROM student_answers WHERE attempt_id = ? AND answer_given IS NOT NULL AND answer_given != ""').bind(a.id).first() as any;
				if (dbAnswers && dbAnswers.c) answeredCount = dbAnswers.c;
			}
		} else {
			const dbAnswers = await db.prepare('SELECT COUNT(*) as c FROM student_answers WHERE attempt_id = ? AND answer_given IS NOT NULL AND answer_given != ""').bind(a.id).first() as any;
			if (dbAnswers && dbAnswers.c) answeredCount = dbAnswers.c;
		}

		return {
			...a,
			answeredCount
		};
	}));

	return { exams: exams.results, attempts: attemptsWithProgress, examFilter };
};

export const actions = {
	resetAttempt: async ({ request, platform }: import('./$types').RequestEvent) => {
		const db = getDB(platform);
		const form = await request.formData();
		const attemptId = form.get('attempt_id')?.toString();
		if (!attemptId) return fail(400, { error: 'ID tidak valid.' });

		// Delete all answers and reset attempt
		await db.batch([
			db.prepare('DELETE FROM student_answers WHERE attempt_id = ?').bind(attemptId),
			db.prepare('DELETE FROM student_attempts WHERE id = ?').bind(attemptId)
		]);

		return { success: 'Sesi ujian siswa berhasil direset.' };
	}
};
;null as any as Actions;