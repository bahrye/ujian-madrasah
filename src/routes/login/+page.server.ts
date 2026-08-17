import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB, ensureUserLoginColumns } from '$lib/server/db';
import { verifyPassword, createToken, COOKIE_NAME } from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		const redirectRoute = locals.user.role === 'panitia' ? '/admin' : `/${locals.user.role}`;
		throw redirect(302, redirectRoute);
	}
};

export const actions: Actions = {
	default: async ({ request, platform, cookies }) => {
		const formData = await request.formData();
		const username = formData.get('username')?.toString().trim();
		const password = formData.get('password')?.toString();

		if (!username || !password) {
			return fail(400, { error: 'Username dan kata sandi wajib diisi.' });
		}

		try {
			const db = getDB(platform);
			await ensureUserLoginColumns(db);

			const user = await db.prepare('SELECT * FROM users WHERE username = ? AND is_active = 1')
				.bind(username)
				.first<{
					id: number;
					school_id: number | null;
					class_id: number | null;
					username: string;
					password_hash: string;
					name: string;
					role: string;
					photo: string | null;
					is_logged_in?: number;
					session_token?: string | null;
				}>();

			if (!user) {
				return fail(401, { error: 'Username atau kata sandi salah.' });
			}

			const valid = await verifyPassword(password, user.password_hash);
			if (!valid) {
				return fail(401, { error: 'Username atau kata sandi salah.' });
			}

			let sessionToken: string | null = null;

			// Proteksi Login Siswa Multi-Perangkat
			if (user.role === 'siswa') {
				if (user.is_logged_in === 1) {
					return fail(400, {
						error: `Siswa atas nama "${user.name}" sudah terdeteksi login di perangkat lain. Silahkan meminta Pengawas Ruang untuk me-reset login siswa tersebut.`
					});
				}

				sessionToken = crypto.randomUUID();
				const userAgent = request.headers.get('user-agent') || 'Browser';
				const cleanDevice = userAgent.length > 120 ? userAgent.substring(0, 120) + '...' : userAgent;

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
				role: user.role as 'superadmin' | 'admin' | 'guru' | 'pengawas' | 'siswa',
				photo: user.photo,
				session_token: sessionToken
			});

			cookies.set(COOKIE_NAME, token, {
				path: '/',
				httpOnly: true,
				secure: true,
				sameSite: 'lax',
				maxAge: 60 * 60 * 8 // 8 jam
			});

			const redirectRoute = user.role === 'panitia' ? '/admin' : `/${user.role}`;
			throw redirect(302, redirectRoute);
		} catch (e) {
			if (e && typeof e === 'object' && 'status' in e && (e as { status: number }).status === 302) {
				throw e;
			}
			console.error('Login error:', e);
			return fail(500, { error: 'Terjadi kesalahan server. Silakan coba lagi.' });
		}
	}
};

