import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB, ensureUserLoginColumns } from '$lib/server/db';

export interface StudentLoginItem {
	id: number;
	name: string;
	username: string;
	nisn: string | null;
	class_name: string | null;
	room_name: string | null;
	is_logged_in: number;
	last_active_at: string | null;
	login_device: string | null;
}

export const load: PageServerLoad = async ({ platform, locals, url }) => {
	if (!locals.user) throw redirect(302, '/login');
	if (!['pengawas', 'guru', 'admin', 'superadmin', 'panitia'].includes(locals.user.role)) {
		throw redirect(302, '/');
	}

	try {
		const db = getDB(platform);
		await ensureUserLoginColumns(db);

		const schoolId = locals.user.school_id;
		const search = url.searchParams.get('q')?.trim() || '';
		const classFilter = url.searchParams.get('class_id') || '';
		const statusFilter = url.searchParams.get('status') || ''; // 'active', 'offline', or ''

		// Query classes for dropdown filter
		const classes = await db.prepare(`
			SELECT id, name FROM classes WHERE school_id = ? ORDER BY name ASC
		`).bind(schoolId).all<{ id: number; name: string }>();

		// Query active rooms for dropdown filter
		const rooms = await db.prepare(`
			SELECT id, name FROM exam_rooms WHERE school_id = ? AND is_active = 1 ORDER BY name ASC
		`).bind(schoolId).all<{ id: number; name: string }>();

		// Build dynamic query for students
		let query = `
			SELECT 
				u.id,
				u.name,
				u.username,
				u.nisn,
				COALESCE(c.name, '-') as class_name,
				(
					SELECT er.name 
					FROM exam_participants ep 
					JOIN exam_rooms er ON ep.room_id = er.id 
					WHERE ep.student_id = u.id 
					LIMIT 1
				) as room_name,
				COALESCE(u.is_logged_in, 0) as is_logged_in,
				u.last_active_at,
				u.login_device
			FROM users u
			LEFT JOIN classes c ON u.class_id = c.id
			WHERE u.role = 'siswa' AND u.is_active = 1
		`;

		const params: any[] = [];
		if (schoolId) {
			query += ` AND u.school_id = ?`;
			params.push(schoolId);
		}

		if (search) {
			query += ` AND (u.name LIKE ? OR u.username LIKE ? OR u.nisn LIKE ?)`;
			params.push(`%${search}%`, `%${search}%`, `%${search}%`);
		}

		if (classFilter && !isNaN(parseInt(classFilter, 10))) {
			query += ` AND u.class_id = ?`;
			params.push(parseInt(classFilter, 10));
		}

		if (statusFilter === 'active') {
			query += ` AND COALESCE(u.is_logged_in, 0) = 1`;
		} else if (statusFilter === 'offline') {
			query += ` AND COALESCE(u.is_logged_in, 0) = 0`;
		}

		query += ` ORDER BY COALESCE(u.is_logged_in, 0) DESC, u.name ASC`;

		const result = await db.prepare(query).bind(...params).all<StudentLoginItem>();
		const students = result.results || [];

		// Count summary statistics
		const activeCount = students.filter(s => s.is_logged_in === 1).length;
		const offlineCount = students.filter(s => s.is_logged_in === 0).length;

		return {
			students,
			classes: classes.results || [],
			rooms: rooms.results || [],
			stats: {
				total: students.length,
				active: activeCount,
				offline: offlineCount
			},
			filters: {
				q: search,
				class_id: classFilter,
				status: statusFilter
			}
		};
	} catch (e: any) {
		console.error('Error loading Reset Login page:', e);
		return {
			students: [],
			classes: [],
			rooms: [],
			stats: { total: 0, active: 0, offline: 0 },
			filters: { q: '', class_id: '', status: '' },
			error: e.message || String(e)
		};
	}
};

export const actions: Actions = {
	resetLogin: async ({ request, platform, locals }) => {
		if (!locals.user) return fail(401, { error: 'Unauthorized' });
		const db = getDB(platform);
		const formData = await request.formData();
		const studentIdStr = formData.get('student_id')?.toString();
		const studentId = parseInt(studentIdStr || '', 10);

		if (isNaN(studentId)) {
			return fail(400, { error: 'ID Siswa tidak valid.' });
		}

		try {
			await ensureUserLoginColumns(db);
			
			// Get student name for success message
			const student = await db.prepare('SELECT name FROM users WHERE id = ? AND school_id = ? AND role = \'siswa\'')
				.bind(studentId, locals.user.school_id)
				.first<{ name: string }>();

			if (!student) {
				return fail(404, { error: 'Data siswa tidak ditemukan.' });
			}

			await db.prepare(`
				UPDATE users 
				SET is_logged_in = 0, session_token = NULL 
				WHERE id = ? AND school_id = ?
			`).bind(studentId, locals.user.school_id).run();

			return { success: `Login siswa "${student.name}" berhasil di-reset. Siswa sekarang dapat login kembali.` };
		} catch (e: any) {
			console.error('Reset login error:', e);
			return fail(500, { error: e.message || 'Gagal me-reset login siswa.' });
		}
	},

	resetAllActive: async ({ platform, locals }) => {
		if (!locals.user) return fail(401, { error: 'Unauthorized' });
		const db = getDB(platform);

		try {
			await ensureUserLoginColumns(db);
			const result = await db.prepare(`
				UPDATE users 
				SET is_logged_in = 0, session_token = NULL 
				WHERE role = 'siswa' AND school_id = ? AND is_logged_in = 1
			`).bind(locals.user.school_id).run();

			return { success: `Berhasil me-reset seluruh login siswa yang sedang aktif (${result.meta.changes || 0} siswa).` };
		} catch (e: any) {
			console.error('Reset all login error:', e);
			return fail(500, { error: e.message || 'Gagal me-reset seluruh login siswa.' });
		}
	}
};
