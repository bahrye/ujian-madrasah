// @ts-nocheck
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB, ensureUserLoginColumns } from '$lib/server/db';

export interface StudentLoginItem {
	id: number;
	name: string;
	username: string;
	nisn: string | null;
	student_session_number: number;
	class_name: string | null;
	room_name: string | null;
	exam_title: string | null;
	is_logged_in: number;
	last_active_at: string | null;
	login_device: string | null;
}

export const load = async ({ platform, locals, url }: Parameters<PageServerLoad>[0]) => {
	if (!locals.user) throw redirect(302, '/login');
	if (!['pengawas', 'guru', 'admin', 'superadmin', 'panitia'].includes(locals.user.role)) {
		throw redirect(302, '/');
	}

	try {
		const db = getDB(platform);
		await ensureUserLoginColumns(db);

		const schoolId = locals.user.school_id;
		const search = url.searchParams.get('q')?.trim() || '';
		const examFilterStr = url.searchParams.get('exam_id') || '';
		const examFilter = parseInt(examFilterStr, 10);
		const sessionFilterStr = url.searchParams.get('session_number') || '';
		const sessionFilter = parseInt(sessionFilterStr, 10);
		const roomFilterStr = url.searchParams.get('room_id') || '';
		const roomFilter = parseInt(roomFilterStr, 10);
		const classFilterStr = url.searchParams.get('class_id') || '';
		const classFilter = parseInt(classFilterStr, 10);
		const statusFilter = url.searchParams.get('status') || ''; // 'active', 'offline', ''
		const scopeFilter = url.searchParams.get('scope') || 'all';

		// 1. Fetch available exams in school
		const examsRes = await db.prepare(`
			SELECT e.id, e.title 
			FROM exams e 
			WHERE e.school_id = ? 
			ORDER BY e.is_active DESC, e.title ASC
		`).bind(schoolId).all<{ id: number; title: string }>();
		const exams = examsRes.results || [];

		// 2. Fetch classes for dropdown filter
		const classesRes = await db.prepare(`
			SELECT id, name FROM classes WHERE school_id = ? ORDER BY name ASC
		`).bind(schoolId).all<{ id: number; name: string }>();

		// 3. Fetch active rooms for dropdown filter
		const roomsRes = await db.prepare(`
			SELECT id, name FROM exam_rooms WHERE school_id = ? AND is_active = 1 ORDER BY name ASC
		`).bind(schoolId).all<{ id: number; name: string }>();

		// 4. Build query for students
		let query = `
			SELECT DISTINCT
				u.id,
				u.name,
				u.username,
				u.nisn,
				COALESCE(u.session_number, 1) as student_session_number,
				COALESCE(c.name, '-') as class_name,
				(
					SELECT er.name 
					FROM exam_participants ep 
					JOIN exam_rooms er ON ep.room_id = er.id 
					WHERE ep.student_id = u.id 
					LIMIT 1
				) as room_name,
				(
					SELECT e.title 
					FROM exam_participants ep 
					JOIN exams e ON ep.exam_id = e.id 
					WHERE ep.student_id = u.id AND e.is_active = 1
					LIMIT 1
				) as exam_title,
				COALESCE(u.is_logged_in, 0) as is_logged_in,
				u.last_active_at,
				u.login_device
			FROM users u
			LEFT JOIN classes c ON u.class_id = c.id
			WHERE u.role = 'siswa' AND u.is_active = 1 AND u.school_id = ?
		`;

		const params: any[] = [schoolId];

		if (scopeFilter === 'proctored' && ['pengawas', 'guru'].includes(locals.user.role)) {
			query += `
				AND u.id IN (
					SELECT epart.student_id
					FROM exam_participants epart
					JOIN exams e ON epart.exam_id = e.id
					JOIN exam_proctors ep ON e.id = ep.exam_id
					WHERE ep.proctor_id = ?
					  AND (ep.room_id IS NULL OR ep.room_id = epart.room_id)
				)
			`;
			params.push(locals.user.id);
		}

		if (!isNaN(examFilter)) {
			query += `
				AND u.id IN (
					SELECT student_id FROM exam_participants WHERE exam_id = ?
				)
			`;
			params.push(examFilter);
		}

		if (!isNaN(sessionFilter)) {
			query += ` AND COALESCE(u.session_number, 1) = ?`;
			params.push(sessionFilter);
		}

		if (!isNaN(roomFilter)) {
			query += `
				AND u.id IN (
					SELECT student_id FROM exam_participants WHERE room_id = ?
				)
			`;
			params.push(roomFilter);
		}

		if (!isNaN(classFilter)) {
			query += ` AND u.class_id = ?`;
			params.push(classFilter);
		}

		if (search) {
			query += ` AND (u.name LIKE ? OR u.username LIKE ? OR u.nisn LIKE ?)`;
			params.push(`%${search}%`, `%${search}%`, `%${search}%`);
		}

		if (statusFilter === 'active') {
			query += ` AND COALESCE(u.is_logged_in, 0) = 1`;
		} else if (statusFilter === 'offline') {
			query += ` AND COALESCE(u.is_logged_in, 0) = 0`;
		}

		query += ` ORDER BY COALESCE(u.is_logged_in, 0) DESC, u.name ASC`;

		const result = await db.prepare(query).bind(...params).all<StudentLoginItem>();
		let students = result.results || [];

		// Fallback: If scopeFilter was 'proctored' but returned 0 students, fallback to all school students
		if (students.length === 0 && scopeFilter === 'proctored' && !search && isNaN(examFilter) && isNaN(roomFilter) && isNaN(classFilter) && !statusFilter) {
			const fallbackResult = await db.prepare(`
				SELECT DISTINCT
					u.id,
					u.name,
					u.username,
					u.nisn,
					COALESCE(u.session_number, 1) as student_session_number,
					COALESCE(c.name, '-') as class_name,
					(
						SELECT er.name 
						FROM exam_participants ep 
						JOIN exam_rooms er ON ep.room_id = er.id 
						WHERE ep.student_id = u.id 
						LIMIT 1
					) as room_name,
					'-' as exam_title,
					COALESCE(u.is_logged_in, 0) as is_logged_in,
					u.last_active_at,
					u.login_device
				FROM users u
				LEFT JOIN classes c ON u.class_id = c.id
				WHERE u.role = 'siswa' AND u.is_active = 1 AND u.school_id = ?
				ORDER BY COALESCE(u.is_logged_in, 0) DESC, u.name ASC
			`).bind(schoolId).all<StudentLoginItem>();

			students = fallbackResult.results || [];
		}

		// Summary stats
		const activeCount = students.filter(s => s.is_logged_in === 1).length;
		const offlineCount = students.filter(s => s.is_logged_in === 0).length;

		return {
			students,
			exams,
			classes: classesRes.results || [],
			rooms: roomsRes.results || [],
			stats: {
				total: students.length,
				active: activeCount,
				offline: offlineCount
			},
			filters: {
				q: search,
				exam_id: isNaN(examFilter) ? '' : String(examFilter),
				session_number: isNaN(sessionFilter) ? '' : String(sessionFilter),
				room_id: isNaN(roomFilter) ? '' : String(roomFilter),
				class_id: isNaN(classFilter) ? '' : String(classFilter),
				status: statusFilter,
				scope: scopeFilter
			}
		};
	} catch (e: any) {
		console.error('Error loading Reset Login page:', e);
		return {
			students: [],
			exams: [],
			classes: [],
			rooms: [],
			stats: { total: 0, active: 0, offline: 0 },
			filters: { q: '', exam_id: '', session_number: '', room_id: '', class_id: '', status: '', scope: 'all' },
			error: e.message || String(e)
		};
	}
};

export const actions = {
	resetLogin: async ({ request, platform, locals }: import('./$types').RequestEvent) => {
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

	resetAllActive: async ({ request, platform, locals }: import('./$types').RequestEvent) => {
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
;null as any as Actions;