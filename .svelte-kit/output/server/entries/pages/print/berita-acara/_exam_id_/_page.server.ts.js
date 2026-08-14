import { g as getDB } from "../../../../../chunks/db.js";
import { error } from "@sveltejs/kit";
const load = async ({ platform, params, locals }) => {
  const db = getDB(platform);
  const examIdStr = params.exam_id;
  const examId = parseInt(examIdStr, 10);
  if (isNaN(examId)) throw error(400, "ID Ujian tidak valid");
  const school = await db.prepare("SELECT * FROM schools WHERE id = ?").bind(locals.user.school_id).first();
  const exam = await db.prepare(`
		SELECT e.*, s.name as subject_name, et.name as exam_type_name,
		       et.start_time as exam_type_start_time, et.end_time as exam_type_end_time
		FROM exams e 
		LEFT JOIN subjects s ON e.subject_id = s.id 
		LEFT JOIN exam_types et ON e.exam_type_id = et.id 
		WHERE e.id = ? AND e.school_id = ?
	`).bind(examId, locals.user.school_id).first();
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
  const sessionsCount = await db.prepare("SELECT COUNT(*) as count FROM exam_sessions WHERE exam_id = ?").bind(examId).first();
  const hasSessions = (sessionsCount?.count || 0) > 0;
  const roomsCount = await db.prepare("SELECT COUNT(*) as count FROM exam_rooms WHERE exam_id = ?").bind(examId).first();
  const hasRooms = (roomsCount?.count || 0) > 0;
  const participantsGrouped = participantsGroupedRaw.results.reduce((acc, row) => {
    const roomName = row.room_name || "Ruang Ujian";
    const sessionNumber = hasSessions ? row.session_number || 1 : 1;
    if (!acc[roomName]) acc[roomName] = {};
    acc[roomName][sessionNumber] = (acc[roomName][sessionNumber] || 0) + row.count;
    return acc;
  }, {});
  const sample = await db.prepare("SELECT username, nisn, nomor_peserta FROM users WHERE school_id = ? AND role = 'siswa' AND nomor_peserta IS NOT NULL LIMIT 1").bind(locals.user.school_id).first();
  const isNomorPesertaMode = sample && sample.username === sample.nomor_peserta;
  const sessionRecords = await db.prepare("SELECT * FROM exam_sessions WHERE exam_id = ?").bind(examId).all();
  const sessionMap = {};
  if (sessionRecords.results) {
    for (const s of sessionRecords.results) {
      sessionMap[s.session_number] = s;
    }
  }
  const assignedProctorsRes = await db.prepare(`
		SELECT DISTINCT u.id, u.name, u.nip, u.role
		FROM exam_proctors ep
		JOIN users u ON ep.proctor_id = u.id
		WHERE ep.exam_id = ?
		ORDER BY u.name ASC
	`).bind(examId).all();
  const schoolTeachersRes = await db.prepare(`
		SELECT id, name, nip, role
		FROM users
		WHERE school_id = ? AND role IN ('guru', 'pengawas', 'admin') AND is_active = 1
		ORDER BY name ASC
	`).bind(locals.user.school_id).all();
  const assignedProctors = assignedProctorsRes.results || [];
  const schoolTeachers = schoolTeachersRes.results || [];
  const assignedIds = new Set(assignedProctors.map((p) => p.id));
  const proctorOptions = [
    ...assignedProctors,
    ...schoolTeachers.filter((t) => !assignedIds.has(t.id))
  ];
  const defaultProctor1Id = assignedProctors[0]?.id || proctorOptions[0]?.id || "";
  const defaultProctor2Id = assignedProctors[1]?.id || "";
  return {
    school,
    exam,
    participantsGrouped,
    isNomorPesertaMode,
    hasSessions,
    hasRooms,
    sessionMap,
    proctorOptions,
    defaultProctor1Id,
    defaultProctor2Id
  };
};
export {
  load
};
