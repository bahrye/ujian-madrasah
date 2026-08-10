import { fail } from "@sveltejs/kit";
import { g as getDB } from "../../../../chunks/db.js";
const load = async ({ platform }) => {
  const db = getDB(platform);
  const { results: schools } = await db.prepare("SELECT * FROM schools ORDER BY name ASC").all();
  return { schools };
};
const actions = {
  add: async ({ request, platform }) => {
    const db = getDB(platform);
    const data = await request.formData();
    const name = data.get("name")?.toString().trim();
    const address = data.get("address")?.toString().trim() || null;
    if (!name) {
      return fail(400, { error: "Nama sekolah wajib diisi", name, address });
    }
    try {
      await db.prepare("INSERT INTO schools (name, address) VALUES (?, ?)").bind(name, address).run();
      return { success: true };
    } catch (e) {
      console.error(e);
      return fail(500, { error: e.message || "Gagal menambahkan sekolah", name, address });
    }
  },
  toggleStatus: async ({ request, platform }) => {
    const db = getDB(platform);
    const data = await request.formData();
    const idStr = data.get("id")?.toString();
    const currentStatus = data.get("is_active")?.toString();
    const parsedId = parseInt(idStr || "", 10);
    if (isNaN(parsedId) || !currentStatus) return fail(400, { error: "Data tidak valid" });
    const newStatus = currentStatus === "1" ? 0 : 1;
    try {
      await db.prepare('UPDATE schools SET is_active = ?, updated_at = datetime("now") WHERE id = ?').bind(newStatus, parsedId).run();
      return { success: true };
    } catch (e) {
      console.error(e);
      return fail(500, { error: e.message || "Gagal merubah status sekolah" });
    }
  },
  edit: async ({ request, platform }) => {
    const db = getDB(platform);
    const data = await request.formData();
    const idStr = data.get("id")?.toString();
    const name = data.get("name")?.toString().trim();
    const address = data.get("address")?.toString().trim() || null;
    const parsedId = parseInt(idStr || "", 10);
    if (isNaN(parsedId) || !name) {
      return fail(400, { error: "ID dan Nama sekolah wajib diisi", name, address });
    }
    try {
      await db.prepare('UPDATE schools SET name = ?, address = ?, updated_at = datetime("now") WHERE id = ?').bind(name, address, parsedId).run();
      return { success: true };
    } catch (e) {
      console.error(e);
      return fail(500, { error: e.message || "Gagal mengupdate sekolah", name, address });
    }
  },
  delete: async ({ request, platform }) => {
    const db = getDB(platform);
    const data = await request.formData();
    const idStr = data.get("id")?.toString();
    const parsedId = parseInt(idStr || "", 10);
    if (isNaN(parsedId)) return fail(400, { error: "ID tidak valid" });
    try {
      await db.batch([
        db.prepare("DELETE FROM student_answers WHERE attempt_id IN (SELECT id FROM student_attempts WHERE exam_id IN (SELECT id FROM exams WHERE school_id = ?))").bind(parsedId),
        db.prepare("DELETE FROM student_attempts WHERE exam_id IN (SELECT id FROM exams WHERE school_id = ?)").bind(parsedId),
        db.prepare("DELETE FROM questions WHERE exam_id IN (SELECT id FROM exams WHERE school_id = ?)").bind(parsedId),
        db.prepare("DELETE FROM tokens WHERE school_id = ?").bind(parsedId),
        db.prepare("DELETE FROM exam_participants WHERE exam_id IN (SELECT id FROM exams WHERE school_id = ?)").bind(parsedId),
        db.prepare("DELETE FROM exam_teachers WHERE exam_id IN (SELECT id FROM exams WHERE school_id = ?)").bind(parsedId),
        db.prepare("DELETE FROM exam_proctors WHERE exam_id IN (SELECT id FROM exams WHERE school_id = ?)").bind(parsedId),
        db.prepare("DELETE FROM exams WHERE school_id = ?").bind(parsedId),
        db.prepare("DELETE FROM exam_type_participants WHERE exam_type_id IN (SELECT id FROM exam_types WHERE school_id = ?)").bind(parsedId),
        db.prepare("DELETE FROM exam_types WHERE school_id = ?").bind(parsedId),
        db.prepare("DELETE FROM users WHERE school_id = ?").bind(parsedId),
        db.prepare("DELETE FROM subjects WHERE school_id = ?").bind(parsedId),
        db.prepare("DELETE FROM classes WHERE school_id = ?").bind(parsedId),
        db.prepare("DELETE FROM uploaded_media WHERE school_id = ?").bind(parsedId),
        db.prepare("DELETE FROM schools WHERE id = ?").bind(parsedId)
      ]);
      return { success: true };
    } catch (e) {
      console.error(e);
      return fail(500, { error: e.message || "Gagal menghapus sekolah" });
    }
  }
};
export {
  actions,
  load
};
