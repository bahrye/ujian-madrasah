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
 * Hapus daftar URL Cloudinary secara paralel dan bersihkan dari tabel uploaded_media
 */
export async function deleteCloudinaryMediaList(
	urls: (string | null | undefined)[],
	env: any,
	db?: any,
	schoolId?: number
): Promise<void> {
	const validUrls = Array.from(
		new Set(
			urls
				.filter((u): u is string => !!u && typeof u === 'string' && u.includes('res.cloudinary.com'))
				.map((u) => u.trim())
		)
	);

	if (validUrls.length === 0) return;

	// Hapus media dari Cloudinary secara paralel tanpa blocking error fatal
	await Promise.allSettled(
		validUrls.map((url) =>
			deleteFromCloudinary(url, env).catch((err) => {
				console.error('Gagal menghapus media dari Cloudinary:', url, err);
			})
		)
	);

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
 * Hapus semua gambar Cloudinary milik soal-soal tertentu berdasarkan ID soal
 */
export async function deleteMediaForQuestionIds(
	db: any,
	env: any,
	questionIds: number[],
	schoolId?: number
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
	schoolId?: number
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
