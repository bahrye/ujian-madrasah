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
  let classData = null;
  if (!isNaN(classId)) {
    classData = await db.prepare("SELECT * FROM classes WHERE id = ? AND school_id = ?").bind(classId, locals.user.school_id).first();
  }
  let scheduleQuery = `
		SELECT DISTINCT
			e.id,
			e.title,
			e.start_time,
			e.end_time,
			s.name as subject_name,
			et.name as exam_type_name,
			(
				SELECT GROUP_CONCAT(u2.name, '||')
				FROM exam_proctors epr
				JOIN users u2 ON epr.proctor_id = u2.id
				WHERE epr.exam_id = e.id
			) as proctor_names
		FROM exams e
		JOIN exam_types et ON e.exam_type_id = et.id
		LEFT JOIN subjects s ON e.subject_id = s.id
	`;
  let whereClauses = ["e.exam_type_id = ?", "e.school_id = ?", "e.is_active = 1"];
  let queryParams = [typeId, locals.user.school_id];
  if (!isNaN(classId)) {
    scheduleQuery += ` JOIN exam_participants ep ON ep.exam_id = e.id JOIN users u ON ep.student_id = u.id `;
    whereClauses.push("u.class_id = ?");
    queryParams.push(classId);
  }
  scheduleQuery += ` WHERE ` + whereClauses.join(" AND ") + ` ORDER BY e.start_time ASC, e.id ASC`;
  const schedulesRes = await db.prepare(scheduleQuery).bind(...queryParams).all();
  let rawSchedules = schedulesRes.results || [];
  if (rawSchedules.length > 0) {
    const examIds = rawSchedules.map((s) => s.id);
    const placeholders = examIds.map(() => "?").join(",");
    try {
      const sessionsQuery = await db.prepare(`SELECT * FROM exam_sessions WHERE exam_id IN (${placeholders}) ORDER BY session_number ASC`).bind(...examIds).all();
      const sessionsByExam = /* @__PURE__ */ new Map();
      for (const row of sessionsQuery.results || []) {
        if (!sessionsByExam.has(row.exam_id)) sessionsByExam.set(row.exam_id, []);
        sessionsByExam.get(row.exam_id).push(row);
      }
      rawSchedules = rawSchedules.map((schedule) => {
        const examSessions = sessionsByExam.get(schedule.id) || [];
        if (examSessions.length > 0) {
          return {
            ...schedule,
            start_time: examSessions[0].start_time || schedule.start_time,
            end_time: examSessions[examSessions.length - 1].end_time || schedule.end_time
          };
        }
        return schedule;
      });
    } catch (e) {
      console.warn("Failed to fetch exam_sessions for print:", e);
    }
  }
  const committee = await db.prepare(`
		SELECT u.name, u.nip
		FROM exam_type_proctors etp
		JOIN users u ON etp.proctor_id = u.id
		WHERE etp.exam_type_id = ? AND etp.proctor_role = 'cm'
		ORDER BY etp.id ASC
		LIMIT 1
	`).bind(typeId).first();
  return {
    school,
    examType,
    classData,
    schedules: rawSchedules,
    committeeName: committee?.name || null,
    committeeNip: committee?.nip || null
  };
};
export {
  load
};
