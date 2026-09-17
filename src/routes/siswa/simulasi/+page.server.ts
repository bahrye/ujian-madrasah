import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals, platform }) => {
	if (!locals.user || locals.user.role !== 'siswa') {
		throw redirect(302, '/login');
	}

	let schoolName = '';
	try {
		const db = getDB(platform);
		let schoolId = locals.user.school_id;
		if (!schoolId) {
			const u = await db.prepare('SELECT school_id FROM users WHERE id = ?')
				.bind(locals.user.id)
				.first<{ school_id: number | null }>();
			schoolId = u?.school_id ?? null;
		}
		if (schoolId) {
			const s = await db.prepare('SELECT name FROM schools WHERE id = ?').bind(schoolId).first<{ name: string }>();
			schoolName = s?.name || '';
		}
	} catch (e) {
		console.warn('Failed to load school name for simulation:', e);
	}

	return {
		user: locals.user,
		schoolName
	};
};
