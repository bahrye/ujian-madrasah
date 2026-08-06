import { g as getDB } from "../../../../chunks/db.js";
const load = async ({ platform, locals }) => {
  const db = getDB(platform);
  const userId = locals.user.id;
  const finishedAttempts = await db.prepare(`
		SELECT sa.*, 
			   e.title as exam_title, 
			   s.name as subject, 
			   e.duration_minutes, 
			   e.show_score_type, 
			   e.is_score_released, 
			   e.end_time as exam_end_time,
			   et.end_time as exam_type_end_time,
			   (SELECT COUNT(*) FROM questions WHERE exam_id = e.id) as question_count,
			   (SELECT SUM(points) FROM questions WHERE exam_id = e.id AND type IN ('pilihan_ganda', 'benar_salah', 'menjodohkan', 'pilihan_ganda_kompleks')) as objective_max_points
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
export {
  load
};
