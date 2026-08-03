import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDB } from '$lib/server/db';

export const GET: RequestHandler = async ({ platform }) => {
	try {
		const db = getDB(platform);
		const result = await db.prepare('SELECT url, media_type FROM uploaded_media ORDER BY id DESC').all<{url: string, media_type: string}>();
		return json({ success: true, media: result.results || [] });
	} catch (error) {
		console.error('API /media error:', error);
		return json({ success: false, error: 'Internal server error', media: [] }, { status: 500 });
	}
};
