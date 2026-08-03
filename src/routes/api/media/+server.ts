import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDB } from '$lib/server/db';

export const GET: RequestHandler = async ({ platform, locals }) => {
	try {
		const db = getDB(platform);
		let query = 'SELECT url, name, media_type FROM uploaded_media ORDER BY id DESC';
		let result;

		if (locals.user?.role === 'admin' || locals.user?.role === 'superadmin') {
			result = await db.prepare(query).all<{url: string, name: string, media_type: string}>();
		} else {
			query = 'SELECT url, name, media_type FROM uploaded_media WHERE uploaded_by = ? OR is_public = 1 ORDER BY id DESC';
			result = await db.prepare(query).bind(locals.user?.id || -1).all<{url: string, name: string, media_type: string}>();
		}
		
		return json({ success: true, media: result.results || [] });
	} catch (error) {
		console.error('API /media error:', error);
		return json({ success: false, error: 'Internal server error', media: [] }, { status: 500 });
	}
};
