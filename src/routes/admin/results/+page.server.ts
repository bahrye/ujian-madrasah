import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getDB } from '$lib/server/db';

export const load: PageServerLoad = async ({ platform, url, locals }) => {
	if (!locals.user) throw redirect(302, '/login');
	const db = getDB(platform);
	const examFilterStr = url.searchParams.get('exam_id') || '';
	const examFilter = parseInt(examFilterStr, 10);

	const exams = await db.prepare('SELECT id, title FROM exams WHERE school_id = ? ORDER BY title').bind(locals.user.school_id).all();

	let query = `
		SELECT sa.*, u.name as student_name, e.title as exam_title, s.name as subject
		FROM student_attempts sa
		JOIN users u ON sa.student_id = u.id
		JOIN exams e ON sa.exam_id = e.id
		LEFT JOIN subjects s ON e.subject_id = s.id
		WHERE sa.status IN ('selesai', 'waktu_habis') AND e.school_id = ?
	`;
	const params: any[] = [locals.user.school_id];

	if (!isNaN(examFilter)) {
		query += ' AND e.id = ?';
		params.push(examFilter);
	}

	query += ' ORDER BY sa.submit_time DESC';

	const results = await db.prepare(query).bind(...params).all();

	return { results: results.results, exams: exams.results, examFilter };
};

export const actions: Actions = {
	delete: async ({ request, platform, locals }) => {
		if (!locals.user) return fail(401, { error: 'Unauthorized' });
		const db = getDB(platform);
		const form = await request.formData();
		const attemptIdStr = form.get('attempt_id')?.toString();
		const parsedId = parseInt(attemptIdStr || '', 10);

		if (isNaN(parsedId)) {
			return fail(400, { error: 'ID tidak valid' });
		}

		try {
			// Karena foreign key D1 tidak otomatis cascade jika pragma foreign_keys tidak ON tiap koneksi,
			// kita pastikan menghapus data anak (answers) terlebih dahulu
			await db.batch([
				db.prepare('DELETE FROM student_answers WHERE attempt_id = ?').bind(parsedId),
				db.prepare('DELETE FROM student_attempts WHERE id = ?').bind(parsedId)
			]);

			return { success: true };
		} catch (e: any) {
			console.error('Error deleting attempt:', e);
			return fail(500, { error: e.message || 'Terjadi kesalahan saat menghapus data ujian.' });
		}
	}
};
