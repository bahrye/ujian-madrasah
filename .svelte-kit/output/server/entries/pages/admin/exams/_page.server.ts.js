import { fail } from "@sveltejs/kit";
import { g as getDB } from "../../../../chunks/db.js";
const load = async ({ platform, locals }) => {
  const db = getDB(platform);
  const exams = await db.prepare(`
		SELECT e.*, u.name as creator_name, s.name as subject_name,
			(SELECT COUNT(*) FROM questions WHERE exam_id = e.id) as question_count,
			(SELECT COUNT(*) FROM exam_participants WHERE exam_id = e.id) as participant_count
		FROM exams e
		LEFT JOIN users u ON e.created_by = u.id
		LEFT JOIN subjects s ON e.subject_id = s.id
		WHERE e.school_id = ?
		ORDER BY e.created_at DESC
	`).bind(locals.user.school_id).all();
  const subjects = await db.prepare("SELECT id, name FROM subjects WHERE school_id = ? ORDER BY name").bind(locals.user.school_id).all();
  return { exams: exams.results, subjects: subjects.results };
};
const actions = {
  create: async ({ request, platform, locals }) => {
    const db = getDB(platform);
    const form = await request.formData();
    const title = form.get("title")?.toString().trim();
    const description = form.get("description")?.toString().trim() || "";
    const subjectId = form.get("subject_id")?.toString() || null;
    const durationMinutes = parseInt(form.get("duration_minutes")?.toString() || "60");
    const startTime = form.get("start_time")?.toString() || null;
    const endTime = form.get("end_time")?.toString() || null;
    if (!title) return fail(400, { error: "Judul ujian wajib diisi." });
    await db.prepare(`INSERT INTO exams (school_id, title, description, subject_id, duration_minutes, start_time, end_time, created_by)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).bind(locals.user.school_id, title, description, subjectId, durationMinutes, startTime, endTime, locals.user?.id).run();
    return { success: "Ujian berhasil dibuat." };
  },
  update: async ({ request, platform, locals }) => {
    const db = getDB(platform);
    const form = await request.formData();
    const id = form.get("id")?.toString();
    const title = form.get("title")?.toString().trim();
    const description = form.get("description")?.toString().trim() || "";
    const subjectId = form.get("subject_id")?.toString() || null;
    const durationMinutes = parseInt(form.get("duration_minutes")?.toString() || "60");
    const startTime = form.get("start_time")?.toString() || null;
    const endTime = form.get("end_time")?.toString() || null;
    const isActive = form.get("is_active")?.toString() === "1" ? 1 : 0;
    if (!id || !title) return fail(400, { error: "Data tidak lengkap." });
    await db.prepare(`UPDATE exams SET title=?, description=?, subject_id=?, duration_minutes=?,
			start_time=?, end_time=?, is_active=?, updated_at=datetime('now') WHERE id=? AND school_id=?`).bind(title, description, subjectId, durationMinutes, startTime, endTime, isActive, id, locals.user.school_id).run();
    return { success: "Ujian berhasil diperbarui." };
  },
  delete: async ({ request, platform, locals }) => {
    const db = getDB(platform);
    const form = await request.formData();
    const id = form.get("id")?.toString();
    if (!id) return fail(400, { error: "ID tidak valid." });
    await db.prepare("DELETE FROM exams WHERE id = ? AND school_id = ?").bind(id, locals.user.school_id).run();
    return { success: "Ujian berhasil dihapus." };
  },
  toggleActive: async ({ request, platform, locals }) => {
    const db = getDB(platform);
    const form = await request.formData();
    const id = form.get("id")?.toString();
    if (!id) return fail(400, { error: "ID tidak valid." });
    await db.prepare(`UPDATE exams SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END, updated_at=datetime('now') WHERE id = ? AND school_id = ?`).bind(id, locals.user.school_id).run();
    return { success: "Status ujian berhasil diperbarui." };
  }
};
export {
  actions,
  load
};
