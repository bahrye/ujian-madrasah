import { g as getDB } from "../../../../chunks/db.js";
const load = async ({ platform, locals }) => {
  const db = getDB(platform);
  const exams = await db.prepare(`
		SELECT e.*, (SELECT COUNT(*) FROM questions WHERE exam_id = e.id) as question_count
		FROM exams e WHERE e.school_id = ? ORDER BY e.created_at DESC
	`).bind(locals.user.school_id).all();
  return { exams: exams.results };
};
export {
  load
};
