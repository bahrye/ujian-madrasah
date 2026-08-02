import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load: PageServerLoad = async ({ platform }) => {
	const db = getDB(platform);
	const exams = await db.prepare(`
		SELECT e.*, (SELECT COUNT(*) FROM questions WHERE exam_id = e.id) as question_count
		FROM exams e ORDER BY e.created_at DESC
	`).all();
	return { exams: exams.results };
};
