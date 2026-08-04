// @ts-nocheck
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { hashPassword } from '$lib/server/auth';

export const load = async ({ platform }: Parameters<PageServerLoad>[0]) => {
	const db = getDB(platform);
	
	// Get all schools for the dropdown
	const { results: schools } = await db.prepare('SELECT id, name FROM schools ORDER BY name ASC').all();

	// Get all admins with their school names
	const { results: admins } = await db.prepare(`
		SELECT u.id, u.username, u.name, u.is_active, u.created_at, s.name as school_name, s.id as school_id
		FROM users u
		LEFT JOIN schools s ON u.school_id = s.id
		WHERE u.role = 'admin'
		ORDER BY u.created_at DESC
	`).all();

	return { schools, admins };
};

export const actions = {
	add: async ({ request, platform }: import('./$types').RequestEvent) => {
		const db = getDB(platform);
		const data = await request.formData();
		const school_id = data.get('school_id')?.toString();
		const username = data.get('username')?.toString().trim();
		const password = data.get('password')?.toString();
		const name = data.get('name')?.toString().trim();

		if (!school_id || !username || !password || !name) {
			return fail(400, { error: 'Semua field wajib diisi', school_id, username, name });
		}

		if (password.length < 6) {
			return fail(400, { error: 'Password minimal 6 karakter', school_id, username, name });
		}

		// Cek username unik
		const existingUser = await db.prepare('SELECT id FROM users WHERE username = ?').bind(username).first();
		if (existingUser) {
			return fail(400, { error: 'Username sudah digunakan', school_id, username, name });
		}

		try {
			const password_hash = await hashPassword(password);
			await db.prepare('INSERT INTO users (school_id, username, password_hash, name, role) VALUES (?, ?, ?, ?, ?)')
				.bind(school_id, username, password_hash, name, 'admin')
				.run();
			
			return { success: true };
		} catch (e) {
			return fail(500, { error: 'Gagal menambahkan admin', school_id, username, name });
		}
	},
	toggleStatus: async ({ request, platform }: import('./$types').RequestEvent) => {
		const db = getDB(platform);
		const data = await request.formData();
		const id = data.get('id')?.toString();
		const currentStatus = data.get('is_active')?.toString();

		if (!id || !currentStatus) return fail(400, { error: 'Data tidak valid' });

		const newStatus = currentStatus === '1' ? 0 : 1;

		try {
			await db.prepare('UPDATE users SET is_active = ?, updated_at = datetime("now") WHERE id = ? AND role = "admin"')
				.bind(newStatus, id)
				.run();
			
			return { success: true };
		} catch (e) {
			return fail(500, { error: 'Gagal merubah status admin' });
		}
	},
	delete: async ({ request, platform, locals }: import('./$types').RequestEvent) => {
		if (!locals.user || locals.user.role !== 'superadmin') return fail(401, { error: 'Unauthorized' });
		const db = getDB(platform);
		const data = await request.formData();
		const id = data.get('id')?.toString();

		if (!id) return fail(400, { error: 'ID tidak valid' });

		const userToDelete = await db.prepare('SELECT id, is_active FROM users WHERE id = ? AND role = "admin"')
			.bind(id)
			.first<{ id: number; is_active: number }>();

		if (!userToDelete) {
			return fail(404, { error: 'Admin tidak ditemukan' });
		}

		if (userToDelete.is_active === 1) {
			return fail(400, { error: 'Gagal dihapus: Admin masih AKTIF. Harap nonaktifkan admin terlebih dahulu!' });
		}

		try {
			await db.batch([
				db.prepare('UPDATE exams SET created_by = NULL WHERE created_by = ?').bind(id),
				db.prepare('UPDATE tokens SET created_by = NULL WHERE created_by = ?').bind(id),
				db.prepare('UPDATE uploaded_media SET uploaded_by = NULL WHERE uploaded_by = ?').bind(id),
				db.prepare('DELETE FROM users WHERE id = ? AND role = "admin"').bind(id)
			]);
			return { success: true };
		} catch (e) {
			console.error('Delete admin error:', e);
			return fail(500, { error: 'Gagal menghapus admin' });
		}
	}
};
;null as any as Actions;