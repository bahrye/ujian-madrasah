import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDB } from '$lib/server/db';

export const GET: RequestHandler = async ({ platform, locals }) => {
	const user = locals.user;
	if (!user) {
		return json({ error: 'Unauthorized', media: [] }, { status: 401 });
	}

	try {
		const db = getDB(platform);
		let query = '';
		let result;

		if (user.role === 'superadmin') {
			query = 'SELECT url, name, media_type FROM uploaded_media ORDER BY id DESC';
			result = await db.prepare(query).all<{url: string, name: string, media_type: string}>();
		} else if (user.role === 'admin' || user.role === 'panitia') {
			query = 'SELECT url, name, media_type FROM uploaded_media WHERE school_id = ? ORDER BY id DESC';
			result = await db.prepare(query).bind(user.school_id || -1).all<{url: string, name: string, media_type: string}>();
		} else {
			query = 'SELECT url, name, media_type FROM uploaded_media WHERE school_id = ? AND (uploaded_by = ? OR is_public = 1) ORDER BY id DESC';
			result = await db.prepare(query).bind(user.school_id || -1, user.id || -1).all<{url: string, name: string, media_type: string}>();
		}
		
		return json({ success: true, media: result.results || [] });
	} catch (error) {
		console.error('API /media error:', error);
		return json({ success: false, error: 'Internal server error', media: [] }, { status: 500 });
	}
};

