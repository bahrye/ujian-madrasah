import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { hashPassword } from '$lib/server/auth';

export const load: PageServerLoad = async ({ platform, url, locals }) => {
	const db = getDB(platform);
	const search = url.searchParams.get('search') || '';
	const roleFilter = url.searchParams.get('role') || '';

	let query = 'SELECT id, username, name, role, is_active, created_at FROM users WHERE school_id = ?';
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

export const actions: Actions = {
	create: async ({ request, platform, locals }) => {
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

	update: async ({ request, platform, locals }) => {
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

		return { success: 'Pengguna berhasil diperbarui.' };
	},

	delete: async ({ request, platform, locals }) => {
		const db = getDB(platform);
		const form = await request.formData();
		const id = form.get('id')?.toString();
		const schoolId = locals.user!.school_id;

		if (!id) return fail(400, { error: 'ID tidak valid.' });

		await db.prepare('DELETE FROM users WHERE id = ? AND school_id = ?').bind(id, schoolId).run();
		return { success: 'Pengguna berhasil dihapus.' };
	}
};
