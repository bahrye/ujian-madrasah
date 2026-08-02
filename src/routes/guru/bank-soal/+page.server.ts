import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load: PageServerLoad = async ({ platform, locals }) => {
	const db = getDB(platform);
	const exams = await db.prepare(`
		SELECT e.*, s.name as subject, (SELECT COUNT(*) FROM questions WHERE exam_id = e.id) as question_count
		FROM exams e 
		LEFT JOIN subjects s ON e.subject_id = s.id
		WHERE e.school_id = ? ORDER BY e.created_at DESC
	`).bind(locals.user!.school_id).all();
	return { exams: exams.results };
};
