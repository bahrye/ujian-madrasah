export async function deleteFromCloudinary(url: string | null, env: Record<string, string | undefined> | any): Promise<{success: boolean, error?: string}> {
	if (!url || !url.includes('res.cloudinary.com')) return { success: false, error: 'Bukan URL Cloudinary valid' };

	const cloudName = (env?.PUBLIC_CLOUDINARY_CLOUD_NAME || env?.CLOUDINARY_CLOUD_NAME || process?.env?.PUBLIC_CLOUDINARY_CLOUD_NAME || process?.env?.CLOUDINARY_CLOUD_NAME || 'dfhtjgwcz').trim();
	const apiKey = (env?.CLOUDINARY_API_KEY || process?.env?.CLOUDINARY_API_KEY)?.trim();
	const apiSecret = (env?.CLOUDINARY_API_SECRET || process?.env?.CLOUDINARY_API_SECRET)?.trim();

	if (!apiKey || !apiSecret) {
		console.warn('Cloudinary API credentials missing. Skipping automatic deletion.');
		return { success: false, error: 'API Key atau Secret Cloudinary belum diatur di Environment Variables' };
	}

	try {
		// Clean query params or hash
		const cleanUrl = url.split('?')[0].split('#')[0];

		// Extract public_id correctly handling versions (v123456789) and folders
		const uploadSplit = cleanUrl.split('/upload/');
		if (uploadSplit.length < 2) return { success: false, error: 'Format URL tidak dikenali' };
		
		const afterUpload = uploadSplit[1];
		const segments = afterUpload.split('/');
		const cleanedSegments: string[] = [];
		let versionFound = false;

		for (let i = 0; i < segments.length; i++) {
			const seg = segments[i];
			if (!versionFound) {
				if (/^v\d+$/.test(seg)) {
					versionFound = true;
					continue;
				}
				// Known Cloudinary transformation patterns: e.g. c_scale, w_100, or multiple comma-separated
				if (seg.includes(',') || /^(?:[a-z]{1,2}_|fl_|pg_|fps_)[a-zA-Z0-9_,:]+$/i.test(seg)) {
					continue;
				}
			}
			cleanedSegments.push(seg);
		}

		const cleanPath = cleanedSegments.length > 0 ? cleanedSegments.join('/') : afterUpload.replace(/^v\d+\//, '');
		const lastDotIndex = cleanPath.lastIndexOf('.');
		const publicId = lastDotIndex !== -1 ? cleanPath.substring(0, lastDotIndex) : cleanPath;

		// Cloudinary treats audio files as 'video' resource type for their API
		const defaultResourceType = url.includes('/video/') ? 'video' : url.includes('/raw/') ? 'raw' : 'image';

		// Helper function to call Cloudinary destroy API with SHA-1 signature and invalidate: true
		async function callDestroy(pid: string, resType: string): Promise<any> {
			const timestamp = Math.round(new Date().getTime() / 1000).toString();
			// Signature parameters must be in alphabetical order: invalidate, public_id, timestamp
			const strToSign = `invalidate=true&public_id=${pid}&timestamp=${timestamp}${apiSecret}`;

			const encoder = new TextEncoder();
			const data = encoder.encode(strToSign);
			const hashBuffer = await crypto.subtle.digest('SHA-1', data);
			const hashArray = Array.from(new Uint8Array(hashBuffer));
			const signature = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

			const formData = new FormData();
			formData.append('public_id', pid);
			formData.append('api_key', apiKey);
			formData.append('timestamp', timestamp);
			formData.append('signature', signature);
			formData.append('invalidate', 'true');

			const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resType}/destroy`, {
				method: 'POST',
				body: formData
			});
			return await res.json();
		}

		// Attempt 1: publicId without extension
		let result = await callDestroy(publicId, defaultResourceType);
		console.log('Cloudinary Destroy Attempt 1 (without ext):', publicId, defaultResourceType, result);

		// If not found and cleanPath has an extension, Attempt 2: with extension
		if (result?.result === 'not found' && cleanPath !== publicId) {
			result = await callDestroy(cleanPath, defaultResourceType);
			console.log('Cloudinary Destroy Attempt 2 (with ext):', cleanPath, defaultResourceType, result);
		}

		// If still not found and default was 'image', Attempt 3: raw resource type
		if (result?.result === 'not found' && defaultResourceType === 'image') {
			result = await callDestroy(cleanPath, 'raw');
			console.log('Cloudinary Destroy Attempt 3 (raw):', cleanPath, result);
		}

		if (result?.result === 'ok' || result?.result === 'not found') {
			return { success: true };
		} else {
			return { success: false, error: result?.error?.message || result?.result || 'Unknown error' };
		}
	} catch (err: any) {
		console.error('Failed to delete from Cloudinary:', err);
		return { success: false, error: err.message || 'Kesalahan koneksi ke Cloudinary API' };
	}
}

/**
 * Ekstrak semua URL Cloudinary dari teks/HTML/JSON apa pun (seperti question_text atau options_json)
 */
export function extractCloudinaryUrls(text: string | null | undefined): string[] {
	if (!text) return [];
	// Decode escaped characters dan HTML entities yang umum di JSON/HTML
	const normalized = text
		.replace(/\\\//g, '/')
		.replace(/\\"/g, '"')
		.replace(/\\'/g, "'")
		.replace(/&quot;/g, '"')
		.replace(/&amp;/g, '&')
		.replace(/&#39;/g, "'");

	const matches = normalized.match(/https:\/\/res\.cloudinary\.com\/[^\s"'<>\)\]\}\\\^]+/g);
	if (!matches) return [];

	const results = new Set<string>();
	for (let u of matches) {
		u = u.replace(/[,;.)\\"'&]+$/, '').trim();
		if (u.includes('res.cloudinary.com')) {
			results.add(u);
		}
	}
	return Array.from(results);
}

/**
 * Ekstrak publicId, cleanPath, dan resourceType dari URL Cloudinary atau string publicId
 */
export function extractPublicIdAndResourceType(urlOrId: string | null | undefined): {
	publicId: string;
	cleanPath: string;
	resourceType: 'image' | 'video' | 'raw';
} | null {
	if (!urlOrId || typeof urlOrId !== 'string') return null;
	const trimmed = urlOrId.trim();
	if (!trimmed) return null;

	const resourceType: 'image' | 'video' | 'raw' = trimmed.includes('/video/')
		? 'video'
		: trimmed.includes('/raw/')
		? 'raw'
		: 'image';

	if (!trimmed.includes('res.cloudinary.com')) {
		const clean = trimmed.split('?')[0].split('#')[0];
		const lastDot = clean.lastIndexOf('.');
		const pid = resourceType === 'raw' ? clean : lastDot !== -1 ? clean.substring(0, lastDot) : clean;
		return { publicId: pid, cleanPath: clean, resourceType };
	}

	const cleanUrl = trimmed.split('?')[0].split('#')[0];
	const uploadSplit = cleanUrl.split('/upload/');
	if (uploadSplit.length < 2) return null;

	const afterUpload = uploadSplit[1];
	const segments = afterUpload.split('/');
	const cleanedSegments: string[] = [];
	let versionFound = false;

	for (let i = 0; i < segments.length; i++) {
		const seg = segments[i];
		if (!versionFound) {
			if (/^v\d+$/.test(seg)) {
				versionFound = true;
				continue;
			}
			if (seg.includes(',') || /^(?:[a-z]{1,2}_|fl_|pg_|fps_)[a-zA-Z0-9_,:]+$/i.test(seg)) {
				continue;
			}
		}
		cleanedSegments.push(seg);
	}

	const cleanPath = cleanedSegments.length > 0 ? cleanedSegments.join('/') : afterUpload.replace(/^v\d+\//, '');
	const lastDotIndex = cleanPath.lastIndexOf('.');
	const publicId = resourceType === 'raw' || lastDotIndex === -1 ? cleanPath : cleanPath.substring(0, lastDotIndex);

	return { publicId, cleanPath, resourceType };
}

/**
 * Hapus beberapa resources di Cloudinary secara massal via Admin API (hingga 100 ID per HTTP subrequest)
 */
export async function deleteCloudinaryResources(
	items: (string | null | undefined)[],
	env: Record<string, string | undefined> | any
): Promise<{ success: boolean; deletedCount: number; deleted: Record<string, string>; errors: string[] }> {
	const cloudName = (
		env?.PUBLIC_CLOUDINARY_CLOUD_NAME ||
		env?.CLOUDINARY_CLOUD_NAME ||
		process?.env?.PUBLIC_CLOUDINARY_CLOUD_NAME ||
		process?.env?.CLOUDINARY_CLOUD_NAME ||
		'dfhtjgwcz'
	).trim();
	const apiKey = (env?.CLOUDINARY_API_KEY || process?.env?.CLOUDINARY_API_KEY)?.trim();
	const apiSecret = (env?.CLOUDINARY_API_SECRET || process?.env?.CLOUDINARY_API_SECRET)?.trim();

	if (!apiKey || !apiSecret) {
		console.warn('Kredensial Cloudinary belum lengkap untuk bulk deletion');
		return { success: false, deletedCount: 0, deleted: {}, errors: ['Kredensial Cloudinary belum diatur'] };
	}

	const basicAuth =
		typeof btoa === 'function'
			? btoa(`${apiKey}:${apiSecret}`)
			: Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

	const groups: Record<'image' | 'video' | 'raw', Set<string>> = {
		image: new Set(),
		video: new Set(),
		raw: new Set()
	};

	for (const item of items) {
		if (!item) continue;
		const parsed = extractPublicIdAndResourceType(item);
		if (parsed && parsed.publicId) {
			groups[parsed.resourceType].add(parsed.publicId);
		}
	}

	let totalDeleted = 0;
	const deletedMap: Record<string, string> = {};
	const errors: string[] = [];

	for (const resType of ['image', 'video', 'raw'] as const) {
		const idList = Array.from(groups[resType]);
		if (idList.length === 0) continue;

		// Cloudinary Admin API menerima hingga 100 public_ids per request
		const chunkSize = 100;
		for (let i = 0; i < idList.length; i += chunkSize) {
			const chunk = idList.slice(i, i + chunkSize);
			try {
				const bodyParams = new URLSearchParams();
				for (const pid of chunk) {
					bodyParams.append('public_ids[]', pid);
				}
				bodyParams.append('invalidate', 'true');

				const res = await fetch(
					`https://api.cloudinary.com/v1_1/${cloudName}/resources/${resType}/upload`,
					{
						method: 'DELETE',
						headers: {
							Authorization: `Basic ${basicAuth}`,
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						body: bodyParams.toString()
					}
				);

				if (res.ok) {
					const data = (await res.json()) as any;
					if (data && data.deleted) {
						for (const [k, v] of Object.entries(data.deleted)) {
							deletedMap[k] = v as string;
							if (v === 'deleted') {
								totalDeleted++;
							}
						}
					}
				} else {
					const errText = await res.text();
					console.error(`Admin API delete_resources error (${resType}):`, res.status, errText);
					errors.push(`Admin API status ${res.status}: ${errText}`);
					// Fallback jika Admin API dibatasi permission, hapus via Upload API destroy
					for (const pid of chunk) {
						try {
							const fallback = await deleteFromCloudinary(pid, env);
							if (fallback.success) {
								deletedMap[pid] = 'deleted';
								totalDeleted++;
							}
						} catch (fbErr: any) {
							console.error('Fallback delete error for:', pid, fbErr);
						}
					}
				}
			} catch (err: any) {
				console.error(`Error deleting chunk for ${resType}:`, err);
				errors.push(err.message || 'Koneksi gagal saat bulk delete Cloudinary');
			}
		}
	}

	return {
		success: errors.length === 0 || totalDeleted > 0,
		deletedCount: totalDeleted,
		deleted: deletedMap,
		errors
	};
}

/**
 * Hapus daftar URL Cloudinary secara massal via Admin API dan bersihkan dari tabel uploaded_media
 */
export async function deleteCloudinaryMediaList(
	urls: (string | null | undefined)[],
	env: any,
	db?: any,
	schoolId?: number | null
): Promise<void> {
	const validUrls = Array.from(
		new Set(
			urls
				.filter((u): u is string => !!u && typeof u === 'string' && u.includes('res.cloudinary.com'))
				.map((u) => u.trim())
		)
	);

	if (validUrls.length === 0) return;

	// Hapus media dari Cloudinary secara massal (1 subrequest per 100 gambar)
	await deleteCloudinaryResources(validUrls, env).catch((err) => {
		console.error('Gagal menghapus resources Cloudinary secara massal:', err);
	});

	// Bersihkan juga dari pelacakan uploaded_media di DB
	if (db) {
		try {
			const chunkSize = 50;
			for (let i = 0; i < validUrls.length; i += chunkSize) {
				const chunk = validUrls.slice(i, i + chunkSize);
				const placeholders = chunk.map(() => '?').join(',');
				if (schoolId) {
					await db
						.prepare(`DELETE FROM uploaded_media WHERE url IN (${placeholders}) AND school_id = ?`)
						.bind(...chunk, schoolId)
						.run();
				} else {
					await db
						.prepare(`DELETE FROM uploaded_media WHERE url IN (${placeholders})`)
						.bind(...chunk)
						.run();
				}
			}
		} catch (err) {
			console.error('Gagal membersihkan uploaded_media:', err);
		}
	}
}

/**
 * Pindai dan hapus file sampah (orphan) di Cloudinary yang tidak lagi digunakan oleh soal atau ujian mana pun
 */
export async function cleanOrphanedMedia(
	db: any,
	env: Record<string, string | undefined> | any,
	schoolId?: number | null
): Promise<{ success: boolean; deletedCount: number; errors: string[] }> {
	const cloudName = (
		env?.PUBLIC_CLOUDINARY_CLOUD_NAME ||
		env?.CLOUDINARY_CLOUD_NAME ||
		process?.env?.PUBLIC_CLOUDINARY_CLOUD_NAME ||
		process?.env?.CLOUDINARY_CLOUD_NAME ||
		'dfhtjgwcz'
	).trim();
	const apiKey = (env?.CLOUDINARY_API_KEY || process?.env?.CLOUDINARY_API_KEY)?.trim();
	const apiSecret = (env?.CLOUDINARY_API_SECRET || process?.env?.CLOUDINARY_API_SECRET)?.trim();

	if (!apiKey || !apiSecret) {
		return { success: false, deletedCount: 0, errors: ['Kredensial Cloudinary belum diatur'] };
	}

	const basicAuth =
		typeof btoa === 'function'
			? btoa(`${apiKey}:${apiSecret}`)
			: Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

	try {
		// 1. Kumpulkan semua URL dan public_id aktif dari seluruh soal & deskripsi ujian
		const activePublicIds = new Set<string>();

		// Dari pertanyaan (questions)
		try {
			const qRows = await db
				.prepare('SELECT media_url, question_text, options_json, correct_answer_json FROM questions')
				.all<{
					media_url?: string;
					question_text?: string;
					options_json?: string;
					correct_answer_json?: string;
				}>();

			for (const row of qRows.results || []) {
				if (row.media_url) {
					const info = extractPublicIdAndResourceType(row.media_url);
					if (info) {
						activePublicIds.add(info.publicId);
						activePublicIds.add(info.cleanPath);
					}
				}
				const textBlock = `${row.question_text || ''} ${row.options_json || ''} ${row.correct_answer_json || ''}`;
				const extracted = extractCloudinaryUrls(textBlock);
				for (const u of extracted) {
					const info = extractPublicIdAndResourceType(u);
					if (info) {
						activePublicIds.add(info.publicId);
						activePublicIds.add(info.cleanPath);
					}
				}
			}
		} catch (err) {
			console.error('Error fetching questions for active media:', err);
		}

		// Dari ujian (exams description)
		try {
			const examRows = await db.prepare('SELECT description FROM exams').all<{ description?: string }>();
			for (const row of examRows.results || []) {
				if (row.description) {
					const extracted = extractCloudinaryUrls(row.description);
					for (const u of extracted) {
						const info = extractPublicIdAndResourceType(u);
						if (info) {
							activePublicIds.add(info.publicId);
							activePublicIds.add(info.cleanPath);
						}
					}
				}
			}
		} catch {}

		// Dari schools (logo_url, banner_url)
		try {
			const schoolRows = await db
				.prepare('SELECT logo_url, banner_url FROM schools')
				.all<{ logo_url?: string; banner_url?: string }>();
			for (const row of schoolRows.results || []) {
				if (row.logo_url) {
					const info = extractPublicIdAndResourceType(row.logo_url);
					if (info) activePublicIds.add(info.publicId);
				}
				if (row.banner_url) {
					const info = extractPublicIdAndResourceType(row.banner_url);
					if (info) activePublicIds.add(info.publicId);
				}
			}
		} catch {}

		// Dari uploaded_media yang ditandai is_public = 1 (disimpan permanen di bank media)
		try {
			const publicMedia = await db
				.prepare('SELECT url FROM uploaded_media WHERE is_public = 1')
				.all<{ url?: string }>();
			for (const row of publicMedia.results || []) {
				if (row.url) {
					const info = extractPublicIdAndResourceType(row.url);
					if (info) activePublicIds.add(info.publicId);
				}
			}
		} catch {}

		// 2. Kumpulkan kandidat public_id
		const candidatePublicIds = new Set<string>();

		// Sumber A: Daftar file dari Cloudinary Admin API untuk folder 'ujian-madrasah/media'
		try {
			let nextCursor: string | null = null;
			let pages = 0;
			do {
				const cursorParam = nextCursor ? `&next_cursor=${encodeURIComponent(nextCursor)}` : '';
				const listRes = await fetch(
					`https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload?prefix=ujian-madrasah/media&max_results=500${cursorParam}`,
					{
						headers: {
							Authorization: `Basic ${basicAuth}`
						}
					}
				);
				if (listRes.ok) {
					const data = (await listRes.json()) as any;
					if (data.resources && Array.isArray(data.resources)) {
						for (const resItem of data.resources) {
							if (resItem.public_id) {
								candidatePublicIds.add(resItem.public_id);
							}
						}
					}
					nextCursor = data.next_cursor || null;
				} else {
					console.warn('Gagal mengambil daftar resources dari Cloudinary:', listRes.status);
					break;
				}
				pages++;
			} while (nextCursor && pages < 3);
		} catch (err) {
			console.error('Error listing Cloudinary folder:', err);
		}

		// Sumber B: Dari tabel uploaded_media (yang is_public = 0 atau umum)
		try {
			const trackedQuery = schoolId
				? 'SELECT url FROM uploaded_media WHERE school_id = ? AND (is_public = 0 OR is_public IS NULL)'
				: 'SELECT url FROM uploaded_media WHERE is_public = 0 OR is_public IS NULL';
			const trackedRows = schoolId
				? await db.prepare(trackedQuery).bind(schoolId).all<{ url?: string }>()
				: await db.prepare(trackedQuery).all<{ url?: string }>();

			for (const row of trackedRows.results || []) {
				if (row.url) {
					const info = extractPublicIdAndResourceType(row.url);
					if (info) {
						candidatePublicIds.add(info.publicId);
					}
				}
			}
		} catch {}

		// 3. Filter file yang tidak aktif (orphan/sampah)
		const orphanedPublicIds: string[] = [];
		for (const pid of candidatePublicIds) {
			// Periksa apakah ID atau variasinya dengan ekstensi ada di activePublicIds
			if (
				!activePublicIds.has(pid) &&
				!activePublicIds.has(`${pid}.webp`) &&
				!activePublicIds.has(`${pid}.png`) &&
				!activePublicIds.has(`${pid}.jpg`) &&
				!activePublicIds.has(`${pid}.jpeg`)
			) {
				orphanedPublicIds.push(pid);
			}
		}

		if (orphanedPublicIds.length === 0) {
			return { success: true, deletedCount: 0, errors: [] };
		}

		// 4. Hapus sampah massal dari Cloudinary (menggunakan 1 subrequest per 100 file)
		const delResult = await deleteCloudinaryResources(orphanedPublicIds, env);

		// 5. Bersihkan entri orphan dari uploaded_media di DB
		try {
			for (const pid of orphanedPublicIds) {
				await db.prepare('DELETE FROM uploaded_media WHERE url LIKE ?').bind(`%${pid}%`).run();
			}
		} catch (dbErr) {
			console.error('Error cleaning orphaned uploaded_media:', dbErr);
		}

		return {
			success: delResult.success,
			deletedCount: delResult.deletedCount || orphanedPublicIds.length,
			errors: delResult.errors
		};
	} catch (err: any) {
		console.error('Error in cleanOrphanedMedia:', err);
		return { success: false, deletedCount: 0, errors: [err.message || 'Gagal membersihkan media sampah'] };
	}
}

/**
 * Hapus semua gambar Cloudinary milik soal-soal tertentu berdasarkan ID soal
 */
export async function deleteMediaForQuestionIds(
	db: any,
	env: any,
	questionIds: number[],
	schoolId?: number | null
): Promise<void> {
	if (!questionIds || questionIds.length === 0) return;

	try {
		const safeIds = questionIds.map((id) => Number(id)).filter((id) => !isNaN(id) && id > 0);
		if (safeIds.length === 0) return;

		const urlsToDelete = new Set<string>();

		// Chunk ID untuk mencegah limit parameter SQL
		const chunkSize = 100;
		for (let i = 0; i < safeIds.length; i += chunkSize) {
			const chunk = safeIds.slice(i, i + chunkSize);
			const placeholders = chunk.map(() => '?').join(',');
			const rows = await db
				.prepare(
					`SELECT media_url, question_text, options_json, correct_answer_json FROM questions WHERE id IN (${placeholders})`
				)
				.bind(...chunk)
				.all<{
					media_url?: string;
					question_text?: string;
					options_json?: string;
					correct_answer_json?: string;
				}>();

			for (const row of rows.results || []) {
				if (row.media_url && row.media_url.includes('res.cloudinary.com')) {
					urlsToDelete.add(row.media_url.trim());
				}
				const textBlock = `${row.question_text || ''} ${row.options_json || ''} ${row.correct_answer_json || ''}`;
				const extracted = extractCloudinaryUrls(textBlock);
				for (const u of extracted) {
					urlsToDelete.add(u);
				}
			}
		}

		await deleteCloudinaryMediaList(Array.from(urlsToDelete), env, db, schoolId);
	} catch (err) {
		console.error('Error deleteMediaForQuestionIds:', err);
	}
}

/**
 * Hapus semua gambar Cloudinary milik seluruh soal dalam satu ujian
 */
export async function deleteMediaForExam(
	db: any,
	env: any,
	examId: number,
	schoolId?: number | null
): Promise<void> {
	try {
		const rows = await db
			.prepare(
				`SELECT media_url, question_text, options_json, correct_answer_json FROM questions WHERE exam_id = ?`
			)
			.bind(examId)
			.all<{
				media_url?: string;
				question_text?: string;
				options_json?: string;
				correct_answer_json?: string;
			}>();

		const urlsToDelete = new Set<string>();

		for (const row of rows.results || []) {
			if (row.media_url && row.media_url.includes('res.cloudinary.com')) {
				urlsToDelete.add(row.media_url.trim());
			}
			const textBlock = `${row.question_text || ''} ${row.options_json || ''} ${row.correct_answer_json || ''}`;
			const extracted = extractCloudinaryUrls(textBlock);
			for (const u of extracted) {
				urlsToDelete.add(u);
			}
		}

		// Periksa juga deskripsi ujian jika ada gambar
		try {
			const examRow = await db
				.prepare('SELECT description FROM exams WHERE id = ?')
				.bind(examId)
				.first<{ description?: string }>();
			if (examRow?.description) {
				const descUrls = extractCloudinaryUrls(examRow.description);
				for (const u of descUrls) {
					urlsToDelete.add(u);
				}
			}
		} catch {}

		await deleteCloudinaryMediaList(Array.from(urlsToDelete), env, db, schoolId);
	} catch (err) {
		console.error('Error deleteMediaForExam:', err);
	}
}

export async function uploadToCloudinary(
	base64Image: string, 
	env: Record<string, string | undefined> | any,
	folder: string = 'ujian_signatures'
): Promise<{success: boolean, url?: string, error?: string}> {
	const cloudName = (env?.PUBLIC_CLOUDINARY_CLOUD_NAME || env?.CLOUDINARY_CLOUD_NAME || process?.env?.PUBLIC_CLOUDINARY_CLOUD_NAME || process?.env?.CLOUDINARY_CLOUD_NAME || 'dfhtjgwcz').trim();
	const apiKey = (env?.CLOUDINARY_API_KEY || process?.env?.CLOUDINARY_API_KEY)?.trim();
	const apiSecret = (env?.CLOUDINARY_API_SECRET || process?.env?.CLOUDINARY_API_SECRET)?.trim();

	if (!cloudName || !apiKey || !apiSecret) {
		const missing = [];
		if (!cloudName) missing.push('CLOUD_NAME');
		if (!apiKey) missing.push('API_KEY');
		if (!apiSecret) missing.push('API_SECRET');
		return { success: false, error: `Kredensial Cloudinary belum lengkap: ${missing.join(', ')}` };
	}

	try {
		const timestamp = Math.round(new Date().getTime() / 1000).toString();
		const targetFolder = folder || 'ujian_signatures';
		
		const strToSign = `folder=${targetFolder}&timestamp=${timestamp}${apiSecret}`;
		const encoder = new TextEncoder();
		const data = encoder.encode(strToSign);
		const hashBuffer = await crypto.subtle.digest('SHA-1', data);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

		const formData = new FormData();
		formData.append('file', base64Image);
		formData.append('api_key', apiKey);
		formData.append('timestamp', timestamp);
		formData.append('signature', signature);
		formData.append('folder', targetFolder);

		const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
			method: 'POST',
			body: formData
		});

		const result = await res.json() as any;
		if (result.secure_url) {
			return { success: true, url: result.secure_url };
		} else {
			return { success: false, error: result.error?.message || 'Upload failed' };
		}
	} catch (e: any) {
		return { success: false, error: e.message };
	}
}
