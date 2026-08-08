import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { deleteFromCloudinary } from '$lib/server/cloudinary';
import { getDB } from '$lib/server/db';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ request, locals, platform }) => {
	if (!locals.user || !['superadmin', 'admin', 'guru'].includes(locals.user.role)) {
		return json({ success: false, error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { url } = (await request.json()) as { url: string };

		if (!url) {
			return json({ success: false, error: 'URL is required' }, { status: 400 });
		}

		// Only attempt deletion for Cloudinary URLs
		if (!url.includes('res.cloudinary.com')) {
			return json({ success: true, message: 'Not a Cloudinary URL, skipped.' });
		}

		const db = getDB(platform);
		if (locals.user.role !== 'superadmin') {
			// Verify that the media belongs to this school
			const mediaRecord = await db.prepare('SELECT id, uploaded_by, school_id FROM uploaded_media WHERE url = ? AND school_id = ?')
				.bind(url, locals.user.school_id)
				.first<{ id: number; uploaded_by: number; school_id: number }>();

			if (mediaRecord) {
				if (locals.user.role === 'guru' && mediaRecord.uploaded_by !== locals.user.id) {
					return json({ success: false, error: 'Forbidden: You cannot delete media uploaded by others.' }, { status: 403 });
				}
			}
		}

		const deleteResult = await deleteFromCloudinary(url, env);

		if (deleteResult.success) {
			if (locals.user.school_id) {
				await db.prepare('DELETE FROM uploaded_media WHERE url = ? AND school_id = ?').bind(url, locals.user.school_id).run();
			}
			return json({ success: true });
		} else {
			return json({ success: false, error: deleteResult.error || 'Failed to delete' }, { status: 500 });
		}
	} catch (error) {
		console.error('API /delete-media error:', error);
		return json({ success: false, error: 'Internal Server Error' }, { status: 500 });
	}
};
