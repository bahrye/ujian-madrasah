// @ts-nocheck
import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';

import { formatExamTitle } from '$lib/utils/exam';

export interface StudentScheduleItem {
	id: number;
	title: string;
	duration_minutes: number;
	start_time: string | null;
	end_time: string | null;
	is_active: number;
	subject: string | null;
	exam_type_code?: string | null;
	class_name?: string | null;
	class_level?: string | number | null;
	proctors: string | null;
	question_count: number;
	session_number?: number;
	session_start_time?: string | null;
	session_end_time?: string | null;
	room_name?: string | null;
	has_sessions?: number;
	ep_session_number?: number;
	attempt_status?: string | null;
}

export const load = async ({ platform, locals }: Parameters<PageServerLoad>[0]) => {
	if (locals.user?.role !== 'siswa') throw redirect(302, '/');

	const db = getDB(platform);

	// Ambil semua ujian yang diikuti siswa ini
	// Dan gabungkan dengan nama pengawas serta sesi siswa
	const examsQuery = await db.prepare(`
		SELECT 
			e.*, 
			s.name as subject,
			et.code as exam_type_code,
			c.name as class_name,
			c.level as class_level,
			(
				SELECT status 
				FROM student_attempts 
				WHERE exam_id = e.id AND student_id = ? 
				ORDER BY created_at DESC LIMIT 1
			) as attempt_status,
			COALESCE(
				(
					SELECT GROUP_CONCAT(u.name, '||')
					FROM exam_proctors epr
					JOIN users u ON epr.proctor_id = u.id
					WHERE epr.exam_id = e.id
				),
				(
					SELECT u.name FROM users u WHERE u.id = e.created_by AND u.role = 'guru'
				)
			) as proctors,
			(SELECT COUNT(*) FROM questions WHERE exam_id = e.id) as question_count,
			u.session_number as ep_session_number,
			r.name as room_name,
			(SELECT COUNT(*) FROM exam_sessions WHERE exam_id = e.id) > 0 as has_sessions
		FROM exams e
		JOIN exam_participants ep ON e.id = ep.exam_id
		JOIN users u ON ep.student_id = u.id
		LEFT JOIN classes c ON u.class_id = c.id
		LEFT JOIN exam_rooms r ON ep.room_id = r.id
		LEFT JOIN subjects s ON e.subject_id = s.id
		JOIN exam_types et ON e.exam_type_id = et.id
		WHERE ep.student_id = ? AND e.school_id = ? AND e.is_active = 1 AND et.is_active = 1
		ORDER BY CASE WHEN e.start_time IS NULL THEN 1 ELSE 0 END, e.start_time ASC, e.created_at DESC
	`).bind(locals.user.id, locals.user.id, locals.user.school_id).all<StudentScheduleItem>();

	let rawSchedules = examsQuery.results || [];
	let schedules = rawSchedules.map(item => ({
		...item,
		title: formatExamTitle({
			title: item.title,
			examTypeCode: item.exam_type_code,
			subjectName: item.subject,
			className: item.class_name,
			classLevel: item.class_level
		})
	}));
	
	// Fetch student's session_number
	let studentSession = 1;
	try {
		const studentRecord = await db.prepare('SELECT session_number FROM users WHERE id = ?').bind(locals.user.id).first<{ session_number: number }>();
		if (studentRecord && studentRecord.session_number) {
			studentSession = studentRecord.session_number;
		}
	} catch (e) {
		console.warn('Failed to fetch session_number:', e);
	}

	// Helper function to enrich an array of exams with session times
	const enrichExamsWithSessions = async (examsList: any[]) => {
		if (!examsList || examsList.length === 0) return examsList;
		const examIds = examsList.map(s => s.id);
		const placeholders = examIds.map(() => '?').join(',');
		let sessionsResults: any[] = [];
		try {
			const sessionsQuery = await db.prepare(`SELECT * FROM exam_sessions WHERE exam_id IN (${placeholders}) ORDER BY session_number ASC`)
				.bind(...examIds).all<any>();
			sessionsResults = sessionsQuery.results || [];
		} catch (e) {
			console.warn('Failed to fetch exam_sessions:', e);
		}

		const sessionsByExam = new Map<number, any[]>();
		for (const row of sessionsResults) {
			if (!sessionsByExam.has(row.exam_id)) {
				sessionsByExam.set(row.exam_id, []);
			}
			sessionsByExam.get(row.exam_id)!.push(row);
		}

		return examsList.map(schedule => {
			const examSessions = sessionsByExam.get(schedule.id) || [];
			if (schedule.has_sessions && examSessions.length > 0) {
				const targetSession = schedule.ep_session_number || studentSession;
				const matchedSession = examSessions.find(s => s.session_number === targetSession) || examSessions[0];
				return {
					...schedule,
					session_number: matchedSession.session_number,
					session_start_time: matchedSession.start_time,
					session_end_time: matchedSession.end_time,
					start_time: matchedSession.start_time || schedule.start_time,
					end_time: matchedSession.end_time || schedule.end_time,
				};
			}
			return schedule;
		});
	};

	const enrichedSchedules = await enrichExamsWithSessions(schedules);

	return {
		schedules: enrichedSchedules
	};
};
