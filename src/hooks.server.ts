import { type Handle } from '@sveltejs/kit';
import { verifyToken, COOKIE_NAME } from '$lib/server/auth';
import { getDB } from '$lib/server/db';

// Cache timestamp aktivitas terakhir siswa untuk throttling write DB
const lastActiveMap = new Map<number, number>();

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

					// Update active timestamp in background maksimal 1x per 60 detik per siswa
					const now = Date.now();
					const lastActive = lastActiveMap.get(user.id) || 0;
					if (now - lastActive > 60000) {
						lastActiveMap.set(user.id, now);
						if (lastActiveMap.size > 2000) {
							// Bersihkan cache lama jika melebihi 2000 entri
							for (const [uid, time] of lastActiveMap) {
								if (now - time > 300000) lastActiveMap.delete(uid);
							}
						}

						const updatePromise = db.prepare(`UPDATE users SET last_active_at = datetime('now') WHERE id = ?`)
							.bind(user.id)
							.run()
							.catch(() => {});

						if (event.platform?.context?.waitUntil) {
							event.platform.context.waitUntil(updatePromise);
						}
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


