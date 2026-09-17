import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load: LayoutServerLoad = async ({ platform, locals }) => {
	if (!locals.user || locals.user.role !== 'guru') {
		throw redirect(302, '/login');
	}

	const db = getDB(platform);
	let isProctor = false;
	let schoolName = '';
	try {
		let schoolId = locals.user.school_id;
		if (!schoolId) {
			const u = await db.prepare('SELECT school_id FROM users WHERE id = ?')
				.bind(locals.user.id)
				.first<{ school_id: number | null }>();
			schoolId = u?.school_id ?? null;
		}

		const [proctorCountRes, schoolRes] = await Promise.all([
			schoolId
				? db.prepare(`
					SELECT COUNT(*) as c 
					FROM exam_proctors ep
					JOIN exams e ON ep.exam_id = e.id
					JOIN exam_types et ON e.exam_type_id = et.id
					WHERE ep.proctor_id = ? AND COALESCE(ep.proctor_role, 'p1') NOT IN ('pt', 'cm') AND e.school_id = ? AND e.is_active = 1 AND et.is_active = 1
				`).bind(locals.user.id, schoolId).first<{ c: number }>()
				: Promise.resolve({ c: 0 }),
			schoolId
				? db.prepare('SELECT name FROM schools WHERE id = ?').bind(schoolId).first<{ name: string }>()
				: db.prepare('SELECT name FROM schools ORDER BY id ASC LIMIT 1').first<{ name: string }>()
		]);

		isProctor = (proctorCountRes?.c || 0) > 0;
		schoolName = schoolRes?.name || '';
	} catch (e) {
		console.warn('Failed to load guru layout data:', e);
	}

	return { 
		user: locals.user,
		isProctor,
		schoolName
	};
};
