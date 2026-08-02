import { g as getDB } from "../../../chunks/db.js";
const load = async ({ platform, locals }) => {
  const db = getDB(platform);
  const userId = locals.user.id;
  const activeExams = await db.prepare(`
		SELECT DISTINCT 
			e.*, 
			s.name as subject,
			(
				SELECT GROUP_CONCAT(u.name, ', ')
				FROM exam_proctors epr
				JOIN users u ON epr.proctor_id = u.id
				WHERE epr.exam_id = e.id
			) as proctors
		FROM exams e
		JOIN exam_participants ep ON ep.exam_id = e.id
		LEFT JOIN subjects s ON e.subject_id = s.id
		WHERE e.is_active = 1
		AND e.school_id = ?
		AND ep.student_id = ?
		ORDER BY e.start_time
	`).bind(locals.user.school_id, userId).all();
  const myAttempts = await db.prepare(`
		SELECT sa.*, e.title as exam_title, s.name as subject
		FROM student_attempts sa
		JOIN exams e ON sa.exam_id = e.id
		LEFT JOIN subjects s ON e.subject_id = s.id
		WHERE sa.student_id = ?
		ORDER BY sa.created_at DESC
	`).bind(userId).all();
  const activeAttempt = await db.prepare(`
		SELECT sa.id, e.title as exam_title
		FROM student_attempts sa JOIN exams e ON sa.exam_id = e.id
		WHERE sa.student_id = ? AND sa.status = 'mengerjakan'
		LIMIT 1
	`).bind(userId).first();
  return {
    activeExams: activeExams.results,
    myAttempts: myAttempts.results,
    activeAttempt
  };
};
export {
  load
};
