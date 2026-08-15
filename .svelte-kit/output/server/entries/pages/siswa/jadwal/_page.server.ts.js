import { g as getDB } from "../../../../chunks/db.js";
import { redirect } from "@sveltejs/kit";
const load = async ({ platform, locals }) => {
  if (locals.user?.role !== "siswa") throw redirect(302, "/");
  const db = getDB(platform);
  const examsQuery = await db.prepare(`
		SELECT 
			e.*, 
			s.name as subject,
			COALESCE(
				(
					SELECT GROUP_CONCAT(u.name, '||')
					FROM exam_proctors epr
					JOIN users u ON epr.proctor_id = u.id
					WHERE epr.exam_id = e.id
				),
				(
					SELECT u.name FROM users u WHERE u.id = e.created_by AND u.role = 'guru'
				)
			) as proctors,
			(SELECT COUNT(*) FROM questions WHERE exam_id = e.id) as question_count,
			u.session_number as ep_session_number,
			r.name as room_name,
			(SELECT COUNT(*) FROM exam_sessions WHERE exam_id = e.id) > 0 as has_sessions
		FROM exams e
		JOIN exam_participants ep ON e.id = ep.exam_id
		JOIN users u ON ep.student_id = u.id
		LEFT JOIN exam_rooms r ON ep.room_id = r.id
		LEFT JOIN subjects s ON e.subject_id = s.id
		JOIN exam_types et ON e.exam_type_id = et.id
		WHERE ep.student_id = ? AND e.school_id = ? AND e.is_active = 1 AND et.is_active = 1
		ORDER BY CASE WHEN e.start_time IS NULL THEN 1 ELSE 0 END, e.start_time ASC, e.created_at DESC
	`).bind(locals.user.id, locals.user.school_id).all();
  let schedules = examsQuery.results || [];
  let studentSession = 1;
  try {
    const studentRecord = await db.prepare("SELECT session_number FROM users WHERE id = ?").bind(locals.user.id).first();
    if (studentRecord && studentRecord.session_number) {
      studentSession = studentRecord.session_number;
    }
  } catch (e) {
    console.warn("Failed to fetch session_number:", e);
  }
  if (schedules.length > 0) {
    const examIds = schedules.map((s) => s.id);
    const placeholders = examIds.map(() => "?").join(",");
    let sessionsResults = [];
    try {
      const sessionsQuery = await db.prepare(`SELECT * FROM exam_sessions WHERE exam_id IN (${placeholders}) AND session_number = ?`).bind(...examIds, studentSession).all();
      sessionsResults = sessionsQuery.results;
    } catch (e) {
      console.warn("Failed to fetch exam_sessions:", e);
    }
    const sessionMap = /* @__PURE__ */ new Map();
    for (const row of sessionsResults) {
      sessionMap.set(row.exam_id, row);
    }
    schedules = schedules.map((schedule) => {
      const usedSession = schedule.has_sessions ? schedule.ep_session_number || studentSession : null;
      const session = sessionMap.get(schedule.id);
      if (session && usedSession && session.session_number === usedSession) {
        return {
          ...schedule,
          session_number: usedSession,
          session_start_time: session.start_time,
          session_end_time: session.end_time,
          start_time: session.start_time || schedule.start_time,
          end_time: session.end_time || schedule.end_time
        };
      }
      return { ...schedule, session_number: usedSession || void 0 };
    });
  }
  return {
    schedules
  };
};
export {
  load
};
