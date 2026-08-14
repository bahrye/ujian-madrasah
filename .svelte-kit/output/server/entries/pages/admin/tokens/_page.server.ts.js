import { fail, redirect } from "@sveltejs/kit";
import { g as getDB, b as ensureTokenSessionColumn } from "../../../../chunks/db.js";
import { g as generateTokenCode } from "../../../../chunks/auth.js";
import { c as checkSessionTimeWindow } from "../../../../chunks/date.js";
const load = async ({ platform, locals }) => {
  if (!locals.user) throw redirect(302, "/login");
  const db = getDB(platform);
  await ensureTokenSessionColumn(db);
  const tokens = await db.prepare(`
		SELECT t.*, e.title as exam_title,
		COALESCE((
			SELECT json_group_array(
				json_object(
					'id', u.id, 
					'name', u.name, 
					'username', u.username, 
					'start_time', sa.start_time
				)
			)
			FROM student_attempts sa
			JOIN users u ON sa.student_id = u.id
			WHERE sa.token_id = t.id
		), '[]') as used_by_students_json
		FROM tokens t 
		JOIN exams e ON t.exam_id = e.id
		WHERE t.school_id = ?
		ORDER BY t.created_at DESC
	`).bind(locals.user.school_id).all();
  const examsRaw = await db.prepare(`
		SELECT e.id, e.title, e.start_time, e.end_time
		FROM exams e
		JOIN exam_types et ON e.exam_type_id = et.id
		WHERE e.is_active = 1 AND et.is_active = 1 AND e.school_id = ?
		ORDER BY e.title
	`).bind(locals.user.school_id).all();
  const examIds = examsRaw.results.map((e) => e.id);
  let dbSessions = [];
  if (examIds.length > 0) {
    const placeholders = examIds.map(() => "?").join(",");
    const sessionsResult = await db.prepare(
      `SELECT exam_id, session_number, start_time, end_time FROM exam_sessions WHERE exam_id IN (${placeholders}) ORDER BY session_number`
    ).bind(...examIds).all();
    dbSessions = sessionsResult.results;
  }
  const processedExams = examsRaw.results.map((exam) => {
    const examDbSessions = dbSessions.filter((s) => s.exam_id === exam.id);
    let finalSessions = [];
    if (examDbSessions.length > 0) {
      finalSessions = examDbSessions.map((s) => ({
        session_number: s.session_number,
        start_time: s.start_time || exam.start_time,
        end_time: s.end_time || exam.end_time
      }));
    } else {
      finalSessions = [{
        session_number: 1,
        start_time: exam.start_time,
        end_time: exam.end_time
      }];
    }
    return {
      id: exam.id,
      title: exam.title,
      start_time: exam.start_time,
      end_time: exam.end_time,
      sessions: finalSessions
    };
  });
  const processedTokens = tokens.results.map((t) => {
    let usedBy = [];
    try {
      usedBy = t.used_by_students_json ? JSON.parse(t.used_by_students_json) : [];
      if (usedBy.length === 1 && usedBy[0].id === null) usedBy = [];
    } catch (e) {
    }
    return {
      ...t,
      used_by_students: usedBy
    };
  });
  return { tokens: processedTokens, exams: processedExams };
};
const actions = {
  generate: async ({ request, platform, locals }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });
    const db = getDB(platform);
    await ensureTokenSessionColumn(db);
    const form = await request.formData();
    const examIdStr = form.get("exam_id")?.toString();
    const parsedExamId = parseInt(examIdStr || "", 10);
    const parsedSessionNumber = parseInt(form.get("session_number")?.toString() || "1", 10);
    const durationHours = parseInt(form.get("duration_hours")?.toString() || "2");
    if (isNaN(parsedExamId)) return fail(400, { error: "Pilih ujian terlebih dahulu." });
    if (isNaN(parsedSessionNumber) || parsedSessionNumber < 1) return fail(400, { error: "Pilih sesi ujian terlebih dahulu." });
    const exam = await db.prepare("SELECT id, start_time, end_time FROM exams WHERE id = ? AND school_id = ?").bind(parsedExamId, locals.user.school_id).first();
    if (!exam) return fail(400, { error: "Ujian tidak ditemukan." });
    const sessionRecord = await db.prepare(`
			SELECT start_time, end_time FROM exam_sessions WHERE exam_id = ? AND session_number = ?
		`).bind(parsedExamId, parsedSessionNumber).first();
    const tzOffsetStr = form.get("tz_offset")?.toString();
    const clientTzOffset = tzOffsetStr ? parseInt(tzOffsetStr, 10) : null;
    const startTimeStr = sessionRecord?.start_time || exam.start_time;
    const endTimeStr = sessionRecord?.end_time || exam.end_time;
    const timeCheck = checkSessionTimeWindow(startTimeStr, endTimeStr, /* @__PURE__ */ new Date(), clientTzOffset);
    if (!timeCheck.allowed) {
      if (timeCheck.reason === "too_early") {
        return fail(400, { error: `Token Sesi ${parsedSessionNumber} baru dapat dibuat 15 menit sebelum waktu sesi ujian dimulai (mulai pukul ${timeCheck.timeFormatted}).` });
      } else if (timeCheck.reason === "too_late") {
        return fail(400, { error: `Token tidak dapat dibuat karena Sesi ${parsedSessionNumber} telah berakhir.` });
      }
    }
    const nowIso = (/* @__PURE__ */ new Date()).toISOString();
    const activeToken = await db.prepare(`
			SELECT token_code FROM tokens 
			WHERE exam_id = ? AND (session_number = ? OR session_number IS NULL) AND school_id = ? AND expires_at > ?
		`).bind(parsedExamId, parsedSessionNumber, locals.user.school_id, nowIso).first();
    if (activeToken) {
      return fail(400, { error: `Gagal: Masih ada token aktif untuk Sesi ${parsedSessionNumber} ujian ini (${activeToken.token_code}). Harap hapus token tersebut dahulu jika ingin membuat yang baru.` });
    }
    const tokenCode = generateTokenCode(6);
    const expiresAt = new Date(Date.now() + durationHours * 60 * 60 * 1e3).toISOString();
    try {
      await db.prepare(`
				DELETE FROM tokens 
				WHERE exam_id = ? AND (session_number = ? OR session_number IS NULL) AND school_id = ? 
				  AND id NOT IN (SELECT DISTINCT token_id FROM student_attempts WHERE exam_id = ? AND token_id IS NOT NULL)
			`).bind(parsedExamId, parsedSessionNumber, locals.user.school_id, parsedExamId).run();
      await db.prepare("INSERT INTO tokens (school_id, exam_id, session_number, token_code, is_released, released_at, created_by, expires_at) VALUES (?, ?, ?, ?, 1, datetime('now'), ?, ?)").bind(locals.user.school_id, parsedExamId, parsedSessionNumber, tokenCode, locals.user.id, expiresAt).run();
      return { success: `Token Sesi ${parsedSessionNumber} berhasil dibuat: ${tokenCode}` };
    } catch (e) {
      console.error(e);
      return fail(500, { error: e.message || "Gagal membuat token" });
    }
  },
  release: async ({ request, platform, locals }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });
    const db = getDB(platform);
    const form = await request.formData();
    const idStr = form.get("id")?.toString();
    const parsedId = parseInt(idStr || "", 10);
    if (isNaN(parsedId)) return fail(400, { error: "ID tidak valid." });
    try {
      await db.prepare('UPDATE tokens SET is_released = 1, released_at = datetime("now") WHERE id = ? AND school_id = ?').bind(parsedId, locals.user.school_id).run();
      return { success: "Token berhasil dirilis ke siswa. Token akan ditarik otomatis dalam 15 menit." };
    } catch (e) {
      console.error(e);
      return fail(500, { error: e.message || "Gagal merilis token" });
    }
  },
  revoke: async ({ request, platform, locals }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });
    const db = getDB(platform);
    const form = await request.formData();
    const idStr = form.get("id")?.toString();
    const parsedId = parseInt(idStr || "", 10);
    if (isNaN(parsedId)) return fail(400, { error: "ID tidak valid." });
    try {
      await db.prepare("UPDATE tokens SET is_released = 0 WHERE id = ? AND school_id = ?").bind(parsedId, locals.user.school_id).run();
      return { success: "Token berhasil ditarik." };
    } catch (e) {
      console.error(e);
      return fail(500, { error: e.message || "Gagal menarik token" });
    }
  },
  delete: async ({ request, platform, locals }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });
    const db = getDB(platform);
    const form = await request.formData();
    const idStr = form.get("id")?.toString();
    const parsedId = parseInt(idStr || "", 10);
    if (isNaN(parsedId)) return fail(400, { error: "ID tidak valid." });
    try {
      const usage = await db.prepare("SELECT COUNT(*) as count FROM student_attempts WHERE token_id = ?").bind(parsedId).first();
      if (usage && usage.count > 0) {
        return fail(400, { error: "Gagal dihapus: Token ini telah digunakan oleh peserta ujian." });
      }
      await db.prepare("DELETE FROM tokens WHERE id = ? AND school_id = ?").bind(parsedId, locals.user.school_id).run();
      return { success: "Token berhasil dihapus." };
    } catch (err) {
      console.error("Delete token error:", err);
      return fail(500, { error: err.message || "Terjadi kesalahan sistem saat menghapus token." });
    }
  }
};
export {
  actions,
  load
};
