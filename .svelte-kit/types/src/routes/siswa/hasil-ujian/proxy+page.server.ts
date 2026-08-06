// @ts-nocheck
import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load = async ({ platform, locals }: Parameters<PageServerLoad>[0]) => {
	const db = getDB(platform);
	const userId = locals.user!.id;

	// Ambil semua ujian yang berstatus selesai atau waktu_habis
	const finishedAttempts = await db.prepare(`
		SELECT sa.*, 
			   e.title as exam_title, 
			   s.name as subject, 
			   e.duration_minutes, 
			   e.show_score_type, 
			   e.is_score_released, 
			   e.end_time as exam_end_time,
			   et.end_time as exam_type_end_time,
			   (SELECT COUNT(*) FROM questions WHERE exam_id = e.id) as question_count
		FROM student_attempts sa
		JOIN exams e ON sa.exam_id = e.id
		LEFT JOIN subjects s ON e.subject_id = s.id
		LEFT JOIN exam_types et ON e.exam_type_id = et.id
		WHERE sa.student_id = ? AND sa.status IN ('selesai', 'waktu_habis')
		ORDER BY sa.created_at DESC
	`).bind(userId).all();

	return {
		finishedAttempts: finishedAttempts.results
	};
};
