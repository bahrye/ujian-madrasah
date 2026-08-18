import type { PageServerLoad } from './$types';
import { getDB, ensureUserLoginPinColumn } from '$lib/server/db';
import { error, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ platform, locals, url }) => {
	if (!locals.user) throw redirect(302, '/login');
	if (locals.user.role !== 'admin' && locals.user.role !== 'superadmin' && locals.user.role !== 'panitia') {
		throw error(403, 'Akses ditolak');
	}

	const db = getDB(platform);
	await ensureUserLoginPinColumn(db);

	const roleFilter = url.searchParams.get('role') || '';

	let query = 'SELECT id, username, name, nip, role, is_active, login_pin, created_at FROM users WHERE school_id = ? AND role != "siswa" AND role != "superadmin" AND role != "admin"';
	const params: unknown[] = [locals.user.school_id];

	if (roleFilter) {
		query += ' AND role = ?';
		params.push(roleFilter);
	}

	query += ' ORDER BY role ASC, name ASC';

	const [usersResult, school] = await Promise.all([
		db.prepare(query).bind(...params).all(),
		db.prepare('SELECT * FROM schools WHERE id = ?').bind(locals.user.school_id).first()
	]);

	return {
		users: usersResult.results || [],
		school: school || null,
		roleFilter
	};
};
