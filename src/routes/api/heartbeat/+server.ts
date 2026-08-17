import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		return json({ ok: false }, { status: 401 });
	}
	return json({ ok: true, last_active_at: new Date().toISOString() });
};

export const POST: RequestHandler = GET;
