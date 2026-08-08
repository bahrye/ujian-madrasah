import { json } from "@sveltejs/kit";
import { g as getDB } from "../../../../../../chunks/db.js";
const GET = async ({ params, platform, locals }) => {
  const user = locals.user;
  if (!user || !["admin", "superadmin", "guru", "pengawas"].includes(user.role)) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  const db = getDB(platform);
  const examId = params.id;
  const isSuperAdmin = user.role === "superadmin";
  const exam = isSuperAdmin ? await db.prepare("SELECT id FROM exams WHERE id = ?").bind(examId).first() : await db.prepare("SELECT id FROM exams WHERE id = ? AND school_id = ?").bind(examId, user.school_id).first();
  if (!exam) {
    return json({ error: "Exam not found or unauthorized" }, { status: 404 });
  }
  const questionsResult = await db.prepare(`
		SELECT id, question_number, type, question_text, points
		FROM questions
		WHERE exam_id = ?
		ORDER BY question_number ASC, id ASC
	`).bind(examId).all();
  return json({ questions: questionsResult.results });
};
export {
  GET
};
