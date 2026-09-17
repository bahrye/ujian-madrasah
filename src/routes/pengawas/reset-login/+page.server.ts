import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { formatExamTitle } from '$lib/utils/exam';

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

		// Robust school_id extraction and sanitization
		const rawSchoolId = locals.user.school_id;
		const userSchoolId = (rawSchoolId !== undefined && rawSchoolId !== null && !isNaN(Number(rawSchoolId))) 
			? Number(rawSchoolId) 
			: null;
		
		const isSuperAdmin = locals.user.role === 'superadmin' || userSchoolId === null;
		const userId = Number(locals.user.id);

		const search = url.searchParams.get('q')?.trim() || '';
		const examFilterStr = url.searchParams.get('exam_id') || '';
		const examFilter = parseInt(examFilterStr, 10);
		const sessionFilterStr = url.searchParams.get('session_number') || '';
		const sessionFilter = parseInt(sessionFilterStr, 10);

		// 1. Fetch available exams specifically monitored by this proctor
		let rawExams: any[] = [];

		if (isSuperAdmin || locals.user.role === 'admin') {
			const examsQuery = userSchoolId !== null 
				? `SELECT e.id, e.title, s.name as subject_name, et.code as exam_type_code, c.name as class_name 
				   FROM exams e 
				   LEFT JOIN subjects s ON e.subject_id = s.id
				   LEFT JOIN exam_types et ON e.exam_type_id = et.id
				   LEFT JOIN classes c ON e.class_id = c.id
				   WHERE e.school_id = ? 
				   ORDER BY e.is_active DESC, e.title ASC`
				: `SELECT e.id, e.title, s.name as subject_name, et.code as exam_type_code, c.name as class_name 
				   FROM exams e 
				   LEFT JOIN subjects s ON e.subject_id = s.id
				   LEFT JOIN exam_types et ON e.exam_type_id = et.id
				   LEFT JOIN classes c ON e.class_id = c.id
				   ORDER BY e.is_active DESC, e.title ASC`;
			const examsParams = userSchoolId !== null ? [userSchoolId] : [];
			const examsRes = await db.prepare(examsQuery).bind(...examsParams).all<any>();
			rawExams = examsRes.results || [];
		} else {
			// For pengawas / guru / panitia role: fetch exams assigned to this proctor
			const proctorExamsRes = await db.prepare(`
				SELECT DISTINCT e.id, e.title, e.is_active, s.name as subject_name, et.code as exam_type_code, c.name as class_name 
				FROM exams e 
				JOIN exam_proctors ep ON e.id = ep.exam_id AND ep.proctor_id = ? AND COALESCE(ep.proctor_role, 'p1') NOT IN ('pt', 'cm')
				LEFT JOIN subjects s ON e.subject_id = s.id
				LEFT JOIN exam_types et ON e.exam_type_id = et.id
				LEFT JOIN classes c ON e.class_id = c.id
				WHERE e.school_id = ?
				ORDER BY e.is_active DESC, e.title ASC
			`).bind(userId, userSchoolId).all<any>();

			rawExams = proctorExamsRes.results || [];
		}

		let exams: { id: number; title: string }[] = rawExams.map((e: any) => ({
			id: e.id,
			title: formatExamTitle({
				title: e.title,
				examTypeCode: e.exam_type_code,
				subjectName: e.subject_name,
				className: e.class_name
			})
		}));

		const allowedExamIds = rawExams.map((e: any) => e.id);

		// REQUIRE EXAM SELECTION FIRST
		// If no exam selected or not authorized, return empty students list with prompt
		if (isNaN(examFilter) || (!isSuperAdmin && locals.user.role !== 'admin' && !allowedExamIds.includes(examFilter))) {
			return {
				students: [],
				exams,
				availableSessions: [],
				hasExamSelected: false,
				stats: { total: 0, active: 0, offline: 0 },
				filters: {
					q: search,
					exam_id: '',
					session_number: ''
				}
			};
		}

		// 2. Fetch available sessions for the selected exam
		let availableSessions: number[] = [];
		const dbSessions = await db.prepare(`
			SELECT DISTINCT session_number FROM exam_sessions WHERE exam_id = ? ORDER BY session_number
		`).bind(examFilter).all<{ session_number: number }>();

		if (dbSessions.results && dbSessions.results.length > 0) {
			availableSessions = dbSessions.results.map(s => s.session_number);
		} else {
			// Check if participants in this exam have session_number > 1
			const studentSessions = await db.prepare(`
				SELECT DISTINCT COALESCE(u.session_number, 1) as session_number
				FROM exam_participants ep
				JOIN users u ON ep.student_id = u.id
				WHERE ep.exam_id = ?
				ORDER BY session_number
			`).bind(examFilter).all<{ session_number: number }>();

			if (studentSessions.results && studentSessions.results.length > 1) {
				availableSessions = studentSessions.results.map(s => s.session_number);
			}
		}

		// Restrict sessions if proctor has specific session assignment
		if (!isSuperAdmin && ['pengawas', 'guru'].includes(locals.user.role)) {
			const proctorAssignment = await db.prepare(`
				SELECT sessions FROM exam_proctors WHERE exam_id = ? AND proctor_id = ? AND COALESCE(proctor_role, 'p1') NOT IN ('pt', 'cm')
			`).bind(examFilter, userId).first<{ sessions: string | null }>();

			if (proctorAssignment?.sessions) {
				try {
					const parsed = JSON.parse(proctorAssignment.sessions);
					if (Array.isArray(parsed) && parsed.length > 0) {
						const allowed = parsed.map((s: any) => parseInt(s, 10));
						if (availableSessions.length > 0) {
							availableSessions = availableSessions.filter(sn => allowed.includes(sn));
						} else {
							availableSessions = allowed;
						}
					}
				} catch (e) {}
			}
		}

		// Sort available sessions
		availableSessions.sort((a, b) => a - b);

		// 3. Build query for students in this selected exam
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
					WHERE ep.student_id = u.id AND ep.exam_id = ?
					LIMIT 1
				) as room_name,
				(
					SELECT e.title 
					FROM exams e 
					WHERE e.id = ?
				) as exam_title,
				COALESCE(u.is_logged_in, 0) as is_logged_in,
				u.last_active_at,
				u.login_device
			FROM users u
			JOIN exam_participants ep ON u.id = ep.student_id
			LEFT JOIN classes c ON u.class_id = c.id
			WHERE ep.exam_id = ? AND u.role = 'siswa' AND u.is_active = 1
		`;

		const params: any[] = [examFilter, examFilter, examFilter];

		let activeSessionFilter: number | null = null;
		if (!isNaN(sessionFilter) && availableSessions.length > 0 && availableSessions.includes(sessionFilter)) {
			activeSessionFilter = sessionFilter;
		}

		if (activeSessionFilter !== null) {
			query += ` AND COALESCE(u.session_number, 1) = ?`;
			params.push(activeSessionFilter);
		}

		if (search) {
			query += ` AND (u.name LIKE ? OR u.username LIKE ? OR u.nisn LIKE ?)`;
			params.push(`%${search}%`, `%${search}%`, `%${search}%`);
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
			availableSessions,
			hasExamSelected: true,
			stats: {
				total: students.length,
				active: activeCount,
				offline: offlineCount
			},
			filters: {
				q: search,
				exam_id: String(examFilter),
				session_number: activeSessionFilter !== null ? String(activeSessionFilter) : ''
			}
		};
	} catch (e: any) {
		console.error('Error loading Reset Login page:', e);
		return {
			students: [],
			exams: [],
			availableSessions: [],
			hasExamSelected: false,
			stats: { total: 0, active: 0, offline: 0 },
			filters: { q: '', exam_id: '', session_number: '' },
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
			const student = await db.prepare('SELECT name FROM users WHERE id = ? AND role = \'siswa\'')
				.bind(studentId)
				.first<{ name: string }>();

			if (!student) {
				return fail(404, { error: 'Data siswa tidak ditemukan.' });
			}

			await db.prepare(`
				UPDATE users 
				SET is_logged_in = 0, session_token = NULL 
				WHERE id = ?
			`).bind(studentId).run();

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
			const rawSchoolId = locals.user.school_id;
			const userSchoolId = (rawSchoolId !== undefined && rawSchoolId !== null && !isNaN(Number(rawSchoolId))) 
				? Number(rawSchoolId) 
				: null;

			let query = `UPDATE users SET is_logged_in = 0, session_token = NULL WHERE role = 'siswa' AND is_logged_in = 1`;
			const params: any[] = [];

			if (userSchoolId !== null) {
				query += ` AND school_id = ?`;
				params.push(userSchoolId);
			}

			const result = await db.prepare(query).bind(...params).run();

			return { success: `Berhasil me-reset seluruh login siswa yang sedang aktif (${result.meta.changes || 0} siswa).` };
		} catch (e: any) {
			console.error('Reset all login error:', e);
			return fail(500, { error: e.message || 'Gagal me-reset seluruh login siswa.' });
		}
	}
};
