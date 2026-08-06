import { fail } from "@sveltejs/kit";
import { g as getDB } from "../../../../chunks/db.js";
import { h as hashPassword, c as createToken, C as COOKIE_NAME } from "../../../../chunks/auth.js";
const load = async ({ platform, url, locals }) => {
  const db = getDB(platform);
  const search = url.searchParams.get("search") || "";
  const roleFilter = url.searchParams.get("role") || "";
  let query = 'SELECT id, username, name, role, is_active, created_at, photo FROM users WHERE school_id = ? AND role != "siswa" AND role != "superadmin" AND role != "admin"';
  const params = [locals.user.school_id];
  if (search) {
    query += " AND (username LIKE ? OR name LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }
  if (roleFilter) {
    query += " AND role = ?";
    params.push(roleFilter);
  }
  query += " ORDER BY created_at DESC";
  const [usersResult, school] = await Promise.all([
    db.prepare(query).bind(...params).all(),
    db.prepare("SELECT name, logo_url FROM schools WHERE id = ?").bind(locals.user.school_id).first()
  ]);
  return {
    users: usersResult.results || [],
    search,
    roleFilter,
    schoolName: school?.name || "",
    schoolLogo: school?.logo_url || ""
  };
};
const actions = {
  create: async ({ request, platform, locals }) => {
    const db = getDB(platform);
    const form = await request.formData();
    const schoolId = locals.user.school_id;
    const username = form.get("username")?.toString().trim();
    const password = form.get("password")?.toString();
    const name = form.get("name")?.toString().trim();
    const role = form.get("role")?.toString();
    if (!username || !password || !name || !role) {
      return fail(400, { error: "Semua field wajib diisi." });
    }
    if (!["guru", "pengawas", "siswa"].includes(role)) {
      return fail(400, { error: "Role tidak valid." });
    }
    const existing = await db.prepare("SELECT id FROM users WHERE username = ?").bind(username).first();
    if (existing) {
      return fail(400, { error: "Username sudah digunakan." });
    }
    try {
      const passwordHash = await hashPassword(password);
      await db.prepare("INSERT INTO users (school_id, username, password_hash, name, role) VALUES (?, ?, ?, ?, ?)").bind(schoolId, username, passwordHash, name, role).run();
      return { success: "Pengguna berhasil ditambahkan." };
    } catch (e) {
      console.error(e);
      return fail(500, { error: e.message || "Gagal menambahkan pengguna." });
    }
  },
  update: async ({ request, platform, locals, cookies }) => {
    const db = getDB(platform);
    const form = await request.formData();
    const schoolId = locals.user.school_id;
    const idStr = form.get("id")?.toString();
    const name = form.get("name")?.toString().trim();
    const role = form.get("role")?.toString();
    const password = form.get("password")?.toString();
    const isActive = form.get("is_active")?.toString();
    const parsedId = parseInt(idStr || "", 10);
    if (isNaN(parsedId) || !name || !role) {
      return fail(400, { error: "Data tidak lengkap." });
    }
    try {
      if (password) {
        const passwordHash = await hashPassword(password);
        await db.prepare("UPDATE users SET name = ?, role = ?, password_hash = ?, is_active = ?, updated_at = datetime('now') WHERE id = ? AND school_id = ?").bind(name, role, passwordHash, isActive === "1" ? 1 : 0, parsedId, schoolId).run();
      } else {
        await db.prepare("UPDATE users SET name = ?, role = ?, is_active = ?, updated_at = datetime('now') WHERE id = ? AND school_id = ?").bind(name, role, isActive === "1" ? 1 : 0, parsedId, schoolId).run();
      }
    } catch (e) {
      console.error(e);
      return fail(500, { error: e.message || "Gagal memperbarui pengguna." });
    }
    if (parsedId === locals.user.id) {
      const updatedUser = {
        ...locals.user,
        name,
        role
      };
      const token = await createToken(updatedUser);
      cookies.set(COOKIE_NAME, token, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 8
        // 8 jam
      });
    }
    return { success: "Pengguna berhasil diperbarui." };
  },
  delete: async ({ request, platform, locals }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });
    const db = getDB(platform);
    const form = await request.formData();
    const idStr = form.get("id")?.toString();
    const schoolId = locals.user.school_id;
    const parsedId = parseInt(idStr || "", 10);
    if (isNaN(parsedId)) return fail(400, { error: "ID tidak valid." });
    const userToDelete = await db.prepare("SELECT id, is_active, role FROM users WHERE id = ? AND school_id = ?").bind(parsedId, schoolId).first();
    if (!userToDelete) {
      return fail(404, { error: "Pengguna tidak ditemukan." });
    }
    if (userToDelete.id === locals.user.id) {
      return fail(400, { error: "Anda tidak dapat menghapus akun Anda sendiri." });
    }
    if (userToDelete.is_active === 1) {
      return fail(400, { error: "Gagal dihapus: Pengguna masih AKTIF. Harap nonaktifkan pengguna terlebih dahulu!" });
    }
    try {
      await db.batch([
        db.prepare("UPDATE exams SET created_by = NULL WHERE created_by = ?").bind(parsedId),
        db.prepare("UPDATE tokens SET created_by = NULL WHERE created_by = ?").bind(parsedId),
        db.prepare("UPDATE uploaded_media SET uploaded_by = NULL WHERE uploaded_by = ?").bind(parsedId),
        db.prepare("DELETE FROM exam_teachers WHERE teacher_id = ?").bind(parsedId),
        db.prepare("DELETE FROM exam_proctors WHERE proctor_id = ?").bind(parsedId),
        db.prepare("DELETE FROM exam_participants WHERE student_id = ?").bind(parsedId),
        db.prepare("DELETE FROM student_answers WHERE attempt_id IN (SELECT id FROM student_attempts WHERE student_id = ?)").bind(parsedId),
        db.prepare("DELETE FROM student_attempts WHERE student_id = ?").bind(parsedId),
        db.prepare("DELETE FROM users WHERE id = ? AND school_id = ?").bind(parsedId, schoolId)
      ]);
      return { success: "Pengguna nonaktif berhasil dihapus." };
    } catch (err) {
      console.error("Delete user error:", err);
      return fail(500, { error: "Terjadi kesalahan sistem saat menghapus pengguna." });
    }
  },
  importExcel: async ({ request, locals, platform }) => {
    const db = getDB(platform);
    const data = await request.formData();
    const usersJson = data.get("users_json")?.toString();
    if (!usersJson) {
      return fail(400, { error: "Data tidak valid" });
    }
    try {
      const users = JSON.parse(usersJson);
      if (users.length === 0) return fail(400, { error: "Tidak ada data pengguna" });
      let successCount = 0;
      for (const user of users) {
        const existing = await db.prepare("SELECT id FROM users WHERE username = ? AND school_id = ?").bind(user.username, locals.user.school_id).first();
        if (!existing) {
          const passwordHash = await hashPassword(user.password);
          await db.prepare("INSERT INTO users (school_id, username, password_hash, name, role) VALUES (?, ?, ?, ?, ?)").bind(locals.user.school_id, user.username, passwordHash, user.name, user.role).run();
          successCount++;
        }
      }
      return { success: `Berhasil mengimpor ${successCount} pengguna dari total ${users.length} data.` };
    } catch (e) {
      console.error("Import error:", e);
      return fail(500, { error: e.message || "Terjadi kesalahan saat memproses data import" });
    }
  }
};
export {
  actions,
  load
};
