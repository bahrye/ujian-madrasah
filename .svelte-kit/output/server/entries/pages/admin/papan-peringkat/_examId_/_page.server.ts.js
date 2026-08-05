import { g as getDB } from "../../../../../chunks/db.js";
import { redirect, error } from "@sveltejs/kit";
const load = async ({ platform, locals, params }) => {
  if (locals.user?.role !== "admin") throw redirect(302, "/");
  const db = getDB(platform);
  const examId = params.examId;
  const schoolId = locals.user.school_id;
  const exam = await db.prepare(`
		SELECT id, title, subject_id FROM exams WHERE id = ? AND school_id = ?
	`).bind(examId, schoolId).first();
  if (!exam) {
    throw error(404, "Ujian tidak ditemukan.");
  }
  const subject = await db.prepare(`
		SELECT name FROM subjects WHERE id = ?
	`).bind(exam.subject_id).first();
  const leaderboardQuery = await db.prepare(`
		SELECT 
			u.name as student_name,
			u.photo,
			c.name as class_name,
			sa.score,
			sa.total_points,
			sa.submit_time,
			sa.start_time
		FROM student_attempts sa
		JOIN users u ON sa.student_id = u.id
		LEFT JOIN classes c ON u.class_id = c.id
		WHERE sa.exam_id = ? AND sa.status = 'selesai'
		ORDER BY sa.score DESC, (julianday(sa.submit_time) - julianday(sa.start_time)) ASC
	`).bind(examId).all();
  return {
    exam: {
      ...exam,
      subject_name: subject ? subject.name : "Ujian"
    },
    leaderboard: leaderboardQuery.results || []
  };
};
export {
  load
};
