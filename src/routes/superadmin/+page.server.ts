import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load: PageServerLoad = async ({ platform }) => {
	const db = getDB(platform);

	// Get total schools
	const totalSchoolsRes = await db.prepare('SELECT COUNT(*) as count FROM schools').first();
	const totalSchools = (totalSchoolsRes?.count as number) || 0;

	// Get total admins
	const totalAdminsRes = await db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'admin'").first();
	const totalAdmins = (totalAdminsRes?.count as number) || 0;

	// Get recent schools
	const { results: recentSchools } = await db.prepare('SELECT * FROM schools ORDER BY created_at DESC LIMIT 5').all();

	return {
		totalSchools,
		totalAdmins,
		recentSchools
	};
};
