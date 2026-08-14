import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load: LayoutServerLoad = async ({ platform, locals }) => {
	if (!locals.user || locals.user.role !== 'guru') {
		throw redirect(302, '/login');
	}

	const db = getDB(platform);
	let isProctor = false;
	try {
		const proctorCountRes = await db.prepare(`
			SELECT COUNT(*) as c 
			FROM exam_proctors ep
			JOIN exams e ON ep.exam_id = e.id
			JOIN exam_types et ON e.exam_type_id = et.id
			WHERE ep.proctor_id = ? AND e.school_id = ? AND e.is_active = 1 AND et.is_active = 1
		`).bind(locals.user.id, locals.user.school_id).first<{ c: number }>();

		isProctor = (proctorCountRes?.c || 0) > 0;
	} catch (e) {
		console.warn('Failed to check teacher proctor status:', e);
	}

	return { 
		user: locals.user,
		isProctor
	};
};
