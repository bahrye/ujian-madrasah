import { fail, redirect } from "@sveltejs/kit";
import { g as getDB } from "../../../../chunks/db.js";
import { d as deleteFromCloudinary } from "../../../../chunks/cloudinary.js";
import { b as private_env } from "../../../../chunks/shared-server.js";
const load = async ({ platform, url, locals }) => {
  if (!locals.user) throw redirect(302, "/login");
  try {
    const db = getDB(platform);
    const examFilterStr = url.searchParams.get("exam_id") || "";
    const examFilter = parseInt(examFilterStr, 10);
    const exams = await db.prepare(`
		SELECT e.id, e.title 
		FROM exams e 
		JOIN exam_proctors ep ON e.id = ep.exam_id
		WHERE e.is_active = 1 AND e.school_id = ? AND ep.proctor_id = ?
		ORDER BY e.title
	`).bind(locals.user.school_id, locals.user.id).all();
    let attempts = [];
    if (!isNaN(examFilter)) {
      const result = await db.prepare(`
			SELECT 
				epart.student_id,
				u.name as student_name, 
				u.username, 
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
				sa.paused_at
			FROM exam_participants epart
			JOIN users u ON epart.student_id = u.id
			JOIN exams e ON epart.exam_id = e.id
			JOIN exam_proctors ep ON e.id = ep.exam_id
			LEFT JOIN student_attempts sa ON sa.student_id = epart.student_id AND sa.exam_id = epart.exam_id
			WHERE epart.exam_id = ? AND e.school_id = ? AND ep.proctor_id = ?
			  AND (ep.room_id IS NULL OR ep.room_id = epart.room_id)
			ORDER BY 
				CASE WHEN sa.status = 'mengerjakan' THEN 1 
					 WHEN sa.status IS NULL THEN 2 
					 ELSE 3 END ASC,
				u.name ASC
		`).bind(examFilter, locals.user.school_id, locals.user.id).all();
      attempts = result.results;
    }
    let answeredCountsMap = {};
    const attemptIds = attempts.map((a) => a.attempt_id).filter((id) => id);
    if (attemptIds.length > 0) {
      const countsResult = await db.prepare(`
			SELECT sa.attempt_id, COUNT(*) as c
			FROM student_answers sa
			JOIN student_attempts st ON sa.attempt_id = st.id
			WHERE st.exam_id = ? AND sa.answer_given IS NOT NULL AND sa.answer_given != ''
			GROUP BY sa.attempt_id
		`).bind(examFilter).all();
      countsResult.results.forEach((r) => {
        answeredCountsMap[r.attempt_id] = r.c;
      });
    }
    const kv = platform?.env?.EXAM_ANSWERS;
    const attemptsWithProgress = await Promise.all(
      attempts.map(async (a) => {
        let answeredCount = 0;
        let warnings = 0;
        let warningLogs = [];
        const status = a.status || "belum_mengerjakan";
        if (status === "mengerjakan") {
          if (kv && a.attempt_id) {
            try {
              const stored = await kv.get(`attempt_${a.attempt_id}_answers`);
              if (stored) {
                const data = JSON.parse(stored);
                if (data && data.answers) {
                  answeredCount = Object.values(data.answers).filter((val) => val !== null && val !== "").length;
                }
                if (data && data.warnings) warnings = data.warnings;
                if (data && data.warningLogs) warningLogs = data.warningLogs;
              }
            } catch (e) {
              console.error("KV get error:", e);
            }
          }
          if (answeredCount === 0 && a.attempt_id) {
            answeredCount = answeredCountsMap[a.attempt_id] || 0;
          }
        } else if (status === "selesai" || status === "waktu_habis") {
          warnings = a.violation_count || 0;
          try {
            warningLogs = a.violation_logs ? JSON.parse(a.violation_logs) : [];
          } catch (e) {
          }
          if (a.attempt_id) {
            answeredCount = answeredCountsMap[a.attempt_id] || 0;
          }
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
      })
    );
    return { exams: exams.results, attempts: attemptsWithProgress, examFilter: isNaN(examFilter) ? "" : examFilter };
  } catch (err) {
    console.error("Load Error in monitor page:", err);
    return { exams: [], attempts: [], examFilter: "", loadError: err.message || String(err) };
  }
};
const actions = {
  togglePause: async ({ request, platform, locals }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });
    const db = getDB(platform);
    const form = await request.formData();
    const attemptIdStr = form.get("attempt_id")?.toString();
    const parsedAttemptId = parseInt(attemptIdStr || "", 10);
    const action = form.get("action")?.toString();
    if (isNaN(parsedAttemptId) || !action) return fail(400, { error: "Data tidak valid." });
    const attemptData = await db.prepare(`
			SELECT sa.id, sa.is_paused, sa.paused_at, sa.end_time FROM student_attempts sa
			JOIN exams e ON sa.exam_id = e.id
			JOIN exam_participants ep_part ON sa.student_id = ep_part.student_id AND sa.exam_id = ep_part.exam_id
			JOIN exam_proctors ep ON e.id = ep.exam_id
			WHERE sa.id = ? AND e.school_id = ? AND ep.proctor_id = ?
			  AND (ep.room_id IS NULL OR ep.room_id = ep_part.room_id)
		`).bind(parsedAttemptId, locals.user.school_id, locals.user.id).first();
    if (!attemptData) return fail(403, { error: "Sesi ujian tidak ditemukan atau bukan milik sekolah Anda." });
    try {
      if (action === "pause") {
        await db.prepare(`UPDATE student_attempts SET is_paused = 1, paused_at = datetime('now') WHERE id = ?`).bind(parsedAttemptId).run();
        return { success: "Ujian berhasil ditahan." };
      } else if (action === "resume") {
        if (attemptData.paused_at && attemptData.end_time) {
          await db.prepare(`
						UPDATE student_attempts 
						SET 
							is_paused = 0, 
							paused_at = NULL,
							end_time = datetime(end_time, '+' || cast(round((julianday('now') - julianday(paused_at)) * 86400) as int) || ' seconds')
						WHERE id = ?
					`).bind(parsedAttemptId).run();
        } else {
          await db.prepare(`UPDATE student_attempts SET is_paused = 0, paused_at = NULL WHERE id = ?`).bind(parsedAttemptId).run();
        }
        return { success: "Ujian berhasil dilanjutkan." };
      }
      return fail(400, { error: "Aksi tidak valid." });
    } catch (e) {
      console.error(e);
      return fail(500, { error: e.message || "Gagal mengubah status ujian." });
    }
  },
  resetAttempt: async ({ request, platform, locals }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });
    const db = getDB(platform);
    const form = await request.formData();
    const attemptIdStr = form.get("attempt_id")?.toString();
    const parsedAttemptId = parseInt(attemptIdStr || "", 10);
    if (isNaN(parsedAttemptId)) return fail(400, { error: "ID tidak valid." });
    const attemptCheck = await db.prepare(`
			SELECT sa.id, sa.signature FROM student_attempts sa
			JOIN exams e ON sa.exam_id = e.id
			JOIN exam_participants ep_part ON sa.student_id = ep_part.student_id AND sa.exam_id = ep_part.exam_id
			JOIN exam_proctors ep ON e.id = ep.exam_id
			WHERE sa.id = ? AND e.school_id = ? AND ep.proctor_id = ?
			  AND (ep.room_id IS NULL OR ep.room_id = ep_part.room_id)
		`).bind(parsedAttemptId, locals.user.school_id, locals.user.id).first();
    if (!attemptCheck) {
      return fail(403, { error: "Sesi ujian tidak ditemukan atau bukan milik sekolah Anda." });
    }
    try {
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
      return fail(500, { error: e.message || "Gagal mereset sesi ujian siswa." });
    }
  }
};
export {
  actions,
  load
};
