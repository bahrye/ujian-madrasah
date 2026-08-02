// @ts-nocheck
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { hashPassword } from '$lib/server/auth';

export const load = async ({ locals, url, platform }: Parameters<PageServerLoad>[0]) => {
	const db = getDB(platform);
	const search = url.searchParams.get('search') || '';
	const classFilter = url.searchParams.get('class') || '';

	let query = `
		SELECT u.id, u.username, u.name, u.is_active, u.created_at, c.name as class_name 
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

	const [usersResult, classesResult] = await Promise.all([
		db.prepare(query).bind(...params).all(),
		db.prepare('SELECT id, name FROM classes WHERE school_id = ? ORDER BY name ASC').bind(locals.user!.school_id).all()
	]);

	return { 
		users: usersResult.results,
		classes: classesResult.results
	};
};

export const actions = {
	add: async ({ request, locals, platform }: import('./$types').RequestEvent) => {
		const db = getDB(platform);
		const data = await request.formData();
		const name = data.get('name')?.toString().trim();
		const username = data.get('username')?.toString().trim();
		const class_id = data.get('class_id')?.toString() || null;
		const password = data.get('password')?.toString();

		if (!name || !username || !password) {
			return fail(400, { error: 'Semua field wajib diisi' });
		}

		try {
			// Cek username
			const existing = await db.prepare('SELECT id FROM users WHERE username = ?').bind(username).first();
			if (existing) {
				return fail(400, { error: 'Username sudah digunakan' });
			}

			const passwordHash = await hashPassword(password);
			
			await db.prepare('INSERT INTO users (school_id, class_id, username, password_hash, name, role) VALUES (?, ?, ?, ?, ?, ?)')
				.bind(locals.user!.school_id, class_id, username, passwordHash, name, 'siswa')
				.run();
			
			return { success: true };
		} catch (e) {
			return fail(500, { error: 'Gagal menambahkan siswa' });
		}
	},
	toggleStatus: async ({ request, platform, locals }: import('./$types').RequestEvent) => {
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
;null as any as Actions;