import { fail, redirect } from "@sveltejs/kit";
import { g as getDB } from "../../../../../chunks/db.js";
import { g as generateTokenCode } from "../../../../../chunks/auth.js";
const load = async ({ platform, params, locals }) => {
  const db = getDB(platform);
  const examIdStr = params.examId;
  const parsedExamId = parseInt(examIdStr, 10);
  if (isNaN(parsedExamId)) throw redirect(302, "/guru/remedial");
  const exam = await db.prepare(`
		SELECT e.*, s.name as subject_name
		FROM exams e
		LEFT JOIN subjects s ON e.subject_id = s.id
		WHERE e.id = ? AND e.school_id = ? AND e.created_by = ?
	`).bind(parsedExamId, locals.user.school_id, locals.user.id).first();
  if (!exam) throw redirect(302, "/guru/remedial");
  const participants = await db.prepare(`
		SELECT ep.id as participant_id, u.username as nisn, u.name as student_name, c.name as class_name
		FROM exam_participants ep
		JOIN users u ON ep.student_id = u.id
		LEFT JOIN classes c ON u.class_id = c.id
		WHERE ep.exam_id = ?
		ORDER BY c.name, u.name
	`).bind(parsedExamId).all();
  const allStudents = await db.prepare(`
		SELECT u.id, u.username as nisn, u.name, c.name as class_name
		FROM users u
		LEFT JOIN classes c ON u.class_id = c.id
		WHERE u.school_id = ? AND u.role = 'siswa'
		ORDER BY c.name, u.name
	`).bind(locals.user.school_id).all();
  const activeToken = await db.prepare(`
		SELECT id, token_code as token, expires_at, released_at
		FROM tokens
		WHERE exam_id = ? AND expires_at > datetime('now')
		ORDER BY expires_at DESC LIMIT 1
	`).bind(parsedExamId).first();
  const rawAttempts = await db.prepare(`
		SELECT sa.id, sa.status, sa.created_at as start_time, sa.submit_time,
			   sa.violation_count, sa.violation_logs,
			   u.name as student_name, c.name as class_name,
			   (SELECT COUNT(*) FROM questions WHERE exam_id = ?) as question_count
		FROM student_attempts sa
		JOIN users u ON sa.student_id = u.id
		LEFT JOIN classes c ON u.class_id = c.id
		WHERE sa.exam_id = ?
		ORDER BY sa.created_at DESC
	`).bind(parsedExamId, parsedExamId).all();
  const kv = platform?.env?.EXAM_ANSWERS;
  const attempts = await Promise.all(rawAttempts.results.map(async (a) => {
    let answeredCount = 0;
    let warnings = 0;
    let warningLogs = [];
    if (a.status === "mengerjakan") {
      if (kv) {
        const stored = await kv.get(`attempt_${a.id}_answers`);
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
      if (answeredCount === 0) {
        const dbAnswers = await db.prepare('SELECT COUNT(*) as c FROM student_answers WHERE attempt_id = ? AND answer_given IS NOT NULL AND answer_given != ""').bind(a.id).first();
        if (dbAnswers && dbAnswers.c) answeredCount = dbAnswers.c;
      }
    } else {
      warnings = a.violation_count || 0;
      try {
        warningLogs = a.violation_logs ? JSON.parse(a.violation_logs) : [];
      } catch (e) {
      }
      const dbAnswers = await db.prepare('SELECT COUNT(*) as c FROM student_answers WHERE attempt_id = ? AND answer_given IS NOT NULL AND answer_given != ""').bind(a.id).first();
      if (dbAnswers && dbAnswers.c) answeredCount = dbAnswers.c;
    }
    return { ...a, answeredCount, warnings, warningLogs };
  }));
  return {
    exam,
    participants: participants.results,
    allStudents: allStudents.results,
    activeToken,
    attempts
  };
};
const actions = {
  // ===================== PARTICIPANTS =====================
  addParticipants: async ({ request, platform, params, locals }) => {
    const db = getDB(platform);
    const form = await request.formData();
    const studentIdsStr = form.getAll("student_ids").map((id) => id.toString());
    const parsedStudentIds = studentIdsStr.map((id) => parseInt(id, 10)).filter((id) => !isNaN(id));
    if (!parsedStudentIds.length) return fail(400, { error: "Pilih minimal satu siswa." });
    const examIdStr = params.examId;
    const parsedExamId = parseInt(examIdStr, 10);
    if (isNaN(parsedExamId)) return fail(400, { error: "ID Ujian tidak valid." });
    const exam = await db.prepare("SELECT id FROM exams WHERE id = ? AND created_by = ? AND school_id = ?").bind(parsedExamId, locals.user.id, locals.user.school_id).first();
    if (!exam) return fail(403, { error: "Akses ditolak." });
    const placeholders = parsedStudentIds.map(() => "?").join(",");
    const validStudents = await db.prepare(`SELECT id FROM users WHERE id IN (${placeholders}) AND school_id = ? AND role = "siswa"`).bind(...parsedStudentIds, locals.user.school_id).all();
    if (validStudents.results.length === 0) {
      return fail(400, { error: "Siswa yang dipilih tidak valid." });
    }
    const batch = validStudents.results.map(
      (s) => db.prepare("INSERT OR IGNORE INTO exam_participants (exam_id, student_id) VALUES (?, ?)").bind(parsedExamId, s.id)
    );
    try {
      await db.batch(batch);
      return { success: `Berhasil menambahkan ${validStudents.results.length} peserta remedial.` };
    } catch (e) {
      console.error(e);
      return fail(500, { error: "Gagal menambahkan peserta." });
    }
  },
  removeParticipant: async ({ request, platform, locals }) => {
    const db = getDB(platform);
    const form = await request.formData();
    const participantIdStr = form.get("participant_id")?.toString();
    const parsedParticipantId = parseInt(participantIdStr || "", 10);
    if (isNaN(parsedParticipantId)) return fail(400, { error: "ID tidak valid." });
    const isOwner = await db.prepare(`
			SELECT 1 FROM exam_participants ep 
			JOIN exams e ON ep.exam_id = e.id 
			WHERE ep.id = ? AND e.created_by = ? AND e.school_id = ?
		`).bind(parsedParticipantId, locals.user.id, locals.user.school_id).first();
    if (!isOwner) return fail(403, { error: "Akses ditolak." });
    try {
      await db.prepare("DELETE FROM exam_participants WHERE id = ?").bind(parsedParticipantId).run();
      return { success: "Peserta berhasil dihapus." };
    } catch (e) {
      console.error(e);
      return fail(500, { error: e.message || "Gagal menghapus peserta." });
    }
  },
  // ===================== TOKENS =====================
  generateToken: async ({ request, platform, params, locals }) => {
    const db = getDB(platform);
    await request.formData();
    const examIdStr = params.examId;
    const parsedExamId = parseInt(examIdStr, 10);
    if (isNaN(parsedExamId)) return fail(400, { error: "ID Ujian tidak valid." });
    const exam = await db.prepare("SELECT id FROM exams WHERE id = ? AND created_by = ? AND school_id = ?").bind(parsedExamId, locals.user.id, locals.user.school_id).first();
    if (!exam) return fail(403, { error: "Akses ditolak." });
    const now = Date.now();
    const expiresAt = new Date(now + 15 * 60 * 1e3).toISOString();
    try {
      await db.prepare(`
				DELETE FROM tokens 
				WHERE exam_id = ? AND school_id = ? 
				  AND id NOT IN (SELECT DISTINCT token_id FROM student_attempts WHERE exam_id = ? AND token_id IS NOT NULL)
			`).bind(parsedExamId, locals.user.school_id, parsedExamId).run();
      let token = "";
      let inserted = false;
      let attemptsCount = 0;
      while (!inserted && attemptsCount < 5) {
        attemptsCount++;
        token = generateTokenCode(6);
        try {
          await db.prepare(`
						INSERT INTO tokens (school_id, exam_id, created_by, token_code, is_released, expires_at, released_at)
						VALUES (?, ?, ?, ?, 1, ?, datetime('now'))
					`).bind(locals.user.school_id, parsedExamId, locals.user.id, token, expiresAt).run();
          inserted = true;
        } catch (err) {
          if (err.message && err.message.includes("UNIQUE")) {
            continue;
          }
          throw err;
        }
      }
      if (!inserted) {
        return fail(500, { error: "Gagal membuat kode token unik. Silakan coba lagi." });
      }
      return { success: "Token berhasil dibuat.", token };
    } catch (e) {
      console.error(e);
      return fail(500, { error: e.message || "Gagal membuat token" });
    }
  },
  deleteToken: async ({ request, platform, locals }) => {
    const db = getDB(platform);
    const form = await request.formData();
    const idStr = form.get("id")?.toString();
    const parsedId = parseInt(idStr || "", 10);
    if (isNaN(parsedId)) return fail(400, { error: "ID Token tidak valid." });
    const isOwner = await db.prepare(`
			SELECT 1 FROM tokens t 
			JOIN exams e ON t.exam_id = e.id 
			WHERE t.id = ? AND e.created_by = ?
		`).bind(parsedId, locals.user.id).first();
    if (!isOwner) return fail(403, { error: "Akses ditolak." });
    try {
      await db.prepare("DELETE FROM tokens WHERE id = ?").bind(parsedId).run();
      return { success: "Token berhasil dicabut." };
    } catch (e) {
      console.error(e);
      return fail(500, { error: e.message || "Gagal menghapus token." });
    }
  },
  // ===================== MONITORING =====================
  forceSubmit: async ({ request, platform, locals }) => {
    const db = getDB(platform);
    const form = await request.formData();
    const attemptIdStr = form.get("attempt_id")?.toString();
    const parsedAttemptId = parseInt(attemptIdStr || "", 10);
    if (isNaN(parsedAttemptId)) return fail(400, { error: "ID Attempt tidak valid." });
    const isOwner = await db.prepare(`
			SELECT 1 FROM student_attempts sa 
			JOIN exams e ON sa.exam_id = e.id 
			WHERE sa.id = ? AND e.created_by = ?
		`).bind(parsedAttemptId, locals.user.id).first();
    if (!isOwner) return fail(403, { error: "Akses ditolak." });
    try {
      await db.prepare(`
				UPDATE student_attempts 
				SET status = 'waktu_habis', submit_time = datetime('now')
				WHERE id = ? AND status = 'mengerjakan'
			`).bind(parsedAttemptId).run();
      return { success: "Ujian siswa berhasil diakhiri secara paksa." };
    } catch (e) {
      console.error(e);
      return fail(500, { error: e.message || "Gagal mengakhiri ujian" });
    }
  }
};
export {
  actions,
  load
};
