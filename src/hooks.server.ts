import { type Handle } from '@sveltejs/kit';
import { verifyToken, COOKIE_NAME } from '$lib/server/auth';
import { getDB } from '$lib/server/db';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get(COOKIE_NAME);

	if (token) {
		const user = await verifyToken(token);
		if (user) {
			if (user.role === 'siswa' && user.session_token) {
				try {
					const db = getDB(event.platform);
					const dbUser = await db.prepare('SELECT is_logged_in, session_token FROM users WHERE id = ?')
						.bind(user.id)
						.first<{ is_logged_in: number; session_token: string | null }>();

					if (!dbUser || dbUser.is_logged_in !== 1 || dbUser.session_token !== user.session_token) {
						// Session invalid or reset by Pengawas
						event.cookies.delete(COOKIE_NAME, { path: '/' });
						event.locals.user = null;
						return resolve(event);
					}

					// Update active timestamp in background without blocking response
					const updatePromise = db.prepare(`UPDATE users SET last_active_at = datetime('now') WHERE id = ?`)
						.bind(user.id)
						.run()
						.catch(() => {});

					if (event.platform?.context?.waitUntil) {
						event.platform.context.waitUntil(updatePromise);
					}
				} catch (e) {
					// Fallback if db is unavailable
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


