import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { hashPassword } from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals, url, platform }) => {
	const db = getDB(platform);
	const search = url.searchParams.get('search') || '';
	const classFilter = url.searchParams.get('class') || '';

	let query = `
		SELECT u.id, u.username, u.name, u.is_active, u.created_at, u.class_id, c.name as class_name 
		FROM users u 
		LEFT JOIN classes c ON u.class_id = c.id 
		WHERE u.school_id = ? AND u.role = 'siswa'
	`;
	const params: unknown[] = [locals.user!.school_id];

	if (search) {
		query += ' AND (u.username LIKE ? OR u.name LIKE ?)';
		params.push(`%${search}%`, `%${search}%`);
	}
	if (classFilter) {
		query += ' AND u.class_id = ?';
		params.push(classFilter);
	}

	query += ' ORDER BY u.name ASC';

	const [usersResult, classesResult, school] = await Promise.all([
		db.prepare(query).bind(...params).all(),
		db.prepare('SELECT id, name FROM classes WHERE school_id = ? ORDER BY name ASC').bind(locals.user!.school_id).all(),
		db.prepare('SELECT name, logo_url FROM schools WHERE id = ?').bind(locals.user!.school_id).first()
	]);

	return { 
		users: usersResult.results,
		classes: classesResult.results,
		schoolName: (school as any)?.name || '',
		schoolLogo: (school as any)?.logo_url || ''
	};
};

export const actions: Actions = {
	add: async ({ request, locals, platform }) => {
		const db = getDB(platform);
		const data = await request.formData();
		const name = data.get('name')?.toString().trim();
		const nisn = data.get('nisn')?.toString().trim();
		const class_id = data.get('class_id')?.toString() || null;

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
			
			await db.prepare('INSERT INTO users (school_id, class_id, username, password_hash, name, role) VALUES (?, ?, ?, ?, ?, ?)')
				.bind(locals.user!.school_id, class_id, nisn, passwordHash, name, 'siswa')
				.run();
			
			return { success: true };
		} catch (e) {
			return fail(500, { error: 'Gagal menambahkan siswa' });
		}
	},
	edit: async ({ request, locals, platform }) => {
		const db = getDB(platform);
		const data = await request.formData();
		const id = data.get('id')?.toString();
		const name = data.get('name')?.toString().trim();
		const nisn = data.get('nisn')?.toString().trim();
		const class_id = data.get('class_id')?.toString() || null;

		if (!id || !name || !nisn) {
			return fail(400, { error: 'ID, Nama dan NISN wajib diisi' });
		}

		try {
			// Cek username lain
			const existing = await db.prepare('SELECT id FROM users WHERE username = ? AND id != ?').bind(nisn, id).first();
			if (existing) {
				return fail(400, { error: 'NISN sudah digunakan siswa lain' });
			}

			// Update NISN (sebagai username) dan update password agar sesuai NISN baru
			const passwordHash = await hashPassword(nisn);
			
			await db.prepare('UPDATE users SET name = ?, username = ?, password_hash = ?, class_id = ?, updated_at = datetime("now") WHERE id = ? AND school_id = ?')
				.bind(name, nisn, passwordHash, class_id, id, locals.user!.school_id)
				.run();
			
			return { success: true };
		} catch (e) {
			return fail(500, { error: 'Gagal mengupdate siswa' });
		}
	},
	delete: async ({ request, locals, platform }) => {
		const db = getDB(platform);
		const data = await request.formData();
		const id = data.get('id')?.toString();

		if (!id) return fail(400, { error: 'ID tidak valid' });

		try {
			await db.prepare('DELETE FROM users WHERE id = ? AND school_id = ? AND role = "siswa"').bind(id, locals.user!.school_id).run();
			return { success: true };
		} catch (e) {
			return fail(500, { error: 'Gagal menghapus siswa' });
		}
	},
	importExcel: async ({ request, locals, platform }) => {
		const db = getDB(platform);
		const data = await request.formData();
		const studentsJson = data.get('students_json')?.toString();

		if (!studentsJson) {
			return fail(400, { error: 'Data tidak valid' });
		}

		try {
			const students = JSON.parse(studentsJson) as any[];
			if (students.length === 0) return fail(400, { error: 'Tidak ada data siswa' });

			let successCount = 0;
			
			// Process sequentially to handle password hashing
			for (const student of students) {
				// Cek apakah NISN sudah ada
				const existing = await db.prepare('SELECT id FROM users WHERE username = ? AND school_id = ?').bind(student.nisn, locals.user!.school_id).first();
				
				if (!existing) {
					const passwordHash = await hashPassword(student.nisn);
					await db.prepare('INSERT INTO users (school_id, class_id, username, password_hash, name, role) VALUES (?, ?, ?, ?, ?, ?)')
						.bind(locals.user!.school_id, student.class_id, student.nisn, passwordHash, student.name, 'siswa')
						.run();
					successCount++;
				}
			}

			return { success: true, message: `Berhasil mengimpor ${successCount} siswa dari total ${students.length} data.` };
		} catch (e) {
			console.error('Import error:', e);
			return fail(500, { error: 'Terjadi kesalahan saat memproses data import' });
		}
	},
	toggleStatus: async ({ request, platform, locals }) => {
		const db = getDB(platform);
		const data = await request.formData();
		const id = data.get('id')?.toString();
		const currentStatus = data.get('is_active')?.toString();

		if (!id || !currentStatus) return fail(400, { error: 'Data tidak valid' });

		const newStatus = currentStatus === '1' ? 0 : 1;

		try {
			await db.prepare('UPDATE users SET is_active = ?, updated_at = datetime("now") WHERE id = ? AND school_id = ? AND role = "siswa"')
				.bind(newStatus, id, locals.user!.school_id)
				.run();
			
			return { success: true };
		} catch (e) {
			return fail(500, { error: 'Gagal merubah status' });
		}
	}
};
