import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { ensureActivityLogTable } from '$lib/server/activity-log';

export interface ActivityLogItem {
	id: number;
	school_id: number | null;
	user_id: number | null;
	user_name: string | null;
	user_role: string | null;
	action: string;
	detail: string | null;
	ip_address: string | null;
	created_at: string;
}

export const load: PageServerLoad = async ({ platform, locals, url }) => {
	if (!locals.user) throw redirect(302, '/login');
	if (!['admin', 'superadmin', 'panitia'].includes(locals.user.role)) {
		throw redirect(302, '/');
	}

	const db = getDB(platform);
	await ensureActivityLogTable(db);

	const search = url.searchParams.get('q')?.trim() || '';
	const rawSchoolId = locals.user.school_id;
	const userSchoolId = (rawSchoolId !== undefined && rawSchoolId !== null && !isNaN(Number(rawSchoolId))) 
		? Number(rawSchoolId) 
		: null;

	try {
		let query = `
			SELECT id, school_id, user_id, user_name, user_role, action, detail, ip_address, created_at
			FROM activity_logs
			WHERE 1=1
		`;
		const params: any[] = [];

		if (userSchoolId !== null) {
			query += ` AND school_id = ?`;
			params.push(userSchoolId);
		}

		if (search) {
			query += ` AND (
				user_name LIKE ? 
				OR action LIKE ? 
				OR detail LIKE ? 
				OR ip_address LIKE ? 
				OR user_role LIKE ?
			)`;
			const searchPattern = `%${search}%`;
			params.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
		}

		query += ` ORDER BY id DESC LIMIT 300`;

		const result = await db.prepare(query).bind(...params).all<ActivityLogItem>();
		const logs = result.results || [];

		return {
			logs,
			searchQuery: search
		};
	} catch (e: any) {
		console.error('Error loading activity logs:', e);
		return {
			logs: [],
			searchQuery: search,
			error: e.message || String(e)
		};
	}
};
