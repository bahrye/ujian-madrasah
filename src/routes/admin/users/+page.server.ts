import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB, ensureUserLoginPinColumn } from '$lib/server/db';
import { hashPassword, createToken, COOKIE_NAME, createQrLoginToken, generate5DigitPin } from '$lib/server/auth';

export const load: PageServerLoad = async ({ platform, url, locals }) => {
	const db = getDB(platform);
	await ensureUserLoginPinColumn(db);
	const search = url.searchParams.get('search') || '';
	const roleFilter = url.searchParams.get('role') || '';

	let query = 'SELECT id, username, password_hash, name, nip, role, is_active, created_at, photo, login_pin FROM users WHERE school_id = ? AND role != "siswa" AND role != "superadmin" AND role != "admin"';
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

	const [usersResult, school] = await Promise.all([
		db.prepare(query).bind(...params).all(),
		db.prepare('SELECT name, logo_url FROM schools WHERE id = ?').bind(locals.user!.school_id).first()
	]);

	const usersWithTokens = await Promise.all(
		(usersResult.results || []).map(async (u: any) => {
			let qrToken = '';
			if (u.id && u.username && u.password_hash) {
				qrToken = await createQrLoginToken(u.id, u.username, u.password_hash);
			}
			return {
				id: u.id,
				username: u.username,
				name: u.name,
				nip: u.nip,
				role: u.role,
				is_active: u.is_active,
				created_at: u.created_at,
				photo: u.photo,
				login_pin: u.login_pin || null,
				qr_token: qrToken
			};
		})
	);

	return { 
		users: usersWithTokens, 
		search, 
		roleFilter,
		schoolName: (school as any)?.name || '',
		schoolLogo: (school as any)?.logo_url || ''
	};
};

export const actions: Actions = {
	generatePin: async ({ request, platform, locals }) => {
		const db = getDB(platform);
		await ensureUserLoginPinColumn(db);
		const form = await request.formData();
		const userId = form.get('id');
		if (!userId) return fail(400, { error: 'ID pengguna tidak valid' });

		const pin = generate5DigitPin();
		await db.prepare('UPDATE users SET login_pin = ? WHERE id = ? AND school_id = ?')
			.bind(pin, userId, locals.user!.school_id)
			.run();

		return { success: true, message: `Angka rahasia 5-digit berhasil dibuat: ${pin}` };
	},

	clearPin: async ({ request, platform, locals }) => {
		const db = getDB(platform);
		await ensureUserLoginPinColumn(db);
		const form = await request.formData();
		const userId = form.get('id');
		if (!userId) return fail(400, { error: 'ID pengguna tidak valid' });

		await db.prepare('UPDATE users SET login_pin = NULL WHERE id = ? AND school_id = ?')
			.bind(userId, locals.user!.school_id)
			.run();

		return { success: true, message: 'Angka rahasia berhasil dinonaktifkan' };
	},

	generateAllPins: async ({ platform, locals }) => {
		const db = getDB(platform);
		await ensureUserLoginPinColumn(db);
		const users = await db.prepare('SELECT id FROM users WHERE school_id = ? AND role != "siswa"')
			.bind(locals.user!.school_id)
			.all();

		for (const u of (users.results || [])) {
			const pin = generate5DigitPin();
			await db.prepare('UPDATE users SET login_pin = ? WHERE id = ?')
				.bind(pin, (u as any).id)
				.run();
		}

		return { success: true, message: 'Angka rahasia untuk semua petugas berhasil digenerate' };
	},

	create: async ({ request, platform, locals }) => {
		const db = getDB(platform);
		const form = await request.formData();
		const schoolId = locals.user!.school_id;

		const username = form.get('username')?.toString().trim();
		const password = form.get('password')?.toString();
		const name = form.get('name')?.toString().trim();
		const nip = form.get('nip')?.toString().trim() || null;
		const role = form.get('role')?.toString();

		if (!username || !password || !name || !role) {
			return fail(400, { error: 'Semua field wajib diisi.' });
		}

		if (!['guru', 'pengawas', 'siswa', 'panitia'].includes(role)) {
			return fail(400, { error: 'Role tidak valid.' });
		}

		const existing = await db.prepare('SELECT id FROM users WHERE username = ?').bind(username).first();
		if (existing) {
			return fail(400, { error: 'Username sudah digunakan.' });
		}

		try {
			const passwordHash = await hashPassword(password);
			await db.prepare('INSERT INTO users (school_id, username, password_hash, name, nip, role) VALUES (?, ?, ?, ?, ?, ?)')
				.bind(schoolId, username, passwordHash, name, nip, role)
				.run();

			return { success: 'Pengguna berhasil ditambahkan.' };
		} catch (e: any) {
			console.error(e);
			return fail(500, { error: e.message || 'Gagal menambahkan pengguna.' });
		}
	},

	update: async ({ request, platform, locals, cookies }) => {
		const db = getDB(platform);
		const form = await request.formData();
		const schoolId = locals.user!.school_id;

		const idStr = form.get('id')?.toString();
		const name = form.get('name')?.toString().trim();
		const nip = form.get('nip')?.toString().trim() || null;
		const role = form.get('role')?.toString();
		const password = form.get('password')?.toString();
		const isActive = form.get('is_active')?.toString();
		const parsedId = parseInt(idStr || '', 10);

		if (isNaN(parsedId) || !name || !role) {
			return fail(400, { error: 'Data tidak lengkap.' });
		}

		try {
			if (password) {
				const passwordHash = await hashPassword(password);
				await db.prepare('UPDATE users SET name = ?, nip = ?, role = ?, password_hash = ?, is_active = ?, updated_at = datetime(\'now\') WHERE id = ? AND school_id = ?')
					.bind(name, nip, role, passwordHash, isActive === '1' ? 1 : 0, parsedId, schoolId)
					.run();
			} else {
				await db.prepare('UPDATE users SET name = ?, nip = ?, role = ?, is_active = ?, updated_at = datetime(\'now\') WHERE id = ? AND school_id = ?')
					.bind(name, nip, role, isActive === '1' ? 1 : 0, parsedId, schoolId)
					.run();
			}
		} catch (e: any) {
			console.error(e);
			return fail(500, { error: e.message || 'Gagal memperbarui pengguna.' });
		}

		// Jika user mengubah data dirinya sendiri, buat ulang token agar nama/role langsung terupdate di UI
		if (parsedId === locals.user!.id) {
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

	delete: async ({ request, platform, locals }) => {
		if (!locals.user) return fail(401, { error: 'Unauthorized' });
		const db = getDB(platform);
		const form = await request.formData();
		const idStr = form.get('id')?.toString();
		const schoolId = locals.user.school_id;
		const parsedId = parseInt(idStr || '', 10);

		if (isNaN(parsedId)) return fail(400, { error: 'ID tidak valid.' });

		// Cek pengguna yang akan dihapus
		const userToDelete = await db.prepare('SELECT id, is_active, role FROM users WHERE id = ? AND school_id = ?')
			.bind(parsedId, schoolId)
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
				db.prepare('UPDATE exams SET created_by = NULL WHERE created_by = ?').bind(parsedId),
				db.prepare('UPDATE tokens SET created_by = NULL WHERE created_by = ?').bind(parsedId),
				db.prepare('UPDATE uploaded_media SET uploaded_by = NULL WHERE uploaded_by = ?').bind(parsedId),
				db.prepare('DELETE FROM exam_teachers WHERE teacher_id = ?').bind(parsedId),
				db.prepare('DELETE FROM exam_proctors WHERE proctor_id = ?').bind(parsedId),
				db.prepare('DELETE FROM exam_participants WHERE student_id = ?').bind(parsedId),
				db.prepare('DELETE FROM student_answers WHERE attempt_id IN (SELECT id FROM student_attempts WHERE student_id = ?)').bind(parsedId),
				db.prepare('DELETE FROM student_attempts WHERE student_id = ?').bind(parsedId),
				db.prepare('DELETE FROM users WHERE id = ? AND school_id = ?').bind(parsedId, schoolId)
			]);

			return { success: 'Pengguna nonaktif berhasil dihapus.' };
		} catch (err: any) {
			console.error('Delete user error:', err);
			return fail(500, { error: 'Terjadi kesalahan sistem saat menghapus pengguna.' });
		}
	},

	importExcel: async ({ request, locals, platform }) => {
		const db = getDB(platform);
		const data = await request.formData();
		const usersJson = data.get('users_json')?.toString();

		if (!usersJson) {
			return fail(400, { error: 'Data tidak valid' });
		}

		try {
			const users = JSON.parse(usersJson) as any[];
			if (!Array.isArray(users) || users.length === 0) return fail(400, { error: 'Tidak ada data pengguna' });

			// Ambil semua username yang sudah ada untuk validasi cepat
			const existingUsersResult = await db.prepare('SELECT username FROM users').all<{ username: string }>();
			const existingUsernames = new Set(existingUsersResult.results.map(u => u.username.toLowerCase()));

			const stmts = [];
			let skippedCount = 0;

			for (const user of users) {
				const username = String(user.username || '').trim();
				const name = String(user.name || '').trim();
				const nip = user.nip ? String(user.nip).trim() : null;
				const password = String(user.password || '').trim();
				const role = String(user.role || '').trim();

				if (!username || !name || !password || !role) continue;

				if (existingUsernames.has(username.toLowerCase())) {
					skippedCount++;
					continue;
				}

				existingUsernames.add(username.toLowerCase());
				const passwordHash = await hashPassword(password);
				stmts.push(
					db.prepare('INSERT INTO users (school_id, username, password_hash, name, nip, role) VALUES (?, ?, ?, ?, ?, ?)')
						.bind(locals.user!.school_id, username, passwordHash, name, nip, role)
				);
			}

			if (stmts.length > 0) {
				const chunkSize = 50;
				for (let i = 0; i < stmts.length; i += chunkSize) {
					await db.batch(stmts.slice(i, i + chunkSize));
				}
			}

			const successCount = stmts.length;
			let msg = `Berhasil mengimpor ${successCount} pengguna.`;
			if (skippedCount > 0) {
				msg += ` (${skippedCount} data dilewati karena Username sudah terdaftar).`;
			}

			return { success: msg };
		} catch (e: any) {
			console.error('Import error:', e);
			return fail(500, { error: e.message || 'Terjadi kesalahan saat memproses data import' });
		}
	}
};
