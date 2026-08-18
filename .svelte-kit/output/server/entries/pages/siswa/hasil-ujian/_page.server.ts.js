import { g as getDB } from "../../../../chunks/db.js";
import { f as formatExamTitle } from "../../../../chunks/exam.js";
const load = async ({ platform, locals }) => {
  const db = getDB(platform);
  const userId = locals.user.id;
  const finishedAttempts = await db.prepare(`
		SELECT sa.*, 
			   COALESCE(sa.is_score_released, 0) as student_is_score_released,
			   COALESCE(sa.is_graded, 0) as is_graded,
			   e.title, 
			   s.name as subject, 
			   s.name as subject_name,
			   et.code as exam_type_code,
			   c.name as class_name,
			   e.duration_minutes, 
			   e.show_score_type, 
			   e.is_score_released as exam_is_score_released, 
			   e.end_time as exam_end_time,
			   et.end_time as exam_type_end_time,
			   (SELECT COUNT(*) FROM questions WHERE exam_id = e.id) as question_count,
			   (SELECT COUNT(*) FROM questions q_m WHERE q_m.exam_id = e.id AND q_m.type IN ('essay', 'isian_singkat')) as manual_question_count,
			   (SELECT COUNT(*) FROM student_answers sa_u 
			    JOIN questions q_u ON sa_u.question_id = q_u.id 
			    WHERE sa_u.attempt_id = sa.id 
			    AND q_u.type IN ('essay', 'isian_singkat') 
			    AND sa_u.score_given IS NULL) as ungraded_count,
			   (SELECT SUM(points) FROM questions WHERE exam_id = e.id AND type IN ('pilihan_ganda', 'benar_salah', 'menjodohkan', 'pilihan_ganda_kompleks')) as objective_max_points,
			   (SELECT SUM(score_given) FROM student_answers sa2 JOIN questions q2 ON sa2.question_id = q2.id WHERE sa2.attempt_id = sa.id AND q2.type IN ('pilihan_ganda', 'benar_salah', 'menjodohkan', 'pilihan_ganda_kompleks')) as objective_earned_points
		FROM student_attempts sa
		JOIN exams e ON sa.exam_id = e.id
		LEFT JOIN subjects s ON e.subject_id = s.id
		LEFT JOIN exam_types et ON e.exam_type_id = et.id
		LEFT JOIN classes c ON e.class_id = c.id
		WHERE sa.student_id = ? AND sa.status IN ('selesai', 'waktu_habis')
		ORDER BY sa.created_at DESC
	`).bind(userId).all();
  const results = (finishedAttempts.results || []).map((sa) => {
    const isFullyGraded = sa.manual_question_count === 0 || sa.is_graded === 1 || sa.ungraded_count === 0;
    return {
      ...sa,
      is_fully_graded: isFullyGraded,
      exam_title: formatExamTitle({
        title: sa.title,
        examTypeCode: sa.exam_type_code,
        subjectName: sa.subject_name,
        className: sa.class_name
      })
    };
  });
  return {
    finishedAttempts: results
  };
};
export {
  load
};
