import { g as getDB } from "../../../../../../chunks/db.js";
import { error } from "@sveltejs/kit";
async function fetchSchedulesForClass(db, typeId, schoolId, classId) {
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
  let queryParams = [typeId, schoolId];
  if (classId !== null) {
    scheduleQuery += ` LEFT JOIN exam_participants ep ON ep.exam_id = e.id LEFT JOIN users u ON ep.student_id = u.id `;
    whereClauses.push("(e.class_id = ? OR e.class_id IS NULL OR u.class_id = ?)");
    queryParams.push(classId, classId);
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
  return rawSchedules;
}
const load = async ({ platform, params, locals, url }) => {
  const db = getDB(platform);
  const typeIdStr = params.typeId;
  const typeId = parseInt(typeIdStr, 10);
  const schoolId = Number(locals.user?.school_id || 0);
  if (isNaN(typeId)) throw error(400, "ID Tipe Ujian tidak valid");
  const school = await db.prepare("SELECT * FROM schools WHERE id = ?").bind(schoolId).first();
  const examType = await db.prepare("SELECT * FROM exam_types WHERE id = ? AND school_id = ?").bind(typeId, schoolId).first();
  if (!examType) throw error(404, "Tipe Ujian tidak ditemukan");
  const classIdStr = url.searchParams.get("class_id");
  const classId = parseInt(classIdStr || "", 10);
  let targetClasses = [];
  if (!isNaN(classId)) {
    const c = await db.prepare("SELECT id, name FROM classes WHERE id = ? AND school_id = ?").bind(classId, schoolId).first();
    if (c) targetClasses = [c];
  } else {
    const cRes = await db.prepare(`
			SELECT c.id, c.name
			FROM classes c
			INNER JOIN exam_type_classes etc ON etc.class_id = c.id
			WHERE etc.exam_type_id = ? AND c.school_id = ?
			ORDER BY CASE c.level
				WHEN 'I' THEN 1 WHEN 'II' THEN 2 WHEN 'III' THEN 3 WHEN 'IV' THEN 4 WHEN 'V' THEN 5 WHEN 'VI' THEN 6 WHEN 'VII' THEN 7 WHEN 'VIII' THEN 8 WHEN 'IX' THEN 9 WHEN 'X' THEN 10 WHEN 'XI' THEN 11 WHEN 'XII' THEN 12
				WHEN '1' THEN 1 WHEN '2' THEN 2 WHEN '3' THEN 3 WHEN '4' THEN 4 WHEN '5' THEN 5 WHEN '6' THEN 6 WHEN '7' THEN 7 WHEN '8' THEN 8 WHEN '9' THEN 9 WHEN '10' THEN 10 WHEN '11' THEN 11 WHEN '12' THEN 12
				ELSE 99 END ASC, c.name ASC
		`).bind(typeId, schoolId).all();
    targetClasses = cRes.results || [];
    if (targetClasses.length === 0) {
      const fallbackRes = await db.prepare(`
				SELECT DISTINCT c.id, c.name
				FROM classes c
				JOIN users u ON u.class_id = c.id
				JOIN exam_participants ep ON ep.student_id = u.id
				JOIN exams e ON ep.exam_id = e.id
				WHERE e.exam_type_id = ? AND e.school_id = ? AND e.is_active = 1
				ORDER BY c.name ASC
			`).bind(typeId, schoolId).all();
      targetClasses = fallbackRes.results || [];
    }
  }
  const classSchedulesList = [];
  if (targetClasses.length === 0) {
    const schedules = await fetchSchedulesForClass(db, typeId, schoolId, null);
    classSchedulesList.push({
      classData: null,
      schedules
    });
  } else {
    for (const cls of targetClasses) {
      const schedules = await fetchSchedulesForClass(db, typeId, schoolId, cls.id);
      classSchedulesList.push({
        classData: cls,
        schedules
      });
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
    classList: classSchedulesList,
    committeeName: committee?.name || null,
    committeeNip: committee?.nip || null
  };
};
export {
  load
};
