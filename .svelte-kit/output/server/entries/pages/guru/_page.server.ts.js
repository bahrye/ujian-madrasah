import { g as getDB } from "../../../chunks/db.js";
const load = async ({ platform, locals }) => {
  const db = getDB(platform);
  const schoolId = locals.user?.school_id;
  const [examCount, questionCount, pendingGrading] = await Promise.all([
    db.prepare("SELECT COUNT(*) as c FROM exams e WHERE e.school_id = ? AND (e.created_by = ? OR EXISTS (SELECT 1 FROM exam_teachers et WHERE et.exam_id = e.id AND et.teacher_id = ?))").bind(schoolId, locals.user.id, locals.user.id).first(),
    db.prepare(`
			SELECT COUNT(*) as c FROM questions q
			JOIN exams e ON q.exam_id = e.id
			WHERE e.school_id = ? AND (e.created_by = ? OR EXISTS (SELECT 1 FROM exam_teachers et WHERE et.exam_id = e.id AND et.teacher_id = ?))
		`).bind(schoolId, locals.user.id, locals.user.id).first(),
    db.prepare(`SELECT COUNT(*) as c FROM student_answers sa
			JOIN questions q ON sa.question_id = q.id
			JOIN exams e ON q.exam_id = e.id
			WHERE q.type IN ('essay', 'isian_singkat') AND sa.score_given IS NULL 
			AND e.school_id = ? AND (e.created_by = ? OR EXISTS (SELECT 1 FROM exam_teachers et WHERE et.exam_id = e.id AND et.teacher_id = ?))
		`).bind(schoolId, locals.user.id, locals.user.id).first()
  ]);
  const recentExams = await db.prepare(`
		SELECT e.*, (SELECT COUNT(*) FROM questions WHERE exam_id = e.id) as question_count
		FROM exams e 
		WHERE e.school_id = ? AND (e.created_by = ? OR EXISTS (SELECT 1 FROM exam_teachers et WHERE et.exam_id = e.id AND et.teacher_id = ?))
		ORDER BY e.created_at DESC LIMIT 5
	`).bind(schoolId, locals.user.id, locals.user.id).all();
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
