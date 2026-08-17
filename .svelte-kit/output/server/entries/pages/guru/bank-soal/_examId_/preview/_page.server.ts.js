import { redirect } from "@sveltejs/kit";
import { g as getDB } from "../../../../../../chunks/db.js";
const load = async ({ platform, locals, params }) => {
  const db = getDB(platform);
  const examId = params.examId;
  const exam = await db.prepare(`
		SELECT id, title, duration_minutes FROM exams 
		WHERE id = ? AND school_id = ? 
		  AND (created_by = ? OR EXISTS (SELECT 1 FROM exam_teachers et WHERE et.exam_id = exams.id AND et.teacher_id = ?))
	`).bind(examId, locals.user.school_id, locals.user.id, locals.user.id).first();
  if (!exam) {
    throw redirect(302, "/guru/bank-soal");
  }
  const questions = await db.prepare("SELECT * FROM questions WHERE exam_id = ? ORDER BY question_number ASC").bind(examId).all();
  return {
    exam,
    questions: questions.results
  };
};
export {
  load
};
