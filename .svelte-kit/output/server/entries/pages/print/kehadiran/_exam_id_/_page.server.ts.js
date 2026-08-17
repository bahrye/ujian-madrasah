import { g as getDB, b as ensureProctorRoleColumn } from "../../../../../chunks/db.js";
import { error } from "@sveltejs/kit";
const load = async ({ platform, params, locals }) => {
  const db = getDB(platform);
  await ensureProctorRoleColumn(db);
  const examIdStr = params.exam_id;
  const examId = parseInt(examIdStr, 10);
  if (isNaN(examId)) throw error(400, "ID Ujian tidak valid");
  const school = await db.prepare("SELECT * FROM schools WHERE id = ?").bind(locals.user.school_id).first();
  const exam = await db.prepare("SELECT e.*, s.name as subject_name, et.name as exam_type_name FROM exams e LEFT JOIN subjects s ON e.subject_id = s.id LEFT JOIN exam_types et ON e.exam_type_id = et.id WHERE e.id = ? AND e.school_id = ?").bind(examId, locals.user.school_id).first();
  if (!exam) throw error(404, "Ujian tidak ditemukan");
  const participants = await db.prepare(`
		SELECT ep.id as participant_id, u.id as user_id, u.name as student_name, u.username, u.nisn, u.nomor_peserta, c.name as class_name, sa.signature, u.session_number, er.name as room_name
		FROM exam_participants ep
		JOIN users u ON ep.student_id = u.id
		LEFT JOIN classes c ON u.class_id = c.id
		LEFT JOIN exam_rooms er ON ep.room_id = er.id
		LEFT JOIN student_attempts sa ON sa.student_id = u.id AND sa.exam_id = ep.exam_id
		WHERE ep.exam_id = ?
		ORDER BY er.name, u.session_number, c.name, u.name
	`).bind(examId).all();
  const sample = await db.prepare("SELECT username, nisn, nomor_peserta FROM users WHERE school_id = ? AND role = 'siswa' AND nomor_peserta IS NOT NULL LIMIT 1").bind(locals.user.school_id).first();
  const isNomorPesertaMode = sample && sample.username === sample.nomor_peserta;
  const sessionsCount = await db.prepare("SELECT COUNT(*) as count FROM exam_sessions WHERE exam_id = ?").bind(examId).first();
  const hasSessions = (sessionsCount?.count || 0) > 0;
  const roomsCount = await db.prepare("SELECT COUNT(*) as count FROM exam_rooms WHERE exam_id = ?").bind(examId).first();
  const hasRooms = (roomsCount?.count || 0) > 0;
  const sessionRecords = await db.prepare("SELECT * FROM exam_sessions WHERE exam_id = ?").bind(examId).all();
  const sessionMap = {};
  if (sessionRecords.results) {
    for (const s of sessionRecords.results) {
      sessionMap[s.session_number] = s;
    }
  }
  const assignedProctorsRes = await db.prepare(`
		SELECT DISTINCT u.id, u.name, u.nip, u.role, COALESCE(ep.proctor_role, 'p1') as proctor_role
		FROM exam_proctors ep
		JOIN users u ON ep.proctor_id = u.id
		WHERE ep.exam_id = ?
		ORDER BY ep.id ASC
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
  const p1Obj = assignedProctors.find((p) => p.proctor_role === "p1" || p.proctor_role === "Pengawas 1");
  const p2Obj = assignedProctors.find((p) => p.proctor_role === "p2" || p.proctor_role === "Pengawas 2");
  const defaultProctor1Id = p1Obj?.id || assignedProctors[0]?.id || proctorOptions[0]?.id || "";
  const defaultProctor2Id = p2Obj?.id || (assignedProctors.length > 1 && assignedProctors[1]?.id !== defaultProctor1Id ? assignedProctors[1]?.id : "");
  const results = participants.results;
  const participantsGrouped = results.reduce((acc, p) => {
    const roomName = p.room_name || "Ruang Ujian";
    const sessionNumber = hasSessions ? p.session_number || 1 : 1;
    if (!acc[roomName]) acc[roomName] = {};
    if (!acc[roomName][sessionNumber]) acc[roomName][sessionNumber] = [];
    acc[roomName][sessionNumber].push(p);
    return acc;
  }, {});
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
