import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load: PageServerLoad = async ({ platform, locals }) => {
	const db = getDB(platform);
	const results = await db.prepare(`
		SELECT sa.*, u.name as student_name, e.title as exam_title, s.name as subject
		FROM student_attempts sa
		JOIN users u ON sa.student_id = u.id
		JOIN exams e ON sa.exam_id = e.id
		LEFT JOIN subjects s ON e.subject_id = s.id
		WHERE sa.status IN ('selesai', 'waktu_habis') AND e.school_id = ?
		ORDER BY sa.submit_time DESC
	`).bind(locals.user!.school_id).all();

	return { results: results.results };
};

export const actions = {
	delete: async ({ request, platform, locals }) => {
		const db = getDB(platform);
		const form = await request.formData();
		const attemptId = form.get('attempt_id')?.toString();

		if (!attemptId) {
			return { success: false, error: 'ID tidak valid' };
		}

		// Karena foreign key D1 tidak otomatis cascade jika pragma foreign_keys tidak ON tiap koneksi,
		// kita pastikan menghapus data anak (answers) terlebih dahulu
		await db.prepare('DELETE FROM student_answers WHERE attempt_id = ?').bind(attemptId).run();
		await db.prepare('DELETE FROM student_attempts WHERE id = ?').bind(attemptId).run();

		return { success: true };
	}
};
