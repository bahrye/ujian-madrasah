import { g as getDB } from "../../../../../chunks/db.js";
import { error } from "@sveltejs/kit";
const load = async ({ platform, params, locals }) => {
  const db = getDB(platform);
  const examIdStr = params.exam_id;
  const examId = parseInt(examIdStr, 10);
  if (isNaN(examId)) throw error(400, "ID Ujian tidak valid");
  const school = await db.prepare("SELECT * FROM schools WHERE id = ?").bind(locals.user.school_id).first();
  const exam = await db.prepare("SELECT e.*, s.name as subject_name, et.name as exam_type_name FROM exams e LEFT JOIN subjects s ON e.subject_id = s.id LEFT JOIN exam_types et ON e.exam_type_id = et.id WHERE e.id = ? AND e.school_id = ?").bind(examId, locals.user.school_id).first();
  if (!exam) throw error(404, "Ujian tidak ditemukan");
  const participantsGroupedRaw = await db.prepare(`
		SELECT r.name as room_name, u.session_number, COUNT(p.id) as count
		FROM exam_participants p
		JOIN users u ON p.student_id = u.id
		LEFT JOIN exam_rooms r ON p.room_id = r.id
		WHERE p.exam_id = ?
		GROUP BY r.id, r.name, u.session_number
		ORDER BY r.name, u.session_number
	`).bind(examId).all();
  const participantsGrouped = participantsGroupedRaw.results.reduce((acc, row) => {
    const roomName = row.room_name || "Ruang Default";
    const sessionNumber = row.session_number || 1;
    if (!acc[roomName]) acc[roomName] = {};
    acc[roomName][sessionNumber] = row.count;
    return acc;
  }, {});
  const sample = await db.prepare("SELECT username, nisn, nomor_peserta FROM users WHERE school_id = ? AND role = 'siswa' AND nomor_peserta IS NOT NULL LIMIT 1").bind(locals.user.school_id).first();
  const isNomorPesertaMode = sample && sample.username === sample.nomor_peserta;
  return {
    school,
    exam,
    participantsGrouped,
    isNomorPesertaMode
  };
};
export {
  load
};
