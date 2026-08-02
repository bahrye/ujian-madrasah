import { g as getDB } from "../../../chunks/db.js";
const load = async ({ platform }) => {
  const db = getDB(platform);
  const [examCount, questionCount, pendingGrading] = await Promise.all([
    db.prepare("SELECT COUNT(*) as c FROM exams").first(),
    db.prepare("SELECT COUNT(*) as c FROM questions").first(),
    db.prepare(`SELECT COUNT(*) as c FROM student_answers sa
			JOIN questions q ON sa.question_id = q.id
			WHERE q.type IN ('essay', 'isian_singkat') AND sa.score_given IS NULL`).first()
  ]);
  const recentExams = await db.prepare(`
		SELECT e.*, (SELECT COUNT(*) FROM questions WHERE exam_id = e.id) as question_count
		FROM exams e ORDER BY e.created_at DESC LIMIT 5
	`).all();
  return {
    stats: {
      totalExams: examCount?.c ?? 0,
      totalQuestions: questionCount?.c ?? 0,
      pendingGrading: pendingGrading?.c ?? 0
    },
    recentExams: recentExams.results
  };
};
export {
  load
};
