import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDB } from '$lib/server/db';
import { createQrLoginToken } from '$lib/server/auth';

export const GET: RequestHandler = async ({ locals, platform }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	const db = getDB(platform);
	const user = await db.prepare('SELECT id, username, password_hash FROM users WHERE id = ?')
		.bind(locals.user.id)
		.first<{ id: number; username: string; password_hash: string }>();

	if (!user) {
		throw error(404, 'User tidak ditemukan');
	}

	const qrToken = await createQrLoginToken(user.id, user.username, user.password_hash);

	return json({
		username: user.username,
		qr_token: qrToken
	});
};
