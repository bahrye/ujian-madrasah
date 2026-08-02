import { fail } from "@sveltejs/kit";
import { g as getDB } from "../../../../chunks/db.js";
import { g as generateTokenCode } from "../../../../chunks/auth.js";
const load = async ({ platform, locals }) => {
  const db = getDB(platform);
  const tokens = await db.prepare(`
		SELECT t.*, e.title as exam_title
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
		WHERE e.is_active = 1 AND e.school_id = ? AND ep.proctor_id = ?
		ORDER BY e.title
	`).bind(locals.user.school_id, locals.user.id).all();
  return { tokens: tokens.results, exams: exams.results };
};
const actions = {
  generate: async ({ request, platform, locals }) => {
    const db = getDB(platform);
    const form = await request.formData();
    const examId = form.get("exam_id")?.toString();
    const durationHours = parseInt(form.get("duration_hours")?.toString() || "2");
    if (!examId) return fail(400, { error: "Pilih ujian terlebih dahulu." });
    const exam = await db.prepare("SELECT id FROM exams WHERE id = ? AND school_id = ?").bind(examId, locals.user.school_id).first();
    if (!exam) return fail(400, { error: "Ujian tidak ditemukan." });
    const now = Date.now();
    const tokenCode = generateTokenCode(6);
    const expiresAt = new Date(now + durationHours * 60 * 60 * 1e3).toISOString();
    await db.prepare("INSERT INTO tokens (school_id, exam_id, token_code, created_by, expires_at) VALUES (?, ?, ?, ?, ?)").bind(locals.user.school_id, examId, tokenCode, locals.user?.id, expiresAt).run();
    return { success: `Token berhasil dibuat: ${tokenCode}` };
  },
  release: async ({ request, platform, locals }) => {
    const db = getDB(platform);
    const form = await request.formData();
    const id = form.get("id")?.toString();
    if (!id) return fail(400, { error: "ID tidak valid." });
    await db.prepare('UPDATE tokens SET is_released = 1, released_at = datetime("now") WHERE id = ? AND school_id = ?').bind(id, locals.user.school_id).run();
    return { success: "Token berhasil dirilis ke siswa. Token akan ditarik otomatis dalam 15 menit." };
  },
  revoke: async ({ request, platform, locals }) => {
    const db = getDB(platform);
    const form = await request.formData();
    const id = form.get("id")?.toString();
    if (!id) return fail(400, { error: "ID tidak valid." });
    await db.prepare("UPDATE tokens SET is_released = 0 WHERE id = ? AND school_id = ?").bind(id, locals.user.school_id).run();
    return { success: "Token berhasil ditarik." };
  },
  delete: async ({ request, platform, locals }) => {
    const db = getDB(platform);
    const form = await request.formData();
    const id = form.get("id")?.toString();
    if (!id) return fail(400, { error: "ID tidak valid." });
    try {
      const usage = await db.prepare("SELECT COUNT(*) as count FROM student_attempts WHERE token_id = ?").bind(id).first();
      if (usage && usage.count > 0) {
        return fail(400, { error: "Gagal dihapus: Token ini telah digunakan oleh peserta ujian." });
      }
      await db.prepare("DELETE FROM tokens WHERE id = ? AND school_id = ?").bind(id, locals.user.school_id).run();
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
