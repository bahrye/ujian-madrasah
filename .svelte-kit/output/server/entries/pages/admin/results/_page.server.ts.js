import { g as getDB } from "../../../../chunks/db.js";
const load = async ({ platform, locals }) => {
  const db = getDB(platform);
  const results = await db.prepare(`
		SELECT sa.*, u.name as student_name, e.title as exam_title, s.name as subject
		FROM student_attempts sa
		JOIN users u ON sa.student_id = u.id
		JOIN exams e ON sa.exam_id = e.id
		LEFT JOIN subjects s ON e.subject_id = s.id
		WHERE sa.status IN ('selesai', 'waktu_habis') AND e.school_id = ?
		ORDER BY sa.submit_time DESC
	`).bind(locals.user.school_id).all();
  return { results: results.results };
};
export {
  load
};
