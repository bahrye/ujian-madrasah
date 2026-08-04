import { fail, redirect } from "@sveltejs/kit";
import { g as getDB } from "../../../../chunks/db.js";
const load = async ({ platform, url, locals }) => {
  if (!locals.user) throw redirect(302, "/login");
  const db = getDB(platform);
  const examFilter = url.searchParams.get("exam_id") || "";
  const exams = await db.prepare(`
		SELECT e.id, e.title 
		FROM exams e 
		JOIN exam_proctors ep ON e.id = ep.exam_id
		WHERE e.is_active = 1 AND e.school_id = ? AND ep.proctor_id = ?
		ORDER BY e.title
	`).bind(locals.user.school_id, locals.user.id).all();
  let attempts = [];
  if (examFilter) {
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
				sa.violation_logs
			FROM exam_participants epart
			JOIN users u ON epart.student_id = u.id
			JOIN exams e ON epart.exam_id = e.id
			JOIN exam_proctors ep ON e.id = ep.exam_id
			LEFT JOIN student_attempts sa ON sa.student_id = epart.student_id AND sa.exam_id = epart.exam_id
			WHERE epart.exam_id = ? AND e.school_id = ? AND ep.proctor_id = ?
			ORDER BY 
				CASE WHEN sa.status = 'mengerjakan' THEN 1 
					 WHEN sa.status IS NULL THEN 2 
					 ELSE 3 END ASC,
				u.name ASC
		`).bind(examFilter, locals.user.school_id, locals.user.id).all();
    attempts = result.results;
  }
  const kv = platform?.env?.EXAM_ANSWERS;
  const attemptsWithProgress = await Promise.all(attempts.map(async (a) => {
    let answeredCount = 0;
    let warnings = 0;
    let warningLogs = [];
    const status = a.status || "belum_mengerjakan";
    if (status === "mengerjakan") {
      if (kv && a.attempt_id) {
        const stored = await kv.get(`attempt_${a.attempt_id}_answers`);
        if (stored) {
          try {
            const data = JSON.parse(stored);
            if (data && data.answers) {
              answeredCount = Object.values(data.answers).filter((val) => val !== null && val !== "").length;
            }
            if (data && data.warnings) warnings = data.warnings;
            if (data && data.warningLogs) warningLogs = data.warningLogs;
          } catch (e) {
          }
        }
      }
      if (answeredCount === 0 && a.attempt_id) {
        const dbAnswers = await db.prepare('SELECT COUNT(*) as c FROM student_answers WHERE attempt_id = ? AND answer_given IS NOT NULL AND answer_given != ""').bind(a.attempt_id).first();
        if (dbAnswers && dbAnswers.c) answeredCount = dbAnswers.c;
      }
    } else if (status === "selesai" || status === "waktu_habis") {
      warnings = a.violation_count || 0;
      try {
        warningLogs = a.violation_logs ? JSON.parse(a.violation_logs) : [];
      } catch (e) {
      }
      if (a.attempt_id) {
        const dbAnswers = await db.prepare('SELECT COUNT(*) as c FROM student_answers WHERE attempt_id = ? AND answer_given IS NOT NULL AND answer_given != ""').bind(a.attempt_id).first();
        if (dbAnswers && dbAnswers.c) answeredCount = dbAnswers.c;
      }
    }
    return {
      ...a,
      id: a.attempt_id || `no_attempt_${a.student_id}`,
      attempt_id: a.attempt_id,
      status,
      answeredCount,
      warnings,
      warningLogs
    };
  }));
  return { exams: exams.results, attempts: attemptsWithProgress, examFilter };
};
const actions = {
  resetAttempt: async ({ request, platform, locals }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });
    const db = getDB(platform);
    const form = await request.formData();
    const attemptId = form.get("attempt_id")?.toString();
    if (!attemptId) return fail(400, { error: "ID tidak valid." });
    const attemptCheck = await db.prepare(`
			SELECT sa.id FROM student_attempts sa
			JOIN exams e ON sa.exam_id = e.id
			WHERE sa.id = ? AND e.school_id = ?
		`).bind(attemptId, locals.user.school_id).first();
    if (!attemptCheck) {
      return fail(403, { error: "Sesi ujian tidak ditemukan atau bukan milik sekolah Anda." });
    }
    await db.batch([
      db.prepare("DELETE FROM student_answers WHERE attempt_id = ?").bind(attemptId),
      db.prepare("DELETE FROM student_attempts WHERE id = ?").bind(attemptId)
    ]);
    return { success: "Sesi ujian siswa berhasil direset." };
  }
};
export {
  actions,
  load
};
