import { fail } from "@sveltejs/kit";
import { g as getDB } from "../../../../chunks/db.js";
const load = async ({ platform, locals }) => {
  const db = getDB(platform);
  const examTypes = await db.prepare(`
		SELECT et.*, 
			(SELECT COUNT(*) FROM exams WHERE exam_type_id = et.id) as exam_count
		FROM exam_types et
		WHERE et.school_id = ?
		ORDER BY et.created_at DESC
	`).bind(locals.user.school_id).all();
  return { examTypes: examTypes.results };
};
const actions = {
  create: async ({ request, platform, locals }) => {
    const db = getDB(platform);
    const form = await request.formData();
    const code = form.get("code")?.toString().trim();
    const name = form.get("name")?.toString().trim();
    const description = form.get("description")?.toString().trim() || "";
    const startTime = form.get("start_time")?.toString() || null;
    const endTime = form.get("end_time")?.toString() || null;
    const isActive = 1;
    if (!code || !name) return fail(400, { error: "Kode dan Nama Tipe Ujian wajib diisi." });
    try {
      await db.prepare(`INSERT INTO exam_types (school_id, code, name, description, start_time, end_time, is_active)
				VALUES (?, ?, ?, ?, ?, ?, ?)`).bind(locals.user.school_id, code, name, description, startTime, endTime, isActive).run();
      return { success: "Tipe Ujian berhasil dibuat." };
    } catch (e) {
      return fail(500, { error: "Gagal membuat tipe ujian. Mungkin kode sudah digunakan." });
    }
  },
  update: async ({ request, platform, locals }) => {
    const db = getDB(platform);
    const form = await request.formData();
    const id = form.get("id")?.toString();
    const code = form.get("code")?.toString().trim();
    const name = form.get("name")?.toString().trim();
    const description = form.get("description")?.toString().trim() || "";
    const startTime = form.get("start_time")?.toString() || null;
    const endTime = form.get("end_time")?.toString() || null;
    const isActive = 1;
    if (!id || !code || !name) return fail(400, { error: "Data tidak lengkap." });
    try {
      const oldType = await db.prepare("SELECT code FROM exam_types WHERE id = ? AND school_id = ?").bind(id, locals.user.school_id).first();
      await db.prepare(`UPDATE exam_types SET code=?, name=?, description=?, start_time=?, end_time=?, is_active=? WHERE id=? AND school_id=?`).bind(code, name, description, startTime, endTime, isActive, id, locals.user.school_id).run();
      if (oldType && oldType.code !== code) {
        const linkedExams = await db.prepare(`
					SELECT e.id, s.name as subject_name
					FROM exams e
					LEFT JOIN subjects s ON e.subject_id = s.id
					WHERE e.exam_type_id = ?
				`).bind(id).all();
        if (linkedExams.results.length > 0) {
          const updateBatch = linkedExams.results.map(
            (exam) => db.prepare(`UPDATE exams SET title = ?, updated_at = datetime('now') WHERE id = ?`).bind(`${code} - ${exam.subject_name || "Ujian"}`, exam.id)
          );
          await db.batch(updateBatch);
        }
      }
      if (startTime && endTime) {
        await db.prepare(`
					UPDATE exams 
					SET is_active = 0 
					WHERE exam_type_id = ? 
					AND (
						(start_time IS NOT NULL AND start_time < ?) OR 
						(end_time IS NOT NULL AND end_time > ?)
					)
				`).bind(id, startTime, endTime).run();
      }
      return { success: "Tipe Ujian berhasil diperbarui. Nama ujian yang terhubung telah diperbarui otomatis." };
    } catch (e) {
      return fail(500, { error: "Gagal memperbarui tipe ujian." });
    }
  },
  delete: async ({ request, platform, locals }) => {
    const db = getDB(platform);
    const form = await request.formData();
    const id = form.get("id")?.toString();
    if (!id) return fail(400, { error: "ID tidak valid." });
    try {
      const exams = await db.prepare("SELECT COUNT(*) as count FROM exams WHERE exam_type_id = ?").bind(id).first();
      if (exams && exams.count > 0) {
        return fail(400, { error: "Gagal dihapus: Masih ada ujian yang terikat pada tipe ini." });
      }
      await db.prepare("DELETE FROM exam_types WHERE id = ? AND school_id = ?").bind(id, locals.user.school_id).run();
      return { success: "Tipe Ujian berhasil dihapus." };
    } catch (e) {
      return fail(500, { error: "Gagal menghapus tipe ujian." });
    }
  },
  toggleActive: async ({ request, platform, locals }) => {
    const db = getDB(platform);
    const form = await request.formData();
    const id = form.get("id")?.toString();
    if (!id) return fail(400, { error: "ID tidak valid." });
    await db.prepare(`UPDATE exam_types SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END WHERE id = ? AND school_id = ?`).bind(id, locals.user.school_id).run();
    return { success: "Status tipe ujian berhasil diperbarui." };
  }
};
export {
  actions,
  load
};
