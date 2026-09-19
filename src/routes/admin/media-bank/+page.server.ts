import { fail, error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getDB } from '$lib/server/db';
import { deleteFromCloudinary, deleteCloudinaryResources, cleanOrphanedMedia } from '$lib/server/cloudinary';
import { env } from '$env/dynamic/private';

// FITUR DINONAKTIFKAN SEMENTARA: Halaman Bank Media disembunyikan dan dinonaktifkan
export const load: PageServerLoad = async () => {
	throw error(404, 'Halaman Bank Media dinonaktifkan.');
};

/* --- KODE ASLI DISIMPAN AGAR BISA DIAKTIFKAN KEMBALI DI MASA DEPAN ---
export const loadOriginal: PageServerLoad = async ({ platform, locals }) => {
	const db = getDB(platform);

	// Ambil semua dari uploaded_media untuk sekolah ini secara efisien
	const isSuperAdmin = locals.user?.role === 'superadmin';
	const schoolId = locals.user?.school_id || -1;

	const query = isSuperAdmin
		? `
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
			LEFT JOIN questions q ON u.url = q.media_url OR instr(q.question_text, u.url) > 0 OR instr(q.options_json, u.url) > 0
			LEFT JOIN exams e ON q.exam_id = e.id
			LEFT JOIN subjects s ON e.subject_id = s.id
			LEFT JOIN users usr ON u.uploaded_by = usr.id
			GROUP BY u.id
			ORDER BY u.id DESC
		`
		: `
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
			LEFT JOIN questions q ON u.url = q.media_url OR instr(q.question_text, u.url) > 0 OR instr(q.options_json, u.url) > 0
			LEFT JOIN exams e ON q.exam_id = e.id
			LEFT JOIN subjects s ON e.subject_id = s.id
			LEFT JOIN users usr ON u.uploaded_by = usr.id
			WHERE u.school_id = ?
			GROUP BY u.id
			ORDER BY u.id DESC
		`;

	try {
		const result = isSuperAdmin
			? await db.prepare(query).all()
			: await db.prepare(query).bind(schoolId).all();
		return { mediaItems: result.results || [] };
	} catch (e: any) {
		console.error('Fetch uploaded_media error:', e.message, e);
		return { mediaItems: [] };
	}
};
*/

export const actions: Actions = {
	deleteMedia: async () => fail(403, { error: 'Fitur Bank Media dinonaktifkan.' }),
	toggleVisibility: async () => fail(403, { error: 'Fitur Bank Media dinonaktifkan.' }),
	updateName: async () => fail(403, { error: 'Fitur Bank Media dinonaktifkan.' }),
	deleteBulk: async () => fail(403, { error: 'Fitur Bank Media dinonaktifkan.' }),
	cleanGarbageMedia: async () => fail(403, { error: 'Fitur Bank Media dinonaktifkan.' })
};

/* --- KODE ASLI ACTIONS DISIMPAN AGAR BISA DIAKTIFKAN KEMBALI DI MASA DEPAN ---
export const originalActions: Actions = {
	deleteMedia: async ({ request, platform, locals }) => {
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

		return { success: 'Media berhasil dihapus dari Cloudinary dan Database.', deletedUrls: [mediaUrl] };
	},
	toggleVisibility: async ({ request, platform, locals }) => {
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
	updateName: async ({ request, platform, locals }) => {
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
	},
	deleteBulk: async ({ request, platform, locals }) => {
		const schoolId = locals.user?.school_id || -1;
		const db = getDB(platform);
		const form = await request.formData();
		const urlsStr = form.get('urls')?.toString();

		if (!urlsStr) return fail(400, { error: 'Data tidak valid.' });

		let urls: string[] = [];
		try {
			urls = JSON.parse(urlsStr);
		} catch {
			return fail(400, { error: 'Format data tidak valid.' });
		}

		if (!Array.isArray(urls) || urls.length === 0) {
			return fail(400, { error: 'Tidak ada media yang dipilih.' });
		}

		let successCount = 0;
		const validUrls: string[] = [];

		// 1. Filter out invalid URLs
		const cloudinaryUrls = urls.filter(url => url.includes('res.cloudinary.com'));
		if (cloudinaryUrls.length === 0) return fail(400, { error: 'Tidak ada media Cloudinary yang valid.' });

		// 2. Verify ownership in bulk (for non-superadmin)
		if (locals.user?.role !== 'superadmin') {
			const placeholders = cloudinaryUrls.map(() => '?').join(',');
			const checkQuery = `SELECT url FROM uploaded_media WHERE url IN (${placeholders}) AND school_id = ?`;
			const checks = await db.prepare(checkQuery).bind(...cloudinaryUrls, schoolId).all<{ url: string }>();
			if (checks.results) {
				checks.results.forEach(row => validUrls.push(row.url));
			}
		} else {
			validUrls.push(...cloudinaryUrls);
		}

		if (validUrls.length === 0) {
			return fail(403, { error: 'Tidak ada media valid yang dapat dihapus.' });
		}

		// 3. Delete from Cloudinary in bulk (Admin API, 1 subrequest per 100 images)
		const mergedEnv = { ...env, ...(platform?.env as any) };
		const bulkResult = await deleteCloudinaryResources(validUrls, mergedEnv);
		
		const successfullyDeletedUrls: string[] = [];
		for (const url of validUrls) {
			// If not specifically failed or if totalDeleted > 0, consider deleted
			successfullyDeletedUrls.push(url);
		}

		// 4. Batch delete from DB
		if (successfullyDeletedUrls.length > 0) {
			const batchStatements: any[] = [];
			
			if (locals.user?.role === 'superadmin') {
				const stmt = db.prepare('DELETE FROM uploaded_media WHERE url = ?');
				successfullyDeletedUrls.forEach(url => batchStatements.push(stmt.bind(url)));
			} else {
				const stmt = db.prepare('DELETE FROM uploaded_media WHERE url = ? AND school_id = ?');
				successfullyDeletedUrls.forEach(url => batchStatements.push(stmt.bind(url, schoolId)));
			}
			
			const qStmt = db.prepare('UPDATE questions SET media_url = NULL, media_type = NULL WHERE media_url = ?');
			successfullyDeletedUrls.forEach(url => batchStatements.push(qStmt.bind(url)));
			
			await db.batch(batchStatements);
			successCount = successfullyDeletedUrls.length;
		}

		return { success: `${successCount} media berhasil dihapus secara massal.`, deletedUrls: successfullyDeletedUrls };
	},

	cleanGarbageMedia: async ({ platform, locals }) => {
		const db = getDB(platform);
		const mergedEnv = { ...env, ...(platform?.env as any) };
		const result = await cleanOrphanedMedia(db, mergedEnv, locals.user?.school_id);
		if (result.success) {
			return {
				success:
					result.deletedCount > 0
						? `Berhasil membersihkan ${result.deletedCount} file gambar sampah dari Cloudinary!`
						: 'Tidak ditemukan gambar sampah. Cloudinary Anda sudah bersih dan sinkron!'
			};
		}
		return fail(500, { error: result.errors.join(', ') || 'Gagal membersihkan media sampah dari Cloudinary' });
	}
};
*/
