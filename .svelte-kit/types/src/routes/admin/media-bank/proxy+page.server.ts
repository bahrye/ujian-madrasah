// @ts-nocheck
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getDB } from '$lib/server/db';
import { deleteFromCloudinary } from '$lib/server/cloudinary';
import { env } from '$env/dynamic/private';

export const load = async ({ platform, locals }: Parameters<PageServerLoad>[0]) => {
	const db = getDB(platform);

	// Sinkronisasi otomatis: Masukkan media yang sudah ada di tabel questions ke uploaded_media
	try {
		await db.prepare(`
			INSERT INTO uploaded_media (url, media_type, school_id)
			SELECT media_url, media_type, ? FROM questions 
			WHERE media_url LIKE '%res.cloudinary.com%' 
			AND media_url NOT IN (SELECT url FROM uploaded_media)
			GROUP BY media_url
		`).bind(locals.user?.school_id || -1).run();
	} catch (e) {
		console.error('Sync uploaded_media error:', e);
	}

	// Ambil semua dari uploaded_media, lalu cari letaknya di tabel questions
	const query = `
		SELECT 
			u.id as log_id,
			u.url as media_url,
			u.name,
			u.media_type,
			u.is_public,
			usr.name as uploader_name,
			q.id as question_id,
			q.question_number,
			e.title as exam_title,
			s.name as subject_name
		FROM uploaded_media u
		LEFT JOIN questions q ON u.url = q.media_url
		LEFT JOIN exams e ON q.exam_id = e.id
		LEFT JOIN subjects s ON e.subject_id = s.id
		LEFT JOIN users usr ON u.uploaded_by = usr.id
		WHERE u.school_id = ? OR ? = 'superadmin'
		ORDER BY q.id IS NULL DESC, s.name ASC, e.title ASC, q.question_number ASC
	`;

	try {
		const result = await db.prepare(query).bind(locals.user?.school_id || -1, locals.user?.role).all();
		return { mediaItems: result.results };
	} catch (e) {
		console.error('Fetch uploaded_media error:', e);
		return { mediaItems: [] };
	}
};

export const actions = {
	deleteMedia: async ({ request, platform, locals }: import('./$types').RequestEvent) => {
		const schoolId = locals.user?.school_id || -1;
		const db = getDB(platform);
		const form = await request.formData();
		const mediaUrl = form.get('media_url')?.toString();

		if (!mediaUrl || !mediaUrl.includes('res.cloudinary.com')) {
			return fail(400, { error: 'URL Media tidak valid.' });
		}

		// Verify media belongs to this school or superadmin
		if (locals.user?.role !== 'superadmin') {
			const check = await db.prepare('SELECT id FROM uploaded_media WHERE url = ? AND school_id = ?').bind(mediaUrl, schoolId).first();
			if (!check) return fail(403, { error: 'Media tidak ditemukan atau milik sekolah lain.' });
		}

		// Delete from Cloudinary
		const deleteResult = await deleteFromCloudinary(mediaUrl, env);

		if (!deleteResult.success) {
			return fail(500, { error: `Gagal menghapus dari Cloudinary. Pesan: ${deleteResult.error}` });
		}

		// Delete from uploaded_media tracker
		if (locals.user?.role === 'superadmin') {
			await db.prepare('DELETE FROM uploaded_media WHERE url = ?').bind(mediaUrl).run();
		} else {
			await db.prepare('DELETE FROM uploaded_media WHERE url = ? AND school_id = ?').bind(mediaUrl, schoolId).run();
		}

		// Remove link from questions
		await db.prepare('UPDATE questions SET media_url = NULL, media_type = NULL WHERE media_url = ?').bind(mediaUrl).run();

		return { success: 'Media berhasil dihapus dari Cloudinary dan Database.' };
	},
	toggleVisibility: async ({ request, platform, locals }: import('./$types').RequestEvent) => {
		const schoolId = locals.user?.school_id || -1;
		const db = getDB(platform);
		const form = await request.formData();
		const mediaUrl = form.get('media_url')?.toString();
		const isPublic = form.get('is_public')?.toString() === '1' ? 1 : 0;

		if (!mediaUrl) return fail(400, { error: 'URL Media tidak valid.' });

		if (locals.user?.role === 'superadmin') {
			await db.prepare('UPDATE uploaded_media SET is_public = ? WHERE url = ?')
				.bind(isPublic, mediaUrl)
				.run();
		} else {
			await db.prepare('UPDATE uploaded_media SET is_public = ? WHERE url = ? AND school_id = ?')
				.bind(isPublic, mediaUrl, schoolId)
				.run();
		}

		return { success: isPublic ? 'Media berhasil ditampilkan untuk semua guru.' : 'Media berhasil disembunyikan (Privat).' };
	},
	updateName: async ({ request, platform, locals }: import('./$types').RequestEvent) => {
		const schoolId = locals.user?.school_id || -1;
		const db = getDB(platform);
		const form = await request.formData();
		const mediaUrl = form.get('media_url')?.toString();
		const name = form.get('name')?.toString() || null;

		if (!mediaUrl) return fail(400, { error: 'URL Media tidak valid.' });

		if (locals.user?.role === 'superadmin') {
			await db.prepare('UPDATE uploaded_media SET name = ? WHERE url = ?')
				.bind(name, mediaUrl)
				.run();
		} else {
			await db.prepare('UPDATE uploaded_media SET name = ? WHERE url = ? AND school_id = ?')
				.bind(name, mediaUrl, schoolId)
				.run();
		}

		return { success: 'Nama berkas berhasil diperbarui.' };
	}
};
;null as any as Actions;