import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load: PageServerLoad = async ({ platform }) => {
	const db = getDB(platform);
	const results = await db.prepare(`
		SELECT sa.*, u.name as student_name, e.title as exam_title, e.subject
		FROM student_attempts sa
		JOIN users u ON sa.student_id = u.id
		JOIN exams e ON sa.exam_id = e.id
		WHERE sa.status IN ('selesai', 'waktu_habis')
		ORDER BY sa.submit_time DESC
	`).all();

	return { results: results.results };
};
