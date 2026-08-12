import { g as getDB } from "../../../../../../chunks/db.js";
import { error } from "@sveltejs/kit";
const load = async ({ platform, params, locals, url }) => {
  const db = getDB(platform);
  const typeIdStr = params.typeId;
  const typeId = parseInt(typeIdStr, 10);
  if (isNaN(typeId)) throw error(400, "ID Tipe Ujian tidak valid");
  const school = await db.prepare("SELECT * FROM schools WHERE id = ?").bind(locals.user.school_id).first();
  const examType = await db.prepare("SELECT * FROM exam_types WHERE id = ? AND school_id = ?").bind(typeId, locals.user.school_id).first();
  if (!examType) throw error(404, "Tipe Ujian tidak ditemukan");
  const classIdStr = url.searchParams.get("class_id");
  const classId = parseInt(classIdStr || "", 10);
  let query = `
		SELECT u.id as user_id, u.name as student_name, u.nisn, u.nomor_peserta, c.name as class_name, u.session_number
		FROM users u
		JOIN classes c ON u.class_id = c.id
		JOIN exam_type_classes etc ON etc.class_id = u.class_id
		WHERE u.school_id = ? AND u.role = 'siswa' AND u.is_active = 1 AND etc.exam_type_id = ?
	`;
  let paramsArr = [locals.user.school_id, typeId];
  if (!isNaN(classId)) {
    query += ` AND u.class_id = ?`;
    paramsArr.push(classId);
  }
  query += ` ORDER BY CASE c.level
		WHEN 'I' THEN 1 WHEN 'II' THEN 2 WHEN 'III' THEN 3 WHEN 'IV' THEN 4 WHEN 'V' THEN 5 WHEN 'VI' THEN 6 WHEN 'VII' THEN 7 WHEN 'VIII' THEN 8 WHEN 'IX' THEN 9 WHEN 'X' THEN 10 WHEN 'XI' THEN 11 WHEN 'XII' THEN 12
		WHEN '1' THEN 1 WHEN '2' THEN 2 WHEN '3' THEN 3 WHEN '4' THEN 4 WHEN '5' THEN 5 WHEN '6' THEN 6 WHEN '7' THEN 7 WHEN '8' THEN 8 WHEN '9' THEN 9 WHEN '10' THEN 10 WHEN '11' THEN 11 WHEN '12' THEN 12
		ELSE 99 END ASC, c.name ASC, u.name ASC`;
  const participants = await db.prepare(query).bind(...paramsArr).all();
  const scheduleQuery = `
		SELECT ep.student_id, e.title, s.name as subject_name, substr(e.start_time, 1, 10) as date, 
           u.session_number as student_session_number, es.start_time as session_start_time, es.end_time as session_end_time, 
           r.name as room_name, (SELECT COUNT(*) FROM exam_sessions WHERE exam_id = e.id) > 0 as has_sessions, e.start_time as exam_start_time, e.end_time as exam_end_time
    FROM exam_participants ep
    JOIN exams e ON ep.exam_id = e.id
    JOIN users u ON ep.student_id = u.id
    LEFT JOIN subjects s ON e.subject_id = s.id
    LEFT JOIN exam_rooms r ON ep.room_id = r.id
    LEFT JOIN exam_sessions es ON e.id = es.exam_id AND es.session_number = u.session_number
    WHERE e.exam_type_id = ? AND e.school_id = ?
		ORDER BY e.start_time ASC
	`;
  const schedules = await db.prepare(scheduleQuery).bind(typeId, locals.user.school_id).all();
  const scheduleByStudent = {};
  for (const row of schedules.results) {
    const studentId = String(row.student_id);
    if (!scheduleByStudent[studentId]) {
      scheduleByStudent[studentId] = [];
    }
    let startTime = row.exam_start_time;
    let endTime = row.exam_end_time;
    if (row.has_sessions) {
      startTime = row.session_start_time || row.exam_start_time;
      endTime = row.session_end_time || row.exam_end_time;
    }
    scheduleByStudent[studentId].push({
      exam_title: row.title,
      subject_name: row.subject_name,
      date: row.date,
      start_time: startTime,
      end_time: endTime,
      room_name: row.room_name || "-",
      has_sessions: row.has_sessions,
      session_number: row.student_session_number
    });
  }
  const formattedParticipants = participants.results.map((p) => {
    return {
      ...p,
      schedules: scheduleByStudent[String(p.user_id)] || []
    };
  });
  return {
    school,
    examType,
    participants: formattedParticipants
  };
};
export {
  load
};
