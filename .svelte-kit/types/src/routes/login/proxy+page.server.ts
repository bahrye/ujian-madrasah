// @ts-nocheck
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { verifyPassword, createToken, COOKIE_NAME } from '$lib/server/auth';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
	if (locals.user) {
		throw redirect(302, `/${locals.user.role}`);
	}
};

export const actions = {
	default: async ({ request, platform, cookies }: import('./$types').RequestEvent) => {
		const formData = await request.formData();
		const username = formData.get('username')?.toString().trim();
		const password = formData.get('password')?.toString();

		if (!username || !password) {
			return fail(400, { error: 'Username dan kata sandi wajib diisi.' });
		}

		try {
			const db = getDB(platform);
			const user = await db.prepare('SELECT * FROM users WHERE username = ? AND is_active = 1')
				.bind(username)
				.first<{
					id: number;
					username: string;
					password_hash: string;
					name: string;
					role: string;
				}>();

			if (!user) {
				return fail(401, { error: 'Username atau kata sandi salah.' });
			}

			const valid = await verifyPassword(password, user.password_hash);
			if (!valid) {
				return fail(401, { error: 'Username atau kata sandi salah.' });
			}

			const token = await createToken({
				id: user.id,
				username: user.username,
				name: user.name,
				role: user.role as 'admin' | 'guru' | 'pengawas' | 'siswa'
			});

			cookies.set(COOKIE_NAME, token, {
				path: '/',
				httpOnly: true,
				secure: true,
				sameSite: 'lax',
				maxAge: 60 * 60 * 8 // 8 jam
			});

			throw redirect(302, `/${user.role}`);
		} catch (e) {
			if (e && typeof e === 'object' && 'status' in e && (e as { status: number }).status === 302) {
				throw e;
			}
			console.error('Login error:', e);
			return fail(500, { error: 'Terjadi kesalahan server. Silakan coba lagi.' });
		}
	}
};
;null as any as Actions;