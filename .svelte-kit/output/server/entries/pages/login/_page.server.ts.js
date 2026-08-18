import { fail, redirect } from "@sveltejs/kit";
import { g as getDB } from "../../../chunks/db.js";
import { d as verifyQrLoginToken, e as verifyPassword, c as createToken, C as COOKIE_NAME } from "../../../chunks/auth.js";
const load = async ({ locals }) => {
  if (locals.user) {
    const redirectRoute = locals.user.role === "panitia" ? "/admin" : `/${locals.user.role}`;
    throw redirect(302, redirectRoute);
  }
};
const actions = {
  default: async ({ request, platform, cookies }) => {
    const formData = await request.formData();
    const qrUsername = formData.get("qr_username")?.toString().trim();
    const qrPassword = formData.get("qr_password")?.toString();
    const username = qrUsername || formData.get("username")?.toString().trim();
    const password = qrPassword || formData.get("password")?.toString();
    const qrToken = formData.get("qr_token")?.toString().trim();
    const loginPin = formData.get("login_pin")?.toString().trim();
    if (!username || !password && !qrToken) {
      return fail(400, { error: "Username dan kata sandi wajib diisi." });
    }
    try {
      const db = getDB(platform);
      const user = await db.prepare("SELECT * FROM users WHERE username = ? AND is_active = 1").bind(username).first();
      if (!user) {
        return fail(401, { error: "Username atau kata sandi salah." });
      }
      let valid = false;
      if (qrToken) {
        if (user.role !== "siswa" && user.login_pin && user.login_pin.trim().length > 0) {
          if (!loginPin || loginPin !== user.login_pin.trim()) {
            return fail(401, { error: "Angka rahasia 5-digit tidak valid atau belum dimasukkan. Silakan minta angka rahasia kepada Admin." });
          }
        }
        valid = await verifyQrLoginToken(user.id, user.username, user.password_hash, qrToken);
        if (!valid) {
          return fail(401, { error: "Kode QR login tidak valid atau sudah kadaluarsa." });
        }
      } else if (password) {
        valid = await verifyPassword(password, user.password_hash);
        if (!valid) {
          return fail(401, { error: "Username atau kata sandi salah." });
        }
      }
      let sessionToken = null;
      if (user.role === "siswa") {
        if (user.is_logged_in === 1 && user.last_active_at) {
          let inactiveSec = 9999;
          let lastActiveStr = String(user.last_active_at).trim();
          if (!lastActiveStr.includes("T")) {
            lastActiveStr = lastActiveStr.replace(" ", "T") + "Z";
          }
          const lastActiveMs = new Date(lastActiveStr).getTime();
          if (!isNaN(lastActiveMs)) {
            inactiveSec = Math.floor((Date.now() - lastActiveMs) / 1e3);
          }
          if (inactiveSec < 180) {
            const remainingSec = 180 - Math.max(0, inactiveSec);
            const remMin = Math.floor(remainingSec / 60);
            const remSec = remainingSec % 60;
            const timeStr = remMin > 0 ? `${remMin} menit ${remSec} detik` : `${remSec} detik`;
            return fail(400, {
              error: `Siswa atas nama "${user.name}" terdeteksi masih aktif di perangkat lain. Login di perangkat ini dapat diakses setelah 3 menit tidak ada aktivitas pada perangkat sebelumnya (${timeStr} lagi) atau silakan minta Pengawas Ruang untuk me-reset login.`
            });
          }
        }
        sessionToken = crypto.randomUUID();
        const userAgent = request.headers.get("user-agent") || "Browser";
        const cleanDevice = userAgent.length > 120 ? userAgent.substring(0, 120) + "..." : userAgent;
        await db.prepare(`
					UPDATE users 
					SET is_logged_in = 1, session_token = ?, last_active_at = datetime('now'), login_device = ? 
					WHERE id = ?
				`).bind(sessionToken, cleanDevice, user.id).run();
      }
      const token = await createToken({
        id: user.id,
        school_id: user.school_id,
        class_id: user.class_id,
        username: user.username,
        name: user.name,
        role: user.role,
        photo: user.photo,
        session_token: sessionToken
      });
      cookies.set(COOKIE_NAME, token, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 8
        // 8 jam
      });
      const redirectRoute = user.role === "panitia" ? "/admin" : `/${user.role}`;
      throw redirect(302, redirectRoute);
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
