import { fail, redirect } from "@sveltejs/kit";
import { g as getDB } from "../../../../chunks/db.js";
import { h as hashPassword, c as createToken, C as COOKIE_NAME } from "../../../../chunks/auth.js";
const load = async ({ platform, locals }) => {
  if (!locals.user || locals.user.role !== "superadmin") {
    throw redirect(302, "/login");
  }
  const db = getDB(platform);
  const { results: superadmins } = await db.prepare(`
		SELECT id, username, name, is_active, created_at
		FROM users
		WHERE role = 'superadmin'
		ORDER BY created_at DESC
	`).all();
  return {
    superadmins: superadmins || [],
    currentUser: locals.user
  };
};
const actions = {
  updateSelf: async ({ request, platform, locals, cookies }) => {
    if (!locals.user || locals.user.role !== "superadmin") {
      return fail(401, { error: "Unauthorized" });
    }
    const db = getDB(platform);
    const form = await request.formData();
    const name = form.get("name")?.toString().trim();
    const username = form.get("username")?.toString().trim();
    const password = form.get("password")?.toString();
    if (!name || !username) {
      return fail(400, { error: "Nama dan Username wajib diisi." });
    }
    const existing = await db.prepare("SELECT id FROM users WHERE username = ? AND id != ?").bind(username, locals.user.id).first();
    if (existing) {
      return fail(400, { error: "Username sudah digunakan oleh akun lain." });
    }
    try {
      if (password && password.trim().length > 0) {
        if (password.length < 6) {
          return fail(400, { error: "Kata sandi minimal 6 karakter." });
        }
        const passwordHash = await hashPassword(password);
        await db.prepare('UPDATE users SET name = ?, username = ?, password_hash = ?, updated_at = datetime("now") WHERE id = ? AND role = "superadmin"').bind(name, username, passwordHash, locals.user.id).run();
      } else {
        await db.prepare('UPDATE users SET name = ?, username = ?, updated_at = datetime("now") WHERE id = ? AND role = "superadmin"').bind(name, username, locals.user.id).run();
      }
      const updatedUser = {
        ...locals.user,
        name,
        username
      };
      const token = await createToken(updatedUser);
      cookies.set(COOKIE_NAME, token, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 8
      });
      return { success: "Profil dan kata sandi Anda berhasil diperbarui." };
    } catch (err) {
      console.error("Update self superadmin error:", err);
      return fail(500, { error: "Terjadi kesalahan server saat memperbarui profil." });
    }
  },
  createSuperadmin: async ({ request, platform, locals }) => {
    if (!locals.user || locals.user.role !== "superadmin") {
      return fail(401, { error: "Unauthorized" });
    }
    const db = getDB(platform);
    const form = await request.formData();
    const name = form.get("name")?.toString().trim();
    const username = form.get("username")?.toString().trim();
    const password = form.get("password")?.toString();
    if (!name || !username || !password) {
      return fail(400, { error: "Semua field wajib diisi." });
    }
    if (password.length < 6) {
      return fail(400, { error: "Kata sandi minimal 6 karakter." });
    }
    const existing = await db.prepare("SELECT id FROM users WHERE username = ?").bind(username).first();
    if (existing) {
      return fail(400, { error: "Username sudah digunakan." });
    }
    try {
      const passwordHash = await hashPassword(password);
      await db.prepare('INSERT INTO users (school_id, class_id, username, password_hash, name, role) VALUES (NULL, NULL, ?, ?, ?, "superadmin")').bind(username, passwordHash, name).run();
      return { success: "Akun Superadmin baru berhasil dibuat." };
    } catch (err) {
      console.error("Create superadmin error:", err);
      return fail(500, { error: "Gagal membuat akun Superadmin baru." });
    }
  },
  deleteSuperadmin: async ({ request, platform, locals }) => {
    if (!locals.user || locals.user.role !== "superadmin") {
      return fail(401, { error: "Unauthorized" });
    }
    const db = getDB(platform);
    const form = await request.formData();
    const id = form.get("id")?.toString();
    if (!id) return fail(400, { error: "ID tidak valid." });
    if (id === locals.user.id.toString()) {
      return fail(400, { error: "Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif." });
    }
    const countRes = await db.prepare('SELECT COUNT(*) as c FROM users WHERE role = "superadmin"').first();
    if (countRes && countRes.c <= 1) {
      return fail(400, { error: "Tidak dapat menghapus. Harus tersisa minimal 1 akun Superadmin di sistem." });
    }
    try {
      await db.prepare('DELETE FROM users WHERE id = ? AND role = "superadmin"').bind(id).run();
      return { success: "Akun Superadmin berhasil dihapus." };
    } catch (err) {
      console.error("Delete superadmin error:", err);
      return fail(500, { error: "Terjadi kesalahan sistem saat menghapus superadmin." });
    }
  }
};
export {
  actions,
  load
};
