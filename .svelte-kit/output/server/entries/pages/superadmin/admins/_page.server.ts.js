import { fail } from "@sveltejs/kit";
import { g as getDB } from "../../../../chunks/db.js";
import { h as hashPassword } from "../../../../chunks/auth.js";
const load = async ({ platform }) => {
  const db = getDB(platform);
  const { results: schools } = await db.prepare("SELECT id, name FROM schools ORDER BY name ASC").all();
  const { results: admins } = await db.prepare(`
		SELECT u.id, u.username, u.name, u.is_active, u.created_at, s.name as school_name, s.id as school_id
		FROM users u
		LEFT JOIN schools s ON u.school_id = s.id
		WHERE u.role = 'admin'
		ORDER BY u.created_at DESC
	`).all();
  return { schools, admins };
};
const actions = {
  add: async ({ request, platform }) => {
    const db = getDB(platform);
    const data = await request.formData();
    const schoolIdStr = data.get("school_id")?.toString();
    const username = data.get("username")?.toString().trim();
    const password = data.get("password")?.toString();
    const name = data.get("name")?.toString().trim();
    const parsedSchoolId = parseInt(schoolIdStr || "", 10);
    if (isNaN(parsedSchoolId) || !username || !password || !name) {
      return fail(400, { error: "Semua field wajib diisi dengan benar", school_id: schoolIdStr, username, name });
    }
    if (password.length < 6) {
      return fail(400, { error: "Password minimal 6 karakter", school_id, username, name });
    }
    const existingUser = await db.prepare("SELECT id FROM users WHERE username = ?").bind(username).first();
    if (existingUser) {
      return fail(400, { error: "Username sudah digunakan", school_id: schoolIdStr, username, name });
    }
    try {
      const password_hash = await hashPassword(password);
      await db.prepare("INSERT INTO users (school_id, username, password_hash, name, role) VALUES (?, ?, ?, ?, ?)").bind(parsedSchoolId, username, password_hash, name, "admin").run();
      return { success: true };
    } catch (e) {
      console.error(e);
      return fail(500, { error: e.message || "Gagal menambahkan admin", school_id: schoolIdStr, username, name });
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
      await db.prepare(`UPDATE users SET is_active = ?, updated_at = datetime('now') WHERE id = ? AND role = 'admin'`).bind(newStatus, parsedId).run();
      return { success: true };
    } catch (e) {
      console.error(e);
      return fail(500, { error: e.message || "Gagal merubah status admin" });
    }
  },
  delete: async ({ request, platform, locals }) => {
    if (!locals.user || locals.user.role !== "superadmin") return fail(401, { error: "Unauthorized" });
    const db = getDB(platform);
    const data = await request.formData();
    const idStr = data.get("id")?.toString();
    const parsedId = parseInt(idStr || "", 10);
    if (isNaN(parsedId)) return fail(400, { error: "ID tidak valid" });
    const userToDelete = await db.prepare(`SELECT id, is_active FROM users WHERE id = ? AND role = 'admin'`).bind(parsedId).first();
    if (!userToDelete) {
      return fail(404, { error: "Admin tidak ditemukan" });
    }
    if (userToDelete.is_active === 1) {
      return fail(400, { error: "Gagal dihapus: Admin masih AKTIF. Harap nonaktifkan admin terlebih dahulu!" });
    }
    try {
      await db.batch([
        db.prepare("UPDATE exams SET created_by = NULL WHERE created_by = ?").bind(parsedId),
        db.prepare("UPDATE tokens SET created_by = NULL WHERE created_by = ?").bind(parsedId),
        db.prepare("UPDATE uploaded_media SET uploaded_by = NULL WHERE uploaded_by = ?").bind(parsedId),
        db.prepare(`DELETE FROM users WHERE id = ? AND role = 'admin'`).bind(parsedId)
      ]);
      return { success: true };
    } catch (e) {
      console.error("Delete admin error:", e);
      return fail(500, { error: e.message || "Gagal menghapus admin" });
    }
  }
};
export {
  actions,
  load
};
