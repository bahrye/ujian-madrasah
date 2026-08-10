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
  const participants = await db.prepare(`
		SELECT p.id as participant_id, u.id as user_id, u.name as student_name, u.username, u.nisn, u.nomor_peserta, u.photo, u.place_of_birth, u.date_of_birth, c.name as class_name
		FROM exam_participants p
		JOIN users u ON p.student_id = u.id
		LEFT JOIN classes c ON u.class_id = c.id
		WHERE p.exam_id = ?
		ORDER BY c.name, u.name
	`).bind(examId).all();
  const formattedParticipants = participants.results.map((p) => {
    const isNomorPesertaMode = p.username === p.nomor_peserta;
    return {
      ...p,
      login_username: p.username,
      login_password: p.nisn,
      // Password is always NISN in this system
      login_mode_label: isNomorPesertaMode ? "No. Peserta" : "NISN",
      display_nisn: p.nisn,
      display_nomor_peserta: p.nomor_peserta || "-"
    };
  });
  return {
    school,
    exam,
    participants: formattedParticipants
  };
};
export {
  load
};
