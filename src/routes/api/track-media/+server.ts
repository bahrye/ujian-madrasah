import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDB, dbRun } from '$lib/server/db';

export const POST: RequestHandler = async ({ request, platform, locals }) => {
	try {
		const db = getDB(platform);
		const { url, media_type, name } = await request.json() as { url: string; media_type: string; name?: string };

		if (!url || !media_type) {
			return json({ success: false, error: 'URL dan media_type wajib diisi' }, { status: 400 });
		}

		if (!['image', 'audio'].includes(media_type)) {
			return json({ success: false, error: 'media_type tidak valid' }, { status: 400 });
		}

		const fileName = name || url.split('/').pop() || 'Media File';

		// Insert ignore (or handle conflict)
		// SQLite UPSERT (ON CONFLICT DO NOTHING)
		const query = `
			INSERT INTO uploaded_media (school_id, name, url, media_type, uploaded_by, is_public)
			VALUES (?, ?, ?, ?, ?, ?)
			ON CONFLICT(url) DO NOTHING
		`;

		await dbRun(db, query, locals.user?.school_id || null, fileName, url, media_type, locals.user?.id || null, 0);

		return json({ success: true });
	} catch (error) {
		console.error('API /track-media error:', error);
		return json({ success: false, error: 'Internal Server Error' }, { status: 500 });
	}
};
