import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load: PageServerLoad = async ({ platform, url, locals }) => {
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
			SELECT sa.*, u.name as student_name, u.username
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
			SELECT sa.*, u.name as student_name, u.username, e.title as exam_title
			FROM student_attempts sa
			JOIN users u ON sa.student_id = u.id
			JOIN exams e ON sa.exam_id = e.id
			JOIN exam_proctors ep ON e.id = ep.exam_id
			WHERE sa.status = 'mengerjakan' AND e.school_id = ? AND ep.proctor_id = ?
			ORDER BY sa.start_time DESC
		`).bind(locals.user!.school_id, locals.user!.id).all();
		attempts = result.results;
	}

	return { exams: exams.results, attempts, examFilter };
};

export const actions: Actions = {
	resetAttempt: async ({ request, platform }) => {
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
