import { fail, redirect } from "@sveltejs/kit";
import { g as getDB } from "../../../../chunks/db.js";
import { d as deleteFromCloudinary } from "../../../../chunks/cloudinary.js";
import { b as private_env } from "../../../../chunks/shared-server.js";
import { f as formatExamTitle } from "../../../../chunks/exam.js";
import { p as parseDate } from "../../../../chunks/date.js";
const load = async ({ platform, url, locals }) => {
  if (!locals.user) throw redirect(302, "/login");
  try {
    const db = getDB(platform);
    const examFilterStr = url.searchParams.get("exam_id") || "";
    const examFilter = parseInt(examFilterStr, 10);
    const sessionFilterStr = url.searchParams.get("session_number") || "";
    const sessionFilter = parseInt(sessionFilterStr, 10);
    const rawExams = await db.prepare(`
			SELECT e.id, e.title, s.name as subject_name, et.code as exam_type_code, c.name as class_name
			FROM exams e 
			LEFT JOIN subjects s ON e.subject_id = s.id
			LEFT JOIN exam_types et ON e.exam_type_id = et.id
			LEFT JOIN classes c ON e.class_id = c.id
			WHERE e.school_id = ?
			ORDER BY e.is_active DESC, e.title ASC
		`).bind(locals.user.school_id).all();
    const exams = (rawExams.results || []).map((e) => ({
      id: e.id,
      title: formatExamTitle({
        title: e.title,
        examTypeCode: e.exam_type_code,
        subjectName: e.subject_name,
        className: e.class_name
      })
    }));
    let availableSessions = [];
    if (!isNaN(examFilter)) {
      const dbSessions = await db.prepare(`
				SELECT session_number FROM exam_sessions WHERE exam_id = ? ORDER BY session_number
			`).bind(examFilter).all();
      if (dbSessions.results && dbSessions.results.length > 0) {
        availableSessions = dbSessions.results.map((s) => s.session_number);
      } else {
        availableSessions = [];
      }
    }
    let attempts = [];
    if (!isNaN(examFilter)) {
      let query = `
				SELECT 
					epart.student_id,
					u.name as student_name, 
					u.username, 
					COALESCE(u.session_number, 1) as student_session_number,
					e.title as exam_title,
					e.duration_minutes,
					(SELECT COUNT(*) FROM questions WHERE exam_id = e.id) as question_count,
					sa.id as attempt_id,
					sa.start_time,
					sa.end_time,
					sa.submit_time,
					sa.score,
					sa.total_points,
					sa.status,
					sa.violation_count,
					sa.violation_logs,
					sa.is_paused,
					sa.paused_at,
					sa.signature
				FROM exam_participants epart
				JOIN users u ON epart.student_id = u.id
				JOIN exams e ON epart.exam_id = e.id
				LEFT JOIN student_attempts sa ON sa.student_id = epart.student_id AND sa.exam_id = epart.exam_id
				WHERE epart.exam_id = ? AND e.school_id = ?
			`;
      const bindings = [examFilter, locals.user.school_id];
      if (availableSessions.length > 0 && !isNaN(sessionFilter) && availableSessions.includes(sessionFilter)) {
        query += ` AND COALESCE(u.session_number, 1) = ?`;
        bindings.push(sessionFilter);
      }
      query += `
				ORDER BY 
					CASE WHEN sa.status = 'mengerjakan' THEN 1 
						 WHEN sa.status IS NULL THEN 2 
						 ELSE 3 END ASC,
					u.name ASC
			`;
      const result = await db.prepare(query).bind(...bindings).all();
      attempts = result.results || [];
    }
    let answeredCountsMap = {};
    const attemptIds = attempts.map((a) => a.attempt_id).filter((id) => id);
    if (attemptIds.length > 0) {
      const countsResult = await db.prepare(`
				SELECT sa.attempt_id, COUNT(*) as c
				FROM student_answers sa
				JOIN student_attempts st ON sa.attempt_id = st.id
				WHERE st.exam_id = ? AND sa.answer_given IS NOT NULL AND sa.answer_given != '' AND sa.answer_given != '[]' AND sa.answer_given != '{}'
				GROUP BY sa.attempt_id
			`).bind(examFilter).all();
      (countsResult.results || []).forEach((r) => {
        answeredCountsMap[r.attempt_id] = r.c;
      });
    }
    const attemptsWithProgress = attempts.map((a) => {
      let status = a.status || "belum_mulai";
      let answeredCount = a.attempt_id ? answeredCountsMap[a.attempt_id] || 0 : 0;
      let warnings = a.violation_count || 0;
      let warningLogs = [];
      try {
        warningLogs = a.violation_logs ? JSON.parse(a.violation_logs) : [];
      } catch (e) {
      }
      return {
        ...a,
        id: a.attempt_id || `no_attempt_${a.student_id}`,
        attempt_id: a.attempt_id,
        status,
        answeredCount,
        warnings,
        warningLogs,
        is_paused: a.is_paused,
        paused_at: a.paused_at
      };
    });
    return {
      exams,
      attempts: attemptsWithProgress,
      examFilter: isNaN(examFilter) ? "" : String(examFilter),
      availableSessions,
      sessionFilter: !isNaN(sessionFilter) ? String(sessionFilter) : ""
    };
  } catch (err) {
    console.error("Load Error in monitor page:", err);
    return { exams: [], attempts: [], examFilter: "", availableSessions: [], sessionFilter: "", loadError: err.message || String(err) };
  }
};
const actions = {
  togglePause: async ({ request, platform, locals }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });
    const db = getDB(platform);
    const form = await request.formData();
    const attemptIdStr = form.get("attempt_id")?.toString();
    const action = form.get("action")?.toString();
    const parsedAttemptId = parseInt(attemptIdStr || "", 10);
    if (isNaN(parsedAttemptId) || !action) return fail(400, { error: "Data tidak valid." });
    try {
      const attemptData = await db.prepare(`
				SELECT sa.id, sa.is_paused, sa.paused_at, sa.end_time FROM student_attempts sa
				JOIN exams e ON sa.exam_id = e.id
				WHERE sa.id = ? AND e.school_id = ?
			`).bind(parsedAttemptId, locals.user.school_id).first();
      if (!attemptData) return fail(403, { error: "Sesi ujian tidak ditemukan atau bukan milik sekolah Anda." });
      if (action === "pause") {
        await db.prepare(`UPDATE student_attempts SET is_paused = 1, paused_at = datetime('now') WHERE id = ?`).bind(parsedAttemptId).run();
        return { success: "Ujian berhasil ditahan." };
      } else if (action === "resume") {
        if (attemptData.paused_at && attemptData.end_time) {
          const pausedAtMs = parseDate(attemptData.paused_at).getTime();
          const nowMs = Date.now();
          const diffSeconds = Math.max(0, Math.round((nowMs - pausedAtMs) / 1e3));
          const newEndTime = new Date(parseDate(attemptData.end_time).getTime() + diffSeconds * 1e3);
          const formattedEndTime = newEndTime.toISOString().replace("T", " ").replace(/\..+/, "");
          await db.prepare(`
						UPDATE student_attempts 
						SET 
							is_paused = 0, 
							paused_at = NULL,
							end_time = ?
						WHERE id = ?
					`).bind(formattedEndTime, parsedAttemptId).run();
        } else {
          await db.prepare(`UPDATE student_attempts SET is_paused = 0, paused_at = NULL WHERE id = ?`).bind(parsedAttemptId).run();
        }
        return { success: "Ujian berhasil dilanjutkan." };
      }
      return fail(400, { error: "Aksi tidak valid." });
    } catch (e) {
      console.error(e);
      return fail(500, { error: e.message || "Gagal mengubah status ujian" });
    }
  },
  resetAttempt: async ({ request, platform, locals }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });
    const db = getDB(platform);
    const form = await request.formData();
    const attemptIdStr = form.get("attempt_id")?.toString();
    const parsedAttemptId = parseInt(attemptIdStr || "", 10);
    if (isNaN(parsedAttemptId)) return fail(400, { error: "ID tidak valid." });
    try {
      const attemptCheck = await db.prepare(`
				SELECT sa.id, sa.signature FROM student_attempts sa
				JOIN exams e ON sa.exam_id = e.id
				WHERE sa.id = ? AND e.school_id = ?
			`).bind(parsedAttemptId, locals.user.school_id).first();
      if (!attemptCheck) {
        return fail(403, { error: "Sesi ujian tidak ditemukan atau bukan milik sekolah Anda." });
      }
      if (attemptCheck.signature && attemptCheck.signature.includes("res.cloudinary.com")) {
        const mergedEnv = platform?.env || private_env;
        await deleteFromCloudinary(attemptCheck.signature, mergedEnv);
      }
      await db.batch([
        db.prepare("DELETE FROM student_answers WHERE attempt_id = ?").bind(parsedAttemptId),
        db.prepare("DELETE FROM student_attempts WHERE id = ?").bind(parsedAttemptId)
      ]);
      return { success: "Sesi ujian siswa berhasil direset." };
    } catch (e) {
      console.error(e);
      return fail(500, { error: e.message || "Gagal mereset sesi ujian" });
    }
  }
};
export {
  actions,
  load
};
