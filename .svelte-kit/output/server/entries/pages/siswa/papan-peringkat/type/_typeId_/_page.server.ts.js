import { g as getDB } from "../../../../../../chunks/db.js";
import { redirect, error } from "@sveltejs/kit";
const load = async ({ platform, locals, params }) => {
  if (locals.user?.role !== "siswa") throw redirect(302, "/");
  const db = getDB(platform);
  const typeId = params.typeId;
  const classId = locals.user.class_id;
  const schoolId = locals.user.school_id;
  if (!classId) {
    throw error(400, "Anda belum terdaftar dalam kelas mana pun.");
  }
  const examType = await db.prepare(`
		SELECT DISTINCT et.id, et.name, et.code 
		FROM exam_types et
		JOIN exams e ON et.id = e.exam_type_id
		JOIN exam_participants ep ON e.id = ep.exam_id
		WHERE et.id = ? AND et.school_id = ? AND ep.student_id = ?
	`).bind(typeId, schoolId, locals.user.id).first();
  if (!examType) {
    throw error(404, "Tipe ujian tidak ditemukan atau Anda tidak terdaftar pada ujian jenis ini.");
  }
  const leaderboardQuery = await db.prepare(`
		SELECT 
			u.name as student_name,
			u.photo,
			SUM(sa.score) as total_score, 
			AVG(sa.score) as avg_score,
			SUM(julianday(sa.submit_time) - julianday(sa.start_time)) as total_time,
			COUNT(sa.id) as exams_completed
		FROM student_attempts sa
		JOIN users u ON sa.student_id = u.id
		JOIN exams e ON sa.exam_id = e.id
		WHERE e.exam_type_id = ? AND sa.status = 'selesai' AND u.class_id = ?
		GROUP BY u.id
		ORDER BY total_score DESC, avg_score DESC, total_time ASC
	`).bind(typeId, classId).all();
  return {
    examType,
    leaderboard: leaderboardQuery.results || []
  };
};
export {
  load
};
