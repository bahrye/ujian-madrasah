import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load: LayoutServerLoad = async ({ locals, platform }) => {
	if (!locals.user || (locals.user.role !== 'pengawas' && locals.user.role !== 'guru' && locals.user.role !== 'admin')) {
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
			const school = await db.prepare('SELECT name FROM schools WHERE id = ?').bind(schoolId).first<{ name: string }>();
			schoolName = school?.name || '';
		} else {
			const firstSchool = await db.prepare('SELECT name FROM schools ORDER BY id ASC LIMIT 1').first<{ name: string }>();
			schoolName = firstSchool?.name || '';
		}
	} catch (e) {
		console.warn('Failed to load pengawas school data:', e);
	}

	return { user: locals.user, schoolName };
};

