import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { deleteFromCloudinary } from '$lib/server/cloudinary';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { url } = (await request.json()) as { url: string };

		if (!url) {
			return json({ success: false, error: 'URL is required' }, { status: 400 });
		}

		// Only attempt deletion for Cloudinary URLs
		if (!url.includes('res.cloudinary.com')) {
			return json({ success: true, message: 'Not a Cloudinary URL, skipped.' });
		}

		const deleted = await deleteFromCloudinary(url, env);

		if (deleted) {
			return json({ success: true });
		} else {
			return json({ success: false, error: 'Failed to delete or credentials missing' }, { status: 500 });
		}
	} catch (error) {
		console.error('API /delete-media error:', error);
		return json({ success: false, error: 'Internal Server Error' }, { status: 500 });
	}
};
