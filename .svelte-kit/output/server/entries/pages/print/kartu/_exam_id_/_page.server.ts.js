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
		SELECT p.id as participant_id, u.id as user_id, u.name as student_name, u.username, u.nisn, u.nomor_peserta, u.photo, u.place_of_birth, u.date_of_birth, c.name as class_name, u.session_number, r.name as room_name
		FROM exam_participants p
		JOIN users u ON p.student_id = u.id
		LEFT JOIN classes c ON u.class_id = c.id
		LEFT JOIN exam_rooms r ON p.room_id = r.id
		WHERE p.exam_id = ?
		ORDER BY CASE c.level
			WHEN 'I' THEN 1 WHEN 'II' THEN 2 WHEN 'III' THEN 3 WHEN 'IV' THEN 4 WHEN 'V' THEN 5 WHEN 'VI' THEN 6 WHEN 'VII' THEN 7 WHEN 'VIII' THEN 8 WHEN 'IX' THEN 9 WHEN 'X' THEN 10 WHEN 'XI' THEN 11 WHEN 'XII' THEN 12
			WHEN '1' THEN 1 WHEN '2' THEN 2 WHEN '3' THEN 3 WHEN '4' THEN 4 WHEN '5' THEN 5 WHEN '6' THEN 6 WHEN '7' THEN 7 WHEN '8' THEN 8 WHEN '9' THEN 9 WHEN '10' THEN 10 WHEN '11' THEN 11 WHEN '12' THEN 12
			ELSE 99 END ASC, c.name ASC, u.name ASC
	`).bind(examId).all();
  const sessions = await db.prepare("SELECT * FROM exam_sessions WHERE exam_id = ?").bind(examId).all();
  const formattedParticipants = participants.results.map((p) => {
    const isNomorPesertaMode = p.username === p.nomor_peserta;
    const sessionRecord = sessions.results.find((s) => s.session_number === p.session_number);
    return {
      ...p,
      login_username: p.username,
      login_password: p.nisn,
      // Password is always NISN in this system
      login_mode_label: isNomorPesertaMode ? "No. Peserta" : "NISN",
      display_nisn: p.nisn,
      display_nomor_peserta: p.nomor_peserta || "-",
      session_time: sessionRecord ? `${sessionRecord.start_time?.slice(11, 16) || "?"} - ${sessionRecord.end_time?.slice(11, 16) || "?"}` : null
    };
  });
  const roomsCount = await db.prepare("SELECT COUNT(*) as count FROM exam_rooms WHERE exam_id = ?").bind(examId).first();
  const hasRooms = (roomsCount?.count || 0) > 0;
  return {
    school,
    exam,
    participants: formattedParticipants,
    hasSessions: sessions.results.length > 0,
    hasRooms
  };
};
export {
  load
};
