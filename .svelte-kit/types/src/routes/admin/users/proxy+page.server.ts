// @ts-nocheck
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { hashPassword, createToken, COOKIE_NAME } from '$lib/server/auth';

export const load = async ({ platform, url, locals }: Parameters<PageServerLoad>[0]) => {
	const db = getDB(platform);
	const search = url.searchParams.get('search') || '';
	const roleFilter = url.searchParams.get('role') || '';

	let query = 'SELECT id, username, name, role, is_active, created_at FROM users WHERE school_id = ? AND role != "siswa" AND role != "superadmin"';
	const params: unknown[] = [locals.user!.school_id];

	if (search) {
		query += ' AND (username LIKE ? OR name LIKE ?)';
		params.push(`%${search}%`, `%${search}%`);
	}
	if (roleFilter) {
		query += ' AND role = ?';
		params.push(roleFilter);
	}

	query += ' ORDER BY created_at DESC';

	const users = await db.prepare(query).bind(...params).all();

	return { users: users.results, search, roleFilter };
};

export const actions = {
	create: async ({ request, platform, locals }: import('./$types').RequestEvent) => {
		const db = getDB(platform);
		const form = await request.formData();
		const schoolId = locals.user!.school_id;

		const username = form.get('username')?.toString().trim();
		const password = form.get('password')?.toString();
		const name = form.get('name')?.toString().trim();
		const role = form.get('role')?.toString();

		if (!username || !password || !name || !role) {
			return fail(400, { error: 'Semua field wajib diisi.' });
		}

		if (!['admin', 'guru', 'pengawas', 'siswa'].includes(role)) {
			return fail(400, { error: 'Role tidak valid.' });
		}

		const existing = await db.prepare('SELECT id FROM users WHERE username = ?').bind(username).first();
		if (existing) {
			return fail(400, { error: 'Username sudah digunakan.' });
		}

		const passwordHash = await hashPassword(password);
		await db.prepare('INSERT INTO users (school_id, username, password_hash, name, role) VALUES (?, ?, ?, ?, ?)')
			.bind(schoolId, username, passwordHash, name, role)
			.run();

		return { success: 'Pengguna berhasil ditambahkan.' };
	},

	update: async ({ request, platform, locals, cookies }: import('./$types').RequestEvent) => {
		const db = getDB(platform);
		const form = await request.formData();
		const schoolId = locals.user!.school_id;

		const id = form.get('id')?.toString();
		const name = form.get('name')?.toString().trim();
		const role = form.get('role')?.toString();
		const password = form.get('password')?.toString();
		const isActive = form.get('is_active')?.toString();

		if (!id || !name || !role) {
			return fail(400, { error: 'Data tidak lengkap.' });
		}

		if (password) {
			const passwordHash = await hashPassword(password);
			await db.prepare('UPDATE users SET name = ?, role = ?, password_hash = ?, is_active = ?, updated_at = datetime(\'now\') WHERE id = ? AND school_id = ?')
				.bind(name, role, passwordHash, isActive === '1' ? 1 : 0, id, schoolId)
				.run();
		} else {
			await db.prepare('UPDATE users SET name = ?, role = ?, is_active = ?, updated_at = datetime(\'now\') WHERE id = ? AND school_id = ?')
				.bind(name, role, isActive === '1' ? 1 : 0, id, schoolId)
				.run();
		}

		// Jika user mengubah data dirinya sendiri, buat ulang token agar nama/role langsung terupdate di UI
		if (id === locals.user!.id.toString()) {
			const updatedUser = {
				...locals.user!,
				name,
				role: role as any
			};
			const token = await createToken(updatedUser);
			cookies.set(COOKIE_NAME, token, {
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: 60 * 60 * 8 // 8 jam
			});
		}

		return { success: 'Pengguna berhasil diperbarui.' };
	},

	delete: async ({ request, platform, locals }: import('./$types').RequestEvent) => {
		if (!locals.user) return fail(401, { error: 'Unauthorized' });
		const db = getDB(platform);
		const form = await request.formData();
		const id = form.get('id')?.toString();
		const schoolId = locals.user.school_id;

		if (!id) return fail(400, { error: 'ID tidak valid.' });

		// Cek pengguna yang akan dihapus
		const userToDelete = await db.prepare('SELECT id, is_active, role FROM users WHERE id = ? AND school_id = ?')
			.bind(id, schoolId)
			.first<{ id: number; is_active: number; role: string }>();

		if (!userToDelete) {
			return fail(404, { error: 'Pengguna tidak ditemukan.' });
		}

		if (userToDelete.id === locals.user.id) {
			return fail(400, { error: 'Anda tidak dapat menghapus akun Anda sendiri.' });
		}

		if (userToDelete.is_active === 1) {
			return fail(400, { error: 'Gagal dihapus: Pengguna masih AKTIF. Harap nonaktifkan pengguna terlebih dahulu!' });
		}

		try {
			// Bersihkan keterkaitan Foreign Key agar tidak terjadi error 500 (Foreign Key Constraint Failed)
			await db.batch([
				db.prepare('UPDATE exams SET created_by = NULL WHERE created_by = ?').bind(id),
				db.prepare('UPDATE tokens SET created_by = NULL WHERE created_by = ?').bind(id),
				db.prepare('UPDATE uploaded_media SET uploaded_by = NULL WHERE uploaded_by = ?').bind(id),
				db.prepare('DELETE FROM exam_teachers WHERE teacher_id = ?').bind(id),
				db.prepare('DELETE FROM exam_proctors WHERE proctor_id = ?').bind(id),
				db.prepare('DELETE FROM exam_participants WHERE student_id = ?').bind(id),
				db.prepare('DELETE FROM student_answers WHERE attempt_id IN (SELECT id FROM student_attempts WHERE student_id = ?)').bind(id),
				db.prepare('DELETE FROM student_attempts WHERE student_id = ?').bind(id),
				db.prepare('DELETE FROM users WHERE id = ? AND school_id = ?').bind(id, schoolId)
			]);

			return { success: 'Pengguna nonaktif berhasil dihapus.' };
		} catch (err: any) {
			console.error('Delete user error:', err);
			return fail(500, { error: 'Terjadi kesalahan sistem saat menghapus pengguna.' });
		}
	},

	importExcel: async ({ request, locals, platform }: import('./$types').RequestEvent) => {
		const db = getDB(platform);
		const data = await request.formData();
		const usersJson = data.get('users_json')?.toString();

		if (!usersJson) {
			return fail(400, { error: 'Data tidak valid' });
		}

		try {
			const users = JSON.parse(usersJson) as any[];
			if (users.length === 0) return fail(400, { error: 'Tidak ada data pengguna' });

			let successCount = 0;
			
			// Process sequentially to handle password hashing
			for (const user of users) {
				// Cek apakah username sudah ada (sekolah manapun, karena username harus unik global di sistem kita atau per sekolah tergantung constraint)
				// Disini cek username per sekolah
				const existing = await db.prepare('SELECT id FROM users WHERE username = ? AND school_id = ?').bind(user.username, locals.user!.school_id).first();
				
				if (!existing) {
					const passwordHash = await hashPassword(user.password);
					await db.prepare('INSERT INTO users (school_id, username, password_hash, name, role) VALUES (?, ?, ?, ?, ?)')
						.bind(locals.user!.school_id, user.username, passwordHash, user.name, user.role)
						.run();
					successCount++;
				}
			}

			return { success: `Berhasil mengimpor ${successCount} pengguna dari total ${users.length} data.` };
		} catch (e) {
			console.error('Import error:', e);
			return fail(500, { error: 'Terjadi kesalahan saat memproses data import' });
		}
	}
};
;null as any as Actions;