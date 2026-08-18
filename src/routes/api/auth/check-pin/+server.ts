import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDB, ensureUserLoginPinColumn } from '$lib/server/db';

export const GET: RequestHandler = async ({ url, platform }) => {
	const username = url.searchParams.get('u')?.trim();
	if (!username) {
		return json({ requires_pin: false });
	}

	try {
		const db = getDB(platform);
		await ensureUserLoginPinColumn(db);

		const user = await db.prepare('SELECT id, username, name, role, login_pin FROM users WHERE username = ? AND is_active = 1')
			.bind(username)
			.first<{ id: number; username: string; name: string; role: string; login_pin: string | null }>();

		if (!user) {
			return json({ requires_pin: false });
		}

		// Siswa does NOT require PIN. Only staff roles (guru, pengawas, panitia, admin) if login_pin is set.
		if (user.role !== 'siswa' && user.login_pin && user.login_pin.trim().length > 0) {
			return json({
				requires_pin: true,
				name: user.name,
				role: user.role,
				username: user.username
			});
		}

		return json({ requires_pin: false });
	} catch (e) {
		console.error('Check pin error:', e);
		return json({ requires_pin: false });
	}
};
