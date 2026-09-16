import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { COOKIE_NAME } from '$lib/server/auth';
import { getDB } from '$lib/server/db';
import { recordActivityLog, getClientIp } from '$lib/server/activity-log';

export const GET: RequestHandler = async ({ request, cookies, locals, platform, getClientAddress }) => {
	if (locals.user) {
		try {
			const db = getDB(platform);
			const ip = getClientIp(request, getClientAddress);
			await recordActivityLog(db, {
				schoolId: locals.user.school_id,
				userId: locals.user.id,
				userName: locals.user.name,
				userRole: locals.user.role,
				action: 'logout',
				detail: 'Keluar aplikasi',
				ipAddress: ip
			});

			await db.prepare('UPDATE users SET is_logged_in = 0, session_token = NULL, last_active_at = NULL WHERE id = ?')
				.bind(locals.user.id)
				.run();
		} catch (e) {
			console.error('Error updating logout status:', e);
		}
	}

	cookies.delete(COOKIE_NAME, { path: '/' });
	throw redirect(302, '/login');
};

export const POST: RequestHandler = GET;

