import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getDB } from '$lib/server/db';
import { deleteFromCloudinary } from '$lib/server/cloudinary';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async ({ platform }) => {
	const db = getDB(platform);

	// Get all questions that have a Cloudinary media URL
	const query = `
		SELECT 
			q.id as question_id,
			q.question_number,
			q.media_url,
			q.media_type,
			e.title as exam_title,
			s.name as subject_name
		FROM questions q
		JOIN exams e ON q.exam_id = e.id
		LEFT JOIN subjects s ON e.subject_id = s.id
		WHERE q.media_url LIKE '%res.cloudinary.com%'
		ORDER BY s.name ASC, e.title ASC, q.question_number ASC
	`;

	const result = await db.prepare(query).all();
	return { mediaItems: result.results };
};

export const actions: Actions = {
	deleteMedia: async ({ request, platform }) => {
		const db = getDB(platform);
		const form = await request.formData();
		const questionId = form.get('question_id')?.toString();

		if (!questionId) {
			return fail(400, { error: 'ID Soal tidak valid.' });
		}

		// Get the media URL
		const q = await db.prepare('SELECT media_url FROM questions WHERE id = ?').bind(questionId).first<{ media_url: string }>();
		
		if (!q || !q.media_url || !q.media_url.includes('res.cloudinary.com')) {
			return fail(400, { error: 'Media tidak ditemukan atau bukan dari Cloudinary.' });
		}

		// Delete from Cloudinary
		const deleted = await deleteFromCloudinary(q.media_url, env);

		if (!deleted) {
			return fail(500, { error: 'Gagal menghapus dari Cloudinary. Pastikan API Key & Secret sudah diatur di Cloudflare.' });
		}

		// Delete from Database
		await db.prepare('UPDATE questions SET media_url = NULL, media_type = NULL WHERE id = ?').bind(questionId).run();

		return { success: 'Media berhasil dihapus dari Cloudinary dan Database.' };
	}
};
