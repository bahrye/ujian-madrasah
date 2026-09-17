import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load: LayoutServerLoad = async ({ locals, url, platform }) => {
	if (!locals.user || (locals.user.role !== 'admin' && locals.user.role !== 'panitia')) {
		throw redirect(302, '/login');
	}

	if (locals.user.role === 'panitia') {
		const restrictedPaths = ['/admin/school-profile', '/admin/users', '/admin/students', '/admin/classes'];
		if (restrictedPaths.some(path => url.pathname.startsWith(path))) {
			throw redirect(302, '/admin');
		}
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
		console.warn('Failed to load admin school data:', e);
	}

	return { user: locals.user, schoolName };
};
