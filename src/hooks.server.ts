import { type Handle, redirect } from '@sveltejs/kit';
import { verifyToken, COOKIE_NAME } from '$lib/server/auth';
import { getDB } from '$lib/server/db';
// Cache timestamp aktivitas terakhir siswa untuk throttling write DB
const lastActiveMap = new Map<number, number>();

// Cache validasi sesi siswa di RAM untuk menghemat CPU & query DB berulang
interface SessionCacheEntry {
	sessionToken: string;
	isValid: boolean;
	expiresAt: number;
}
const sessionCache = new Map<number, SessionCacheEntry>();

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get(COOKIE_NAME);

	if (token) {
		const user = await verifyToken(token);
		if (user) {
			if (user.role === 'siswa' && user.session_token) {
				try {
					const now = Date.now();
					const cached = sessionCache.get(user.id);
					let isValidSession = false;

					if (cached && cached.expiresAt > now && cached.sessionToken === user.session_token) {
						isValidSession = cached.isValid;
					} else {
						const db = getDB(event.platform);
						const dbUser = await db.prepare('SELECT is_logged_in, session_token FROM users WHERE id = ?')
							.bind(user.id)
							.first<{ is_logged_in: number; session_token: string | null }>();

						isValidSession = Boolean(dbUser && dbUser.is_logged_in === 1 && dbUser.session_token === user.session_token);
						sessionCache.set(user.id, {
							sessionToken: user.session_token,
							isValid: isValidSession,
							expiresAt: now + 15000 // Cache 15 detik di RAM
						});

						if (sessionCache.size > 2000) {
							for (const [uid, item] of sessionCache) {
								if (now > item.expiresAt) sessionCache.delete(uid);
							}
						}
					}

					if (!isValidSession) {
						// Session invalid or reset by Pengawas
						sessionCache.delete(user.id);
						event.cookies.delete(COOKIE_NAME, { path: '/' });
						event.locals.user = null;
						return resolve(event);
					}

					// Update active timestamp in background maksimal 1x per 60 detik per siswa
					const lastActive = lastActiveMap.get(user.id) || 0;
					if (now - lastActive > 60000) {
						lastActiveMap.set(user.id, now);
						if (lastActiveMap.size > 2000) {
							// Bersihkan cache lama jika melebihi 2000 entri
							for (const [uid, time] of lastActiveMap) {
								if (now - time > 300000) lastActiveMap.delete(uid);
							}
						}

						const db = getDB(event.platform);
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

	// RBAC Central Route Protection
	const pathname = event.url.pathname;
	const user = event.locals.user;

	// Helper for unauthorized redirect
	const requireAuth = (allowedRoles: string[]) => {
		if (!user) {
			if (event.request.headers.get('accept')?.includes('application/json') && pathname.startsWith('/api/')) {
				return new Response(JSON.stringify({ error: 'Unauthorized' }), {
					status: 401,
					headers: { 'Content-Type': 'application/json' }
				});
			}
			throw redirect(302, '/login');
		}

		if (!allowedRoles.includes(user.role)) {
			if (event.request.headers.get('accept')?.includes('application/json') && pathname.startsWith('/api/')) {
				return new Response(JSON.stringify({ error: 'Forbidden' }), {
					status: 403,
					headers: { 'Content-Type': 'application/json' }
				});
			}
			const fallbackRoute = user.role === 'panitia' ? '/admin' : `/${user.role}`;
			throw redirect(302, fallbackRoute);
		}

		return null;
	};

	if (pathname.startsWith('/superadmin')) {
		const res = requireAuth(['superadmin']);
		if (res) return res;
	} else if (pathname.startsWith('/admin')) {
		const res = requireAuth(['admin', 'panitia', 'superadmin']);
		if (res) return res;

		// Panitia sub-module restriction
		if (user?.role === 'panitia') {
			const restrictedPaths = ['/admin/school-profile', '/admin/users', '/admin/students', '/admin/classes'];
			if (restrictedPaths.some(p => pathname.startsWith(p))) {
				throw redirect(302, '/admin');
			}
		}
	} else if (pathname.startsWith('/guru')) {
		const res = requireAuth(['guru', 'admin', 'panitia', 'superadmin']);
		if (res) return res;
	} else if (pathname.startsWith('/pengawas')) {
		const res = requireAuth(['pengawas', 'admin', 'panitia', 'superadmin']);
		if (res) return res;
	} else if (pathname.startsWith('/siswa')) {
		const res = requireAuth(['siswa']);
		if (res) return res;
	} else if (pathname.startsWith('/print')) {
		const res = requireAuth(['superadmin', 'admin', 'guru', 'panitia']);
		if (res) return res;
	}

	return resolve(event);
};


