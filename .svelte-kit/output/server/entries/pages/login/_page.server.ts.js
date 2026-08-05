import { fail, redirect } from "@sveltejs/kit";
import { g as getDB } from "../../../chunks/db.js";
import { a as verifyPassword, c as createToken, C as COOKIE_NAME } from "../../../chunks/auth.js";
const load = async ({ locals }) => {
  if (locals.user) {
    throw redirect(302, `/${locals.user.role}`);
  }
};
const actions = {
  default: async ({ request, platform, cookies }) => {
    const formData = await request.formData();
    const username = formData.get("username")?.toString().trim();
    const password = formData.get("password")?.toString();
    if (!username || !password) {
      return fail(400, { error: "Username dan kata sandi wajib diisi." });
    }
    try {
      const db = getDB(platform);
      const user = await db.prepare("SELECT * FROM users WHERE username = ? AND is_active = 1").bind(username).first();
      if (!user) {
        return fail(401, { error: "Username atau kata sandi salah." });
      }
      const valid = await verifyPassword(password, user.password_hash);
      if (!valid) {
        return fail(401, { error: "Username atau kata sandi salah." });
      }
      const token = await createToken({
        id: user.id,
        school_id: user.school_id,
        class_id: user.class_id,
        username: user.username,
        name: user.name,
        role: user.role
      });
      cookies.set(COOKIE_NAME, token, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 8
        // 8 jam
      });
      throw redirect(302, `/${user.role}`);
    } catch (e) {
      if (e && typeof e === "object" && "status" in e && e.status === 302) {
        throw e;
      }
      console.error("Login error:", e);
      return fail(500, { error: "Terjadi kesalahan server. Silakan coba lagi." });
    }
  }
};
export {
  actions,
  load
};
