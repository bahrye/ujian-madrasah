import { fail, redirect } from "@sveltejs/kit";
import { g as getDB } from "../../../../chunks/db.js";
import { g as generateTokenCode } from "../../../../chunks/auth.js";
const load = async ({ platform, locals }) => {
  if (!locals.user) throw redirect(302, "/login");
  const db = getDB(platform);
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
		JOIN exam_proctors ep ON e.id = ep.exam_id
		WHERE t.school_id = ? AND ep.proctor_id = ?
		ORDER BY t.created_at DESC
	`).bind(locals.user.school_id, locals.user.id).all();
  const exams = await db.prepare(`
		SELECT e.id, e.title, e.start_time, e.end_time
		FROM exams e
		JOIN exam_proctors ep ON e.id = ep.exam_id
		JOIN exam_types et ON e.exam_type_id = et.id
		WHERE e.is_active = 1 AND et.is_active = 1 AND e.school_id = ? AND ep.proctor_id = ?
		ORDER BY e.title
	`).bind(locals.user.school_id, locals.user.id).all();
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
  return { tokens: processedTokens, exams: exams.results };
};
const actions = {
  generate: async ({ request, platform, locals }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });
    const db = getDB(platform);
    const form = await request.formData();
    const examIdStr = form.get("exam_id")?.toString();
    const parsedExamId = parseInt(examIdStr || "", 10);
    const durationHours = parseInt(form.get("duration_hours")?.toString() || "2");
    if (isNaN(parsedExamId)) return fail(400, { error: "Pilih ujian terlebih dahulu." });
    const exam = await db.prepare(`
			SELECT e.id FROM exams e
			JOIN exam_proctors ep ON e.id = ep.exam_id
			WHERE e.id = ? AND e.school_id = ? AND ep.proctor_id = ?
		`).bind(parsedExamId, locals.user.school_id, locals.user.id).first();
    if (!exam) return fail(403, { error: "Anda bukan pengawas yang ditugaskan untuk ujian ini." });
    const now = Date.now();
    const nowIso = new Date(now).toISOString();
    const activeToken = await db.prepare(`
			SELECT token_code FROM tokens 
			WHERE exam_id = ? AND school_id = ? AND expires_at > ?
		`).bind(parsedExamId, locals.user.school_id, nowIso).first();
    if (activeToken) {
      return fail(400, { error: `Gagal: Masih ada token aktif untuk ujian ini (${activeToken.token_code}). Harap hapus token tersebut dahulu jika ingin membuat yang baru.` });
    }
    const expiresAt = new Date(now + durationHours * 60 * 60 * 1e3).toISOString();
    try {
      await db.prepare(`
				DELETE FROM tokens 
				WHERE exam_id = ? AND school_id = ? 
				  AND id NOT IN (SELECT DISTINCT token_id FROM student_attempts WHERE exam_id = ? AND token_id IS NOT NULL)
			`).bind(parsedExamId, locals.user.school_id, parsedExamId).run();
      let tokenCode = "";
      let inserted = false;
      let attemptsCount = 0;
      while (!inserted && attemptsCount < 5) {
        attemptsCount++;
        tokenCode = generateTokenCode(6);
        try {
          await db.prepare("INSERT INTO tokens (school_id, exam_id, token_code, created_by, expires_at) VALUES (?, ?, ?, ?, ?)").bind(locals.user.school_id, parsedExamId, tokenCode, locals.user.id, expiresAt).run();
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
      return { success: `Token berhasil dibuat: ${tokenCode}` };
    } catch (e) {
      console.error(e);
      return fail(500, { error: e.message || "Gagal membuat token." });
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
      const tokenCheck = await db.prepare(`
				SELECT t.id FROM tokens t
				JOIN exam_proctors ep ON t.exam_id = ep.exam_id
				WHERE t.id = ? AND t.school_id = ? AND ep.proctor_id = ?
			`).bind(parsedId, locals.user.school_id, locals.user.id).first();
      if (!tokenCheck) return fail(403, { error: "Anda tidak memiliki hak untuk merilis token ini." });
      await db.prepare('UPDATE tokens SET is_released = 1, released_at = datetime("now") WHERE id = ? AND school_id = ?').bind(parsedId, locals.user.school_id).run();
      return { success: "Token berhasil dirilis ke siswa." };
    } catch (e) {
      console.error(e);
      return fail(500, { error: e.message || "Gagal merilis token." });
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
      const tokenCheck = await db.prepare(`
				SELECT t.id FROM tokens t
				JOIN exam_proctors ep ON t.exam_id = ep.exam_id
				WHERE t.id = ? AND t.school_id = ? AND ep.proctor_id = ?
			`).bind(parsedId, locals.user.school_id, locals.user.id).first();
      if (!tokenCheck) return fail(403, { error: "Anda tidak memiliki hak untuk menarik token ini." });
      await db.prepare("UPDATE tokens SET is_released = 0 WHERE id = ? AND school_id = ?").bind(parsedId, locals.user.school_id).run();
      return { success: "Token berhasil ditarik." };
    } catch (e) {
      console.error(e);
      return fail(500, { error: e.message || "Gagal menarik token." });
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
      const tokenCheck = await db.prepare(`
				SELECT t.id FROM tokens t
				JOIN exam_proctors ep ON t.exam_id = ep.exam_id
				WHERE t.id = ? AND t.school_id = ? AND ep.proctor_id = ?
			`).bind(parsedId, locals.user.school_id, locals.user.id).first();
      if (!tokenCheck) return fail(403, { error: "Anda tidak memiliki hak untuk menghapus token ini." });
      const usage = await db.prepare("SELECT COUNT(*) as count FROM student_attempts WHERE token_id = ?").bind(parsedId).first();
      if (usage && usage.count > 0) {
        return fail(400, { error: "Gagal dihapus: Token ini telah digunakan oleh peserta ujian." });
      }
      await db.prepare("DELETE FROM tokens WHERE id = ? AND school_id = ?").bind(parsedId, locals.user.school_id).run();
      return { success: "Token berhasil dihapus." };
    } catch (err) {
      console.error("Delete token error:", err);
      return fail(500, { error: "Terjadi kesalahan sistem saat menghapus token." });
    }
  }
};
export {
  actions,
  load
};
