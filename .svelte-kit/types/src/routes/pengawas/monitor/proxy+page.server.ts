// @ts-nocheck
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load = async ({ platform, url, locals }: Parameters<PageServerLoad>[0]) => {
	const db = getDB(platform);
	const examFilter = url.searchParams.get('exam_id') || '';

	const exams = await db.prepare('SELECT id, title FROM exams WHERE is_active = 1 AND school_id = ? ORDER BY title').bind(locals.user!.school_id).all();

	let attempts: any[] = [];
	if (examFilter) {
		const result = await db.prepare(`
			SELECT sa.*, u.name as student_name, u.username
			FROM student_attempts sa
			JOIN users u ON sa.student_id = u.id
			JOIN exams e ON sa.exam_id = e.id
			WHERE sa.exam_id = ? AND e.school_id = ?
			ORDER BY sa.status DESC, sa.start_time DESC
		`).bind(examFilter, locals.user!.school_id).all();
		attempts = result.results;
	} else {
		const result = await db.prepare(`
			SELECT sa.*, u.name as student_name, u.username, e.title as exam_title
			FROM student_attempts sa
			JOIN users u ON sa.student_id = u.id
			JOIN exams e ON sa.exam_id = e.id
			WHERE sa.status = 'mengerjakan' AND e.school_id = ?
			ORDER BY sa.start_time DESC
		`).bind(locals.user!.school_id).all();
		attempts = result.results;
	}

	return { exams: exams.results, attempts, examFilter };
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