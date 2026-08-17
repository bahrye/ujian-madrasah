import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { COOKIE_NAME } from '$lib/server/auth';
import { getDB } from '$lib/server/db';

export const GET: RequestHandler = async ({ cookies, locals, platform }) => {
	if (locals.user) {
		try {
			const db = getDB(platform);
			await db.prepare('UPDATE users SET is_logged_in = 0, session_token = NULL WHERE id = ?')
				.bind(locals.user.id)
				.run();
		} catch (e) {
			console.error('Error updating logout status:', e);
		}
	}

	cookies.delete(COOKIE_NAME, { path: '/' });
	throw redirect(302, '/login');
};

