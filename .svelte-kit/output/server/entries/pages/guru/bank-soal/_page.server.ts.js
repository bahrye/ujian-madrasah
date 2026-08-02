import { g as getDB } from "../../../../chunks/db.js";
const load = async ({ platform, locals }) => {
  const db = getDB(platform);
  const exams = await db.prepare(`
		SELECT e.*, s.name as subject, (SELECT COUNT(*) FROM questions WHERE exam_id = e.id) as question_count
		FROM exams e 
		LEFT JOIN subjects s ON e.subject_id = s.id
		WHERE e.school_id = ? 
		  AND (e.created_by = ? OR EXISTS (SELECT 1 FROM exam_teachers et WHERE et.exam_id = e.id AND et.teacher_id = ?))
		ORDER BY e.created_at DESC
	`).bind(locals.user.school_id, locals.user.id, locals.user.id).all();
  return { exams: exams.results };
};
export {
  load
};
