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

export const load: PageServerLoad = async ({ platform, locals, url }) => {
	if (!locals.user) throw redirect(302, '/login');
	if (!['pengawas', 'guru', 'admin', 'superadmin', 'panitia'].includes(locals.user.role)) {
		throw redirect(302, '/');
	}

	try {
		const db = getDB(platform);
		await ensureUserLoginColumns(db);

		const schoolId = locals.user.school_id;
		const isProctorRole = ['pengawas', 'guru'].includes(locals.user.role);

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

		// Query available exams for filter dropdown
		let exams: { id: number; title: string }[] = [];
		if (isProctorRole) {
			const res = await db.prepare(`
				SELECT DISTINCT e.id, e.title 
				FROM exams e 
				JOIN exam_proctors ep ON e.id = ep.exam_id
				WHERE e.is_active = 1 AND e.school_id = ? AND ep.proctor_id = ?
				ORDER BY e.title
			`).bind(schoolId, locals.user.id).all<{ id: number; title: string }>();
			exams = res.results || [];
		} else {
			const res = await db.prepare(`
				SELECT e.id, e.title FROM exams e WHERE e.is_active = 1 AND e.school_id = ? ORDER BY e.title
			`).bind(schoolId).all<{ id: number; title: string }>();
			exams = res.results || [];
		}

		// Query classes for dropdown filter
		const classesRes = await db.prepare(`
			SELECT id, name FROM classes WHERE school_id = ? ORDER BY name ASC
		`).bind(schoolId).all<{ id: number; name: string }>();

		// Query active rooms for dropdown filter
		const roomsRes = await db.prepare(`
			SELECT id, name FROM exam_rooms WHERE school_id = ? AND is_active = 1 ORDER BY name ASC
		`).bind(schoolId).all<{ id: number; name: string }>();

		// Determine allowed proctor sessions if proctor
		let allowedProctorSessions: number[] | null = null;
		if (isProctorRole && !isNaN(examFilter)) {
			const proctorAssignment = await db.prepare(`
				SELECT sessions FROM exam_proctors WHERE exam_id = ? AND proctor_id = ?
			`).bind(examFilter, locals.user.id).first<{ sessions: string | null }>();

			if (proctorAssignment?.sessions) {
				try {
					const parsed = JSON.parse(proctorAssignment.sessions);
					if (Array.isArray(parsed) && parsed.length > 0) {
						allowedProctorSessions = parsed.map((s: any) => parseInt(s, 10));
					}
				} catch (e) {}
			}
		}

		// Build student query
		let query = '';
		const params: any[] = [];

		if (isProctorRole) {
			query = `
				SELECT DISTINCT
					u.id,
					u.name,
					u.username,
					u.nisn,
					COALESCE(u.session_number, 1) as student_session_number,
					COALESCE(c.name, '-') as class_name,
					er.name as room_name,
					e.title as exam_title,
					COALESCE(u.is_logged_in, 0) as is_logged_in,
					u.last_active_at,
					u.login_device
				FROM exam_participants epart
				JOIN users u ON epart.student_id = u.id
				JOIN exams e ON epart.exam_id = e.id AND e.is_active = 1
				JOIN exam_proctors ep ON e.id = ep.exam_id AND ep.proctor_id = ?
				LEFT JOIN classes c ON u.class_id = c.id
				LEFT JOIN exam_rooms er ON epart.room_id = er.id
				WHERE u.role = 'siswa' AND u.is_active = 1 AND e.school_id = ?
				  AND (ep.room_id IS NULL OR ep.room_id = epart.room_id)
			`;
			params.push(locals.user.id, schoolId);

			if (!isNaN(examFilter)) {
				query += ` AND epart.exam_id = ?`;
				params.push(examFilter);
			}

			if (!isNaN(sessionFilter)) {
				query += ` AND COALESCE(u.session_number, 1) = ?`;
				params.push(sessionFilter);
			} else if (allowedProctorSessions && allowedProctorSessions.length > 0) {
				const placeholders = allowedProctorSessions.map(() => '?').join(',');
				query += ` AND COALESCE(u.session_number, 1) IN (${placeholders})`;
				params.push(...allowedProctorSessions);
			}
		} else {
			// Admin / Superadmin / Panitia
			if (!isNaN(examFilter)) {
				query = `
					SELECT DISTINCT
						u.id,
						u.name,
						u.username,
						u.nisn,
						COALESCE(u.session_number, 1) as student_session_number,
						COALESCE(c.name, '-') as class_name,
						er.name as room_name,
						e.title as exam_title,
						COALESCE(u.is_logged_in, 0) as is_logged_in,
						u.last_active_at,
						u.login_device
					FROM exam_participants epart
					JOIN users u ON epart.student_id = u.id
					JOIN exams e ON epart.exam_id = e.id
					LEFT JOIN classes c ON u.class_id = c.id
					LEFT JOIN exam_rooms er ON epart.room_id = er.id
					WHERE u.role = 'siswa' AND u.is_active = 1 AND e.school_id = ? AND epart.exam_id = ?
				`;
				params.push(schoolId, examFilter);

				if (!isNaN(sessionFilter)) {
					query += ` AND COALESCE(u.session_number, 1) = ?`;
					params.push(sessionFilter);
				}
			} else {
				query = `
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
				`;
				params.push(schoolId);

				if (!isNaN(sessionFilter)) {
					query += ` AND COALESCE(u.session_number, 1) = ?`;
					params.push(sessionFilter);
				}
			}
		}

		if (!isNaN(roomFilter)) {
			if (isProctorRole || !isNaN(examFilter)) {
				query += ` AND epart.room_id = ?`;
				params.push(roomFilter);
			} else {
				query += ` AND u.id IN (SELECT student_id FROM exam_participants WHERE room_id = ?)`;
				params.push(roomFilter);
			}
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
		const students = result.results || [];

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
				status: statusFilter
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
			filters: { q: '', exam_id: '', session_number: '', room_id: '', class_id: '', status: '' },
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

	resetAllActive: async ({ request, platform, locals }) => {
		if (!locals.user) return fail(401, { error: 'Unauthorized' });
		const db = getDB(platform);

		try {
			await ensureUserLoginColumns(db);
			const isProctorRole = ['pengawas', 'guru'].includes(locals.user.role);

			let result: any;
			if (isProctorRole) {
				result = await db.prepare(`
					UPDATE users 
					SET is_logged_in = 0, session_token = NULL 
					WHERE role = 'siswa' AND school_id = ? AND is_logged_in = 1
					  AND id IN (
						SELECT epart.student_id 
						FROM exam_participants epart
						JOIN exams e ON epart.exam_id = e.id AND e.is_active = 1
						JOIN exam_proctors ep ON e.id = ep.exam_id AND ep.proctor_id = ?
						WHERE (ep.room_id IS NULL OR ep.room_id = epart.room_id)
					  )
				`).bind(locals.user.school_id, locals.user.id).run();
			} else {
				result = await db.prepare(`
					UPDATE users 
					SET is_logged_in = 0, session_token = NULL 
					WHERE role = 'siswa' AND school_id = ? AND is_logged_in = 1
				`).bind(locals.user.school_id).run();
			}

			return { success: `Berhasil me-reset seluruh login siswa yang sedang aktif (${result.meta.changes || 0} siswa).` };
		} catch (e: any) {
			console.error('Reset all login error:', e);
			return fail(500, { error: e.message || 'Gagal me-reset seluruh login siswa.' });
		}
	}
};
