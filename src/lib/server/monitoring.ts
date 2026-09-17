import type { D1Database } from '@cloudflare/workers-types';
import { uploadToCloudinary, deleteFromCloudinary } from '$lib/server/cloudinary';

let isTableChecked = false;

/**
 * Ensures the exam_monitoring_photos table exists in the database.
 * Supports both SQLite (Cloudflare D1) and PostgreSQL (Neon).
 */
export async function ensureMonitoringPhotosTable(db: any): Promise<void> {
	if (isTableChecked || !db) return;

	try {
		await db.prepare(`
			CREATE TABLE IF NOT EXISTS exam_monitoring_photos (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				school_id INTEGER,
				exam_id INTEGER NOT NULL,
				attempt_id INTEGER,
				student_id INTEGER NOT NULL,
				photo_type TEXT NOT NULL,
				photo_url TEXT NOT NULL,
				caption TEXT,
				created_at TEXT NOT NULL DEFAULT (datetime('now'))
			)
		`).run();

		try {
			await db.prepare(`CREATE INDEX IF NOT EXISTS idx_mon_photos_attempt ON exam_monitoring_photos(attempt_id)`).run();
		} catch {}

		try {
			await db.prepare(`CREATE INDEX IF NOT EXISTS idx_mon_photos_exam_student ON exam_monitoring_photos(exam_id, student_id)`).run();
		} catch {}

		try {
			await db.prepare(`CREATE INDEX IF NOT EXISTS idx_mon_photos_created ON exam_monitoring_photos(created_at DESC)`).run();
		} catch {}

		isTableChecked = true;
	} catch (e: any) {
		// PostgreSQL fallback
		try {
			await db.prepare(`
				CREATE TABLE IF NOT EXISTS exam_monitoring_photos (
					id SERIAL PRIMARY KEY,
					school_id INTEGER,
					exam_id INTEGER NOT NULL,
					attempt_id INTEGER,
					student_id INTEGER NOT NULL,
					photo_type VARCHAR(50) NOT NULL,
					photo_url TEXT NOT NULL,
					caption TEXT,
					created_at TEXT NOT NULL DEFAULT (to_char(NOW(), 'YYYY-MM-DD HH24:MI:SS'))
				)
			`).run();

			try {
				await db.prepare(`CREATE INDEX IF NOT EXISTS idx_mon_photos_attempt ON exam_monitoring_photos(attempt_id)`).run();
			} catch {}

			try {
				await db.prepare(`CREATE INDEX IF NOT EXISTS idx_mon_photos_exam_student ON exam_monitoring_photos(exam_id, student_id)`).run();
			} catch {}

			isTableChecked = true;
		} catch (innerErr) {
			console.warn('ensureMonitoringPhotosTable fallback warning:', innerErr);
		}
	}
}

export interface MonitoringPhotoInput {
	schoolId?: number | null;
	examId: number;
	attemptId?: number | null;
	studentId: number;
	photoType: 'start' | 'violation' | 'finish' | 'inspect';
	photoUrl: string;
	caption?: string | null;
}

export async function saveMonitoringPhoto(
	db: any,
	input: MonitoringPhotoInput,
	env?: any
): Promise<boolean> {
	if (!db || !input.examId || !input.studentId || !input.photoUrl) return false;

	await ensureMonitoringPhotosTable(db);

	let finalPhotoUrl = input.photoUrl;

	// Simpan foto ke Cloudinary secara langsung jika berupa base64
	if (input.photoUrl.startsWith('data:image/')) {
		try {
			const uploadRes = await uploadToCloudinary(input.photoUrl, env, 'ujian_monitoring_photos');
			if (uploadRes.success && uploadRes.url) {
				finalPhotoUrl = uploadRes.url;
			} else {
				console.warn('Upload monitoring photo to Cloudinary skipped or failed:', uploadRes.error);
			}
		} catch (uploadErr) {
			console.warn('Failed to upload monitoring photo to Cloudinary:', uploadErr);
		}
	}

	try {
		await db.prepare(`
			INSERT INTO exam_monitoring_photos (school_id, exam_id, attempt_id, student_id, photo_type, photo_url, caption)
			VALUES (?, ?, ?, ?, ?, ?, ?)
		`).bind(
			input.schoolId || null,
			input.examId,
			input.attemptId || null,
			input.studentId,
			input.photoType,
			finalPhotoUrl,
			input.caption || null
		).run();

		return true;
	} catch (err) {
		console.error('saveMonitoringPhoto error:', err);
		return false;
	}
}

/**
 * Deletes monitoring photos from both Cloudinary and database.
 * Used when student attempt or exam results are reset/deleted.
 */
export async function deleteMonitoringPhotos(
	db: any,
	env: any,
	filter: { attemptId?: number; examId?: number; studentId?: number }
): Promise<number> {
	if (!db) return 0;
	try {
		await ensureMonitoringPhotosTable(db);
		let query = 'SELECT id, photo_url FROM exam_monitoring_photos WHERE 1=1';
		const bindings: any[] = [];
		if (filter.attemptId) {
			query += ' AND attempt_id = ?';
			bindings.push(filter.attemptId);
		}
		if (filter.examId) {
			query += ' AND exam_id = ?';
			bindings.push(filter.examId);
		}
		if (filter.studentId) {
			query += ' AND student_id = ?';
			bindings.push(filter.studentId);
		}

		if (bindings.length === 0) return 0;

		const photosRes = await db.prepare(query).bind(...bindings).all<{ id: number; photo_url: string }>();
		const photos = photosRes.results || [];
		if (photos.length === 0) return 0;

		// Hapus dari Cloudinary jika berupa URL Cloudinary
		for (const p of photos) {
			if (p.photo_url && p.photo_url.includes('res.cloudinary.com')) {
				try {
					await deleteFromCloudinary(p.photo_url, env);
				} catch (delErr) {
					console.warn('Failed to delete photo from Cloudinary:', p.photo_url, delErr);
				}
			}
		}

		// Hapus baris dari tabel database
		let delQuery = 'DELETE FROM exam_monitoring_photos WHERE 1=1';
		const delBindings: any[] = [];
		if (filter.attemptId) {
			delQuery += ' AND attempt_id = ?';
			delBindings.push(filter.attemptId);
		}
		if (filter.examId) {
			delQuery += ' AND exam_id = ?';
			delBindings.push(filter.examId);
		}
		if (filter.studentId) {
			delQuery += ' AND student_id = ?';
			delBindings.push(filter.studentId);
		}

		await db.prepare(delQuery).bind(...delBindings).run();
		return photos.length;
	} catch (e) {
		console.error('deleteMonitoringPhotos error:', e);
		return 0;
	}
}

export async function getMonitoringPhotos(
	db: any,
	filter: { examId?: number; attemptId?: number; studentId?: number; limit?: number }
) {
	if (!db) return [];
	await ensureMonitoringPhotosTable(db);

	try {
		let query = `
			SELECT 
				p.id,
				p.school_id,
				p.exam_id,
				p.attempt_id,
				p.student_id,
				p.photo_type,
				p.photo_url,
				p.caption,
				p.created_at,
				u.name as student_name,
				u.username as student_username
			FROM exam_monitoring_photos p
			JOIN users u ON p.student_id = u.id
			WHERE 1=1
		`;
		const params: any[] = [];

		if (filter.examId) {
			query += ` AND p.exam_id = ?`;
			params.push(filter.examId);
		}
		if (filter.attemptId) {
			query += ` AND p.attempt_id = ?`;
			params.push(filter.attemptId);
		}
		if (filter.studentId) {
			query += ` AND p.student_id = ?`;
			params.push(filter.studentId);
		}

		query += ` ORDER BY p.id ASC`;

		if (filter.limit) {
			query += ` LIMIT ?`;
			params.push(filter.limit);
		}

		const result = await db.prepare(query).bind(...params).all();
		return result.results || [];
	} catch (err) {
		console.error('getMonitoringPhotos error:', err);
		return [];
	}
}
