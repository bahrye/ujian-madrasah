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

export interface ActivityLogPagination {
	page: number;
	pageSize: number;
	totalCount: number;
	totalPages: number;
}

export const load: PageServerLoad = async ({ platform, locals, url }) => {
	if (!locals.user) throw redirect(302, '/login');
	if (!['admin', 'superadmin', 'panitia'].includes(locals.user.role)) {
		throw redirect(302, '/');
	}

	const db = getDB(platform);
	await ensureActivityLogTable(db);

	const search = url.searchParams.get('q')?.trim() || '';
	const rawPage = parseInt(url.searchParams.get('page') || '1', 10);
	const currentPage = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
	const pageSize = 50;

	const rawSchoolId = locals.user.school_id;
	const userSchoolId = (rawSchoolId !== undefined && rawSchoolId !== null && !isNaN(Number(rawSchoolId))) 
		? Number(rawSchoolId) 
		: null;

	try {
		let whereClause = 'WHERE 1=1';
		const params: any[] = [];

		if (userSchoolId !== null) {
			whereClause += ` AND school_id = ?`;
			params.push(userSchoolId);
		}

		if (search) {
			whereClause += ` AND (
				user_name LIKE ? 
				OR action LIKE ? 
				OR detail LIKE ? 
				OR ip_address LIKE ? 
				OR user_role LIKE ?
			)`;
			const searchPattern = `%${search}%`;
			params.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
		}

		// 1. Hitung total data log yang sesuai filter
		const countQuery = `SELECT COUNT(*) as total FROM activity_logs ${whereClause}`;
		const countResult = await db.prepare(countQuery).bind(...params).first<{ total: number }>();
		const totalCount = countResult?.total ?? 0;
		const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
		const validPage = Math.min(Math.max(1, currentPage), totalPages);
		const offset = (validPage - 1) * pageSize;

		// 2. Ambil data dengan batas 50 item per halaman
		const dataQuery = `
			SELECT id, school_id, user_id, user_name, user_role, action, detail, ip_address, created_at
			FROM activity_logs
			${whereClause}
			ORDER BY id DESC
			LIMIT ? OFFSET ?
		`;
		const dataParams = [...params, pageSize, offset];
		const result = await db.prepare(dataQuery).bind(...dataParams).all<ActivityLogItem>();
		const logs = result.results || [];

		return {
			logs,
			searchQuery: search,
			pagination: {
				page: validPage,
				pageSize,
				totalCount,
				totalPages
			}
		};
	} catch (e: any) {
		console.error('Error loading activity logs:', e);
		return {
			logs: [],
			searchQuery: search,
			pagination: {
				page: 1,
				pageSize: 50,
				totalCount: 0,
				totalPages: 1
			},
			error: e.message || String(e)
		};
	}
};
