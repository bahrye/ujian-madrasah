import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { hashPassword } from '$lib/server/auth';
import { deleteFromCloudinary } from '$lib/server/cloudinary';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async ({ locals, url, platform }) => {
	if (!locals.user) throw redirect(302, '/login');
	const db = getDB(platform);
	const search = url.searchParams.get('search') || '';
	const classFilter = url.searchParams.get('class') || '';

	let query = `
		SELECT u.id, u.username, u.name, u.is_active, u.created_at, u.class_id, c.name as class_name, u.place_of_birth, u.date_of_birth, u.photo 
		FROM users u 
		LEFT JOIN classes c ON u.class_id = c.id 
		WHERE u.school_id = ? AND u.role = 'siswa'
	`;
	const params: unknown[] = [locals.user.school_id];

	if (search) {
		query += ' AND (u.username LIKE ? OR u.name LIKE ?)';
		params.push(`%${search}%`, `%${search}%`);
	}
	if (classFilter) {
		query += ' AND u.class_id = ?';
		params.push(classFilter);
	}

	query += ' ORDER BY c.name ASC, u.name ASC LIMIT 500';

	try {
		const [usersResult, classesResult, school] = await Promise.all([
			db.prepare(query).bind(...params).all(),
			db.prepare('SELECT id, name FROM classes WHERE school_id = ? ORDER BY name ASC').bind(locals.user.school_id).all(),
			db.prepare('SELECT name, logo_url FROM schools WHERE id = ?').bind(locals.user.school_id).first()
		]);

		return { 
			users: usersResult.results || [],
			classes: classesResult.results || [],
			schoolName: (school as any)?.name || '',
			schoolLogo: (school as any)?.logo_url || ''
		};
	} catch (err: any) {
		console.error('Error loading students:', err);
		return { 
			users: [],
			classes: [],
			schoolName: '',
			schoolLogo: ''
		};
	}
};

export const actions: Actions = {
	add: async ({ request, locals, platform }) => {
		if (!locals.user) return fail(401, { error: 'Unauthorized' });
		const db = getDB(platform);
		const data = await request.formData();
		const name = data.get('name')?.toString().trim();
		const nisn = data.get('nisn')?.toString().trim();
		const class_id = data.get('class_id')?.toString() || null;
		const place_of_birth = data.get('place_of_birth')?.toString().trim() || null;
		const date_of_birth = data.get('date_of_birth')?.toString() || null;

		if (!name || !nisn) {
			return fail(400, { error: 'Nama dan NISN wajib diisi' });
		}

		try {
			// Cek username (NISN)
			const existing = await db.prepare('SELECT id FROM users WHERE username = ?').bind(nisn).first();
			if (existing) {
				return fail(400, { error: 'NISN sudah terdaftar' });
			}

			// NISN menjadi username dan password
			const passwordHash = await hashPassword(nisn);
			
			await db.prepare('INSERT INTO users (school_id, class_id, username, password_hash, name, role, place_of_birth, date_of_birth) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
				.bind(locals.user.school_id, class_id, nisn, passwordHash, name, 'siswa', place_of_birth, date_of_birth)
				.run();
			
			return { success: true };
		} catch (e: any) {
			console.error(e);
			return fail(500, { error: e.message || 'Gagal menambahkan siswa' });
		}
	},
	edit: async ({ request, locals, platform }) => {
		if (!locals.user) return fail(401, { error: 'Unauthorized' });
		const db = getDB(platform);
		const data = await request.formData();
		const idStr = data.get('id')?.toString();
		const name = data.get('name')?.toString().trim();
		const nisn = data.get('nisn')?.toString().trim();
		const class_id = data.get('class_id')?.toString() || null;
		const place_of_birth = data.get('place_of_birth')?.toString().trim() || null;
		const date_of_birth = data.get('date_of_birth')?.toString() || null;
		const parsedId = parseInt(idStr || '', 10);

		if (isNaN(parsedId) || !name || !nisn) {
			return fail(400, { error: 'ID, Nama dan NISN wajib diisi' });
		}

		try {
			// Cek username lain
			const existing = await db.prepare('SELECT id FROM users WHERE username = ? AND id != ?').bind(nisn, parsedId).first();
			if (existing) {
				return fail(400, { error: 'NISN sudah digunakan siswa lain' });
			}

			// Update NISN (sebagai username) dan update password agar sesuai NISN baru
			const passwordHash = await hashPassword(nisn);
			
			await db.prepare('UPDATE users SET name = ?, username = ?, password_hash = ?, class_id = ?, place_of_birth = ?, date_of_birth = ?, updated_at = datetime("now") WHERE id = ? AND school_id = ?')
				.bind(name, nisn, passwordHash, class_id, place_of_birth, date_of_birth, parsedId, locals.user.school_id)
				.run();
			
			return { success: true };
		} catch (e: any) {
			console.error(e);
			return fail(500, { error: e.message || 'Gagal mengupdate siswa' });
		}
	},
	delete: async ({ request, locals, platform }) => {
		if (!locals.user) return fail(401, { error: 'Unauthorized' });
		const db = getDB(platform);
		const data = await request.formData();
		const idStr = data.get('id')?.toString();
		const parsedId = parseInt(idStr || '', 10);

		if (isNaN(parsedId)) return fail(400, { error: 'ID tidak valid' });

		try {
			await db.batch([
				db.prepare('DELETE FROM student_answers WHERE attempt_id IN (SELECT id FROM student_attempts WHERE student_id = ?)').bind(parsedId),
				db.prepare('DELETE FROM student_attempts WHERE student_id = ?').bind(parsedId),
				db.prepare('DELETE FROM exam_participants WHERE student_id = ?').bind(parsedId),
				db.prepare('DELETE FROM exam_type_participants WHERE student_id = ?').bind(parsedId),
				db.prepare('DELETE FROM users WHERE id = ? AND school_id = ? AND role = "siswa"').bind(parsedId, locals.user.school_id)
			]);
			return { success: true, message: 'Berhasil menghapus data siswa.' };
		} catch (e: any) {
			console.error('Delete student error:', e);
			return fail(500, { error: e.message || 'Gagal menghapus siswa' });
		}
	},
	deleteBulk: async ({ request, locals, platform }) => {
		if (!locals.user) return fail(401, { error: 'Unauthorized' });
		const db = getDB(platform);
		const data = await request.formData();
		const idsJson = data.get('ids')?.toString();

		if (!idsJson) return fail(400, { error: 'Pilih minimal satu siswa.' });

		try {
			const ids = JSON.parse(idsJson) as number[];
			if (!Array.isArray(ids) || ids.length === 0) {
				return fail(400, { error: 'Pilih minimal satu siswa.' });
			}

			const stmts = [];
			for (const id of ids) {
				stmts.push(
					db.prepare('DELETE FROM student_answers WHERE attempt_id IN (SELECT id FROM student_attempts WHERE student_id = ?)').bind(id),
					db.prepare('DELETE FROM student_attempts WHERE student_id = ?').bind(id),
					db.prepare('DELETE FROM exam_participants WHERE student_id = ?').bind(id),
					db.prepare('DELETE FROM exam_type_participants WHERE student_id = ?').bind(id),
					db.prepare('DELETE FROM users WHERE id = ? AND school_id = ? AND role = "siswa"').bind(id, locals.user.school_id)
				);
			}

			if (stmts.length > 0) {
				await db.batch(stmts);
			}

			return { success: true, message: `Berhasil menghapus ${ids.length} siswa terpilih.` };
		} catch (e: any) {
			console.error('Delete bulk students error:', e);
			return fail(500, { error: e.message || 'Gagal menghapus siswa terpilih' });
		}
	},
	importExcel: async ({ request, locals, platform }) => {
		if (!locals.user) return fail(401, { error: 'Unauthorized' });
		const db = getDB(platform);
		const data = await request.formData();
		const studentsJson = data.get('students_json')?.toString();

		if (!studentsJson) {
			return fail(400, { error: 'Data tidak valid' });
		}

		try {
			const students = JSON.parse(studentsJson) as any[];
			if (students.length === 0) return fail(400, { error: 'Tidak ada data siswa' });

			// Ambil semua username yang sudah ada untuk validasi cepat
			const existingUsersResult = await db.prepare('SELECT username FROM users').all<{ username: string }>();
			const existingUsernames = new Set(existingUsersResult.results.map(u => u.username.toLowerCase()));

			const stmts = [];
			let skippedCount = 0;

			for (const student of students) {
				const nisn = String(student.nisn || '').trim();
				const name = String(student.name || '').trim();
				if (!nisn || !name) continue;

				if (existingUsernames.has(nisn.toLowerCase())) {
					skippedCount++;
					continue;
				}

				existingUsernames.add(nisn.toLowerCase());
				const passwordHash = await hashPassword(nisn);
				stmts.push(
					db.prepare('INSERT INTO users (school_id, class_id, username, password_hash, name, role, place_of_birth, date_of_birth) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
						.bind(locals.user.school_id, student.class_id || null, nisn, passwordHash, name, 'siswa', student.place_of_birth || null, student.date_of_birth || null)
				);
			}

			if (stmts.length > 0) {
				// Jalankan dalam batch untuk performa maksimal di Cloudflare D1
				const chunkSize = 50;
				for (let i = 0; i < stmts.length; i += chunkSize) {
					await db.batch(stmts.slice(i, i + chunkSize));
				}
			}

			const successCount = stmts.length;
			let msg = `Berhasil mengimpor ${successCount} siswa.`;
			if (skippedCount > 0) {
				msg += ` (${skippedCount} data dilewati karena NISN sudah terdaftar).`;
			}

			return { success: true, message: msg };
		} catch (e: any) {
			console.error('Import error:', e);
			return fail(500, { error: e.message || 'Terjadi kesalahan saat memproses data import' });
		}
	},
	toggleStatus: async ({ request, platform, locals }) => {
		if (!locals.user) return fail(401, { error: 'Unauthorized' });
		const db = getDB(platform);
		const data = await request.formData();
		const idStr = data.get('id')?.toString();
		const currentStatus = data.get('is_active')?.toString();
		const parsedId = parseInt(idStr || '', 10);

		if (isNaN(parsedId) || !currentStatus) return fail(400, { error: 'Data tidak valid' });

		const newStatus = currentStatus === '1' ? 0 : 1;

		try {
			await db.prepare('UPDATE users SET is_active = ?, updated_at = datetime("now") WHERE id = ? AND school_id = ? AND role = "siswa"')
				.bind(newStatus, parsedId, locals.user.school_id)
				.run();
			
			return { success: true };
		} catch (e: any) {
			console.error(e);
			return fail(500, { error: e.message || 'Gagal merubah status' });
		}
	},
	updatePhoto: async ({ request, platform, locals }) => {
		if (!locals.user) return fail(401, { error: 'Unauthorized' });
		const db = getDB(platform);
		const data = await request.formData();
		const idStr = data.get('id')?.toString();
		const photo = data.get('photo')?.toString() || null;
		const parsedId = parseInt(idStr || '', 10);

		if (isNaN(parsedId)) return fail(400, { error: 'ID tidak valid' });

		try {
			// Cek apakah siswa sudah punya foto lama
			const oldUser = await db.prepare('SELECT photo FROM users WHERE id = ? AND school_id = ? AND role = "siswa"')
				.bind(parsedId, locals.user.school_id)
				.first();

			const oldPhoto = (oldUser as any)?.photo;

			// Hapus foto lama dari Cloudinary jika ada dan berbeda dengan foto baru
			if (oldPhoto && oldPhoto.includes('res.cloudinary.com') && oldPhoto !== photo) {
				try {
					await deleteFromCloudinary(oldPhoto, env);
					// Hapus dari uploaded_media agar sinkron
					await db.prepare('DELETE FROM uploaded_media WHERE url = ? AND school_id = ?')
						.bind(oldPhoto, locals.user.school_id)
						.run();
				} catch (err) {
					console.error('Failed to delete old photo from Cloudinary:', err);
				}
			}

			await db.prepare('UPDATE users SET photo = ?, updated_at = datetime("now") WHERE id = ? AND school_id = ? AND role = "siswa"')
				.bind(photo, parsedId, locals.user.school_id)
				.run();
			
			// Jika ada foto baru dari cloudinary, masukkan ke uploaded_media agar terdata
			if (photo && photo.includes('res.cloudinary.com')) {
				try {
					await db.prepare(`
						INSERT INTO uploaded_media (url, name, media_type, uploaded_by, school_id, is_public) 
						VALUES (?, ?, 'image', ?, ?, 0)
						ON CONFLICT(url) DO UPDATE SET school_id = excluded.school_id
					`).bind(photo, 'Foto Siswa', locals.user.id, locals.user.school_id).run();
				} catch (err: any) {
					console.error('Failed to log media:', err);
				}
			}
			
			return { success: true };
		} catch (e: any) {
			console.error('Update photo error:', e);
			return fail(500, { error: e.message || 'Gagal merubah foto' });
		}
	}
};
