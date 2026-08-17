import "@sveltejs/kit";
import { C as COOKIE_NAME, v as verifyToken } from "../chunks/auth.js";
import { g as getDB, e as ensureUserLoginColumns } from "../chunks/db.js";
const handle = async ({ event, resolve }) => {
  const token = event.cookies.get(COOKIE_NAME);
  if (token) {
    const user = await verifyToken(token);
    if (user) {
      if (user.role === "siswa" && user.session_token) {
        try {
          const db = getDB(event.platform);
          await ensureUserLoginColumns(db);
          const dbUser = await db.prepare("SELECT is_logged_in, session_token FROM users WHERE id = ?").bind(user.id).first();
          if (!dbUser || dbUser.is_logged_in !== 1 || dbUser.session_token !== user.session_token) {
            event.cookies.delete(COOKIE_NAME, { path: "/" });
            event.locals.user = null;
            return resolve(event);
          }
          db.prepare(`UPDATE users SET last_active_at = datetime('now') WHERE id = ?`).bind(user.id).run().catch(() => {
          });
        } catch (e) {
        }
      }
      event.locals.user = user;
    } else {
      event.locals.user = null;
    }
  } else {
    event.locals.user = null;
  }
  return resolve(event);
};
export {
  handle
};
