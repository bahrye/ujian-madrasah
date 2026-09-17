import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { hashPassword } from '$lib/server/auth';
import { deleteFromCloudinary } from '$lib/server/cloudinary';
import { deleteMonitoringPhotos } from '$lib/server/monitoring';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async ({ locals, url, platform }) => {
	if (!locals.user) throw redirect(302, '/login');
	const db = getDB(platform);
	const search = url.searchParams.get('search') || '';
	const classFilter = url.searchParams.get('class') || '';

	let query = `
		SELECT u.id, u.username, u.name, u.is_active, u.created_at, u.class_id, c.name as class_name, u.place_of_birth, u.date_of_birth, u.photo, u.nisn, u.nomor_peserta, u.gender, u.session_number 
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

	query += ` ORDER BY CASE c.level
		WHEN 'I' THEN 1 WHEN 'II' THEN 2 WHEN 'III' THEN 3 WHEN 'IV' THEN 4 WHEN 'V' THEN 5 WHEN 'VI' THEN 6 WHEN 'VII' THEN 7 WHEN 'VIII' THEN 8 WHEN 'IX' THEN 9 WHEN 'X' THEN 10 WHEN 'XI' THEN 11 WHEN 'XII' THEN 12
		WHEN '1' THEN 1 WHEN '2' THEN 2 WHEN '3' THEN 3 WHEN '4' THEN 4 WHEN '5' THEN 5 WHEN '6' THEN 6 WHEN '7' THEN 7 WHEN '8' THEN 8 WHEN '9' THEN 9 WHEN '10' THEN 10 WHEN '11' THEN 11 WHEN '12' THEN 12
		ELSE 99 END ASC, c.name ASC, u.name ASC LIMIT 500`;

	try {
		const [usersResult, classesResult, school] = await Promise.all([
			db.prepare(query).bind(...params).all(),
			db.prepare(`SELECT id, name FROM classes WHERE school_id = ? ORDER BY CASE level
		WHEN 'I' THEN 1 WHEN 'II' THEN 2 WHEN 'III' THEN 3 WHEN 'IV' THEN 4 WHEN 'V' THEN 5 WHEN 'VI' THEN 6 WHEN 'VII' THEN 7 WHEN 'VIII' THEN 8 WHEN 'IX' THEN 9 WHEN 'X' THEN 10 WHEN 'XI' THEN 11 WHEN 'XII' THEN 12
		WHEN '1' THEN 1 WHEN '2' THEN 2 WHEN '3' THEN 3 WHEN '4' THEN 4 WHEN '5' THEN 5 WHEN '6' THEN 6 WHEN '7' THEN 7 WHEN '8' THEN 8 WHEN '9' THEN 9 WHEN '10' THEN 10 WHEN '11' THEN 11 WHEN '12' THEN 12
		ELSE 99 END ASC, name ASC`).bind(locals.user.school_id).all(),
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
		let nomor_peserta = data.get('nomor_peserta')?.toString().trim();
		const class_id = data.get('class_id')?.toString() || null;
		const place_of_birth = data.get('place_of_birth')?.toString().trim() || null;
		const date_of_birth = data.get('date_of_birth')?.toString() || null;
		const gender = data.get('gender')?.toString() || null;
		const session_number = parseInt(data.get('session_number')?.toString() || '1', 10);

		if (!name || !nisn) {
			return fail(400, { error: 'Nama dan NISN wajib diisi' });
		}

		if (!nomor_peserta) {
			nomor_peserta = `AUTO-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
		}

		try {
			const username = nomor_peserta;

			const existingNisn = await db.prepare('SELECT id FROM users WHERE nisn = ? OR username = ?').bind(nisn, username).first();
			if (existingNisn) {
				return fail(400, { error: 'NISN atau Username sudah terdaftar' });
			}
			const existingNo = await db.prepare('SELECT id FROM users WHERE nomor_peserta = ?').bind(nomor_peserta).first();
			if (existingNo) {
				return fail(400, { error: 'Nomor Peserta sudah terdaftar' });
			}

			const passwordHash = await hashPassword(nisn);
			
			await db.prepare('INSERT INTO users (school_id, class_id, username, password_hash, name, role, place_of_birth, date_of_birth, nisn, nomor_peserta, gender, session_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
				.bind(locals.user.school_id, class_id, username, passwordHash, name, 'siswa', place_of_birth, date_of_birth, nisn, nomor_peserta, gender, session_number)
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
		let nomor_peserta = data.get('nomor_peserta')?.toString().trim();
		const class_id = data.get('class_id')?.toString() || null;
		const place_of_birth = data.get('place_of_birth')?.toString().trim() || null;
		const date_of_birth = data.get('date_of_birth')?.toString() || null;
		const gender = data.get('gender')?.toString() || null;
		const parsedId = parseInt(idStr || '', 10);

		if (isNaN(parsedId) || !name || !nisn) {
			return fail(400, { error: 'ID, Nama, dan NISN wajib diisi' });
		}

		if (!nomor_peserta) {
			nomor_peserta = `AUTO-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
		}

		try {
			const username = nomor_peserta;

			const existing = await db.prepare('SELECT id FROM users WHERE (nisn = ? OR username = ?) AND id != ?').bind(nisn, username, parsedId).first();
			if (existing) {
				return fail(400, { error: 'NISN atau Username sudah digunakan siswa lain' });
			}
			const existingNo = await db.prepare('SELECT id FROM users WHERE nomor_peserta = ? AND id != ?').bind(nomor_peserta, parsedId).first();
			if (existingNo) {
				return fail(400, { error: 'Nomor Peserta sudah terdaftar' });
			}

			const passwordHash = await hashPassword(nisn);
			
			await db.prepare('UPDATE users SET name = ?, username = ?, password_hash = ?, class_id = ?, place_of_birth = ?, date_of_birth = ?, nisn = ?, nomor_peserta = ?, gender = ?, updated_at = datetime("now") WHERE id = ? AND school_id = ?')
				.bind(name, username, passwordHash, class_id, place_of_birth, date_of_birth, nisn, nomor_peserta, gender, parsedId, locals.user.school_id)
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
			const mergedEnv = platform?.env || env;
			await deleteMonitoringPhotos(db, mergedEnv, { studentId: parsedId });

			await db.batch([
				db.prepare('DELETE FROM student_answers WHERE attempt_id IN (SELECT id FROM student_attempts WHERE student_id = ?)').bind(parsedId),
				db.prepare('DELETE FROM student_attempts WHERE student_id = ?').bind(parsedId),
				db.prepare('DELETE FROM exam_participants WHERE student_id = ?').bind(parsedId),
				db.prepare(`DELETE FROM users WHERE id = ? AND school_id = ? AND role = 'siswa'`).bind(parsedId, locals.user.school_id)
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

			const mergedEnv = platform?.env || env;
			for (const id of ids) {
				await deleteMonitoringPhotos(db, mergedEnv, { studentId: id });
			}

			const stmts = [];
			for (const id of ids) {
				stmts.push(
					db.prepare('DELETE FROM student_answers WHERE attempt_id IN (SELECT id FROM student_attempts WHERE student_id = ?)').bind(id),
					db.prepare('DELETE FROM student_attempts WHERE student_id = ?').bind(id),
					db.prepare('DELETE FROM exam_participants WHERE student_id = ?').bind(id),
					db.prepare(`DELETE FROM users WHERE id = ? AND school_id = ? AND role = 'siswa'`).bind(id, locals.user.school_id)
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
			let errorMsg = '';

			for (const student of students) {
				const nisn = String(student.nisn || '').trim();
				const name = String(student.name || '').trim();
				let nomor_peserta = student.nomor_peserta ? String(student.nomor_peserta).trim() : null;
				let gender = student.gender ? String(student.gender).toUpperCase().trim() : null;
				if (gender !== 'L' && gender !== 'P') gender = null;
				const session_number = student.session_number ? parseInt(student.session_number, 10) : 1;
				
				if (!nisn || !name) continue;
				
				if (!nomor_peserta) {
					nomor_peserta = `AUTO-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
				}
				
				const username = nomor_peserta;

				if (existingUsernames.has(username.toLowerCase())) {
					skippedCount++;
					continue;
				}

				existingUsernames.add(username.toLowerCase());
				const passwordHash = await hashPassword(nisn);
				stmts.push(
					db.prepare('INSERT INTO users (school_id, class_id, username, password_hash, name, role, place_of_birth, date_of_birth, nisn, nomor_peserta, gender, session_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
						.bind(locals.user.school_id, student.class_id || null, username, passwordHash, name, 'siswa', student.place_of_birth || null, student.date_of_birth || null, nisn, nomor_peserta, gender, session_number)
				);
			}
			
			if (errorMsg) {
				return fail(400, { error: errorMsg });
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
			await db.prepare(`UPDATE users SET is_active = ?, updated_at = datetime('now') WHERE id = ? AND school_id = ? AND role = 'siswa'`)
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
			const oldUser = await db.prepare(`SELECT photo FROM users WHERE id = ? AND school_id = ? AND role = 'siswa'`)
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

			await db.prepare(`UPDATE users SET photo = ?, updated_at = datetime('now') WHERE id = ? AND school_id = ? AND role = 'siswa'`)
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
	},
	generate_peserta: async ({ request, locals, platform }) => {
		if (!locals.user) return fail(401, { error: 'Unauthorized' });
		const db = getDB(platform);
		const data = await request.formData();
		const class_id = data.get('class_id')?.toString();
		const format = data.get('format')?.toString();

		if (!class_id || !format) {
			return fail(400, { error: 'Kelas dan Format wajib diisi' });
		}
		if (!format.includes('[nomor]')) {
			return fail(400, { error: 'Format harus mengandung variabel [nomor]' });
		}

		try {
			const students = await db.prepare("SELECT id, name FROM users WHERE school_id = ? AND class_id = ? AND role = 'siswa' ORDER BY name ASC").bind(locals.user.school_id, class_id).all();
			
			if (!students.results || students.results.length === 0) {
				return fail(400, { error: 'Tidak ada siswa di kelas tersebut' });
			}

			const stmts = [];
			let count = 1;
			for (const student of students.results) {
				const paddedNomor = count.toString().padStart(3, '0');
				const nomorPeserta = format.replace('[nomor]', paddedNomor);
				
				stmts.push(
					db.prepare("UPDATE users SET nomor_peserta = ?, username = ?, updated_at = datetime('now') WHERE id = ? AND school_id = ?")
						.bind(nomorPeserta, nomorPeserta, student.id, locals.user.school_id)
				);
				count++;
			}

			if (stmts.length > 0) {
				const chunkSize = 50;
				for (let i = 0; i < stmts.length; i += chunkSize) {
					await db.batch(stmts.slice(i, i + chunkSize));
				}
			}
			
			return { success: true, message: `Berhasil men-generate Nomor Peserta untuk ${stmts.length} siswa.` };
		} catch (e: any) {
			console.error('Generate peserta error:', e);
			return fail(500, { error: 'Terjadi kesalahan pada database saat generate nomor peserta' });
		}
	}
};
