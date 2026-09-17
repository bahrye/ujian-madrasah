import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { formatExamTitle } from '$lib/utils/exam';
import { finalizeExpiredAttempts } from '$lib/server/exam-finalize';

export const load: PageServerLoad = async ({ platform, locals }) => {
	if (!locals.user) throw redirect(302, '/login');

	try {
		const db = getDB(platform);
		const userId = locals.user.id;
		const schoolId = locals.user.school_id || 0;

		// Auto-finalize attempt yang sudah habis waktunya
		await finalizeExpiredAttempts(db, { schoolId });

		// Ujian aktif yang tokennya sudah dirilis
		const activeExamsRes = await db.prepare(`
			SELECT DISTINCT 
				e.*, 
				s.name as subject,
				et.code as exam_type_code,
				c.name as class_name,
				c.level as class_level,
				(SELECT COUNT(*) FROM exam_sessions WHERE exam_id = e.id) > 0 as has_sessions,
				COALESCE(
					(
						SELECT GROUP_CONCAT(u.name, '||')
						FROM exam_proctors epr
						JOIN users u ON epr.proctor_id = u.id
						WHERE epr.exam_id = e.id AND COALESCE(epr.proctor_role, 'p1') NOT IN ('pt', 'cm')
					),
					(
						SELECT u.name FROM users u WHERE u.id = e.created_by AND u.role = 'guru'
					)
				) as proctors,
				(SELECT COUNT(*) FROM questions WHERE exam_id = e.id) as question_count
			FROM exams e
			JOIN exam_participants ep ON ep.exam_id = e.id
			JOIN users usr ON ep.student_id = usr.id
			LEFT JOIN classes c ON usr.class_id = c.id
			LEFT JOIN subjects s ON e.subject_id = s.id
			JOIN exam_types et ON e.exam_type_id = et.id
			WHERE e.is_active = 1 AND et.is_active = 1
			AND e.school_id = ?
			AND ep.student_id = ?
		`).bind(schoolId, userId).all();

		const activeExams = (activeExamsRes.results || []).map((e: any) => ({
			...e,
			title: formatExamTitle({
				title: e.title,
				examTypeCode: e.exam_type_code,
				subjectName: e.subject,
				className: e.class_name,
				classLevel: e.class_level
			})
		}));

		// Riwayat Ujian (dan yang sedang berjalan)
		const myAttemptsRes = await db.prepare(`
			SELECT sa.*, 
			       COALESCE(sa.is_score_released, 0) as student_is_score_released,
			       COALESCE(sa.is_graded, 0) as is_graded,
			       e.title as exam_title, 
			       s.name as subject, 
			       et.code as exam_type_code, 
			       c.name as class_name, 
			       c.level as class_level, 
			       e.duration_minutes, 
			       e.show_score_type, 
			       e.is_score_released as exam_is_score_released, 
			       e.end_time as exam_end_time, 
			       et.end_time as exam_type_end_time,
			       (SELECT COUNT(*) FROM questions q_m WHERE q_m.exam_id = e.id AND q_m.type IN ('essay', 'isian_singkat')) as manual_question_count,
			       (SELECT COUNT(*) FROM student_answers sa_u 
			        JOIN questions q_u ON sa_u.question_id = q_u.id 
			        WHERE sa_u.attempt_id = sa.id 
			        AND q_u.type IN ('essay', 'isian_singkat') 
			        AND sa_u.score_given IS NULL) as ungraded_count,
			       (SELECT SUM(score_given) FROM student_answers sa2 JOIN questions q2 ON sa2.question_id = q2.id WHERE sa2.attempt_id = sa.id AND q2.type IN ('pilihan_ganda', 'benar_salah', 'menjodohkan', 'pilihan_ganda_kompleks')) as objective_earned_points,
			       (SELECT SUM(points) FROM questions WHERE exam_id = e.id AND type IN ('pilihan_ganda', 'benar_salah', 'menjodohkan', 'pilihan_ganda_kompleks')) as objective_max_points
			FROM student_attempts sa
			JOIN exams e ON sa.exam_id = e.id
			JOIN users usr ON sa.student_id = usr.id
			LEFT JOIN classes c ON usr.class_id = c.id
			LEFT JOIN subjects s ON e.subject_id = s.id
			LEFT JOIN exam_types et ON e.exam_type_id = et.id
			WHERE sa.student_id = ?
			ORDER BY sa.created_at DESC
		`).bind(userId).all();

		const myAttempts = (myAttemptsRes.results || []).map((sa: any) => {
			const isFullyGraded = sa.manual_question_count === 0 || sa.is_graded === 1 || sa.ungraded_count === 0;
			return {
				...sa,
				is_fully_graded: isFullyGraded,
				exam_title: formatExamTitle({
					title: sa.exam_title,
					examTypeCode: sa.exam_type_code,
					subjectName: sa.subject,
					className: sa.class_name,
					classLevel: sa.class_level
				})
			};
		});

		// Ujian yang sedang dikerjakan
		const activeAttemptRaw = await db.prepare(`
			SELECT sa.id, e.id as exam_id, e.title as exam_title, s.name as subject, et.code as exam_type_code, c.name as class_name, c.level as class_level, e.duration_minutes, sa.created_at
			FROM student_attempts sa 
			JOIN exams e ON sa.exam_id = e.id
			JOIN users usr ON sa.student_id = usr.id
			LEFT JOIN classes c ON usr.class_id = c.id
			LEFT JOIN subjects s ON e.subject_id = s.id
			LEFT JOIN exam_types et ON e.exam_type_id = et.id
			WHERE sa.student_id = ? AND sa.status = 'mengerjakan'
			LIMIT 1
		`).bind(userId).first<any>();

		const activeAttempt = activeAttemptRaw ? {
			...activeAttemptRaw,
			exam_title: formatExamTitle({
				title: activeAttemptRaw.exam_title,
				examTypeCode: activeAttemptRaw.exam_type_code,
				subjectName: activeAttemptRaw.subject,
				className: activeAttemptRaw.class_name,
				classLevel: activeAttemptRaw.class_level
			})
		} : null;

		// Fetch student's session_number
		let studentSession = 1;
		try {
			const studentRecord = await db.prepare('SELECT session_number FROM users WHERE id = ?').bind(userId).first<{ session_number: number }>();
			if (studentRecord && studentRecord.session_number) {
				studentSession = studentRecord.session_number;
			}
		} catch (e) {
			console.warn('Failed to fetch session_number:', e);
		}

		// Jadwal Ujian (berdasarkan tipe ujian yang ditugaskan ke siswa)
		let rawSchedules: any[] = [];
		try {
			const schedulesRes = await db.prepare(`
				SELECT DISTINCT
					e.id,
					e.title,
					e.start_time,
					e.end_time,
					s.name as subject_name,
					et.name as exam_type_name,
					(
						SELECT status 
						FROM student_attempts 
						WHERE exam_id = e.id AND student_id = ? 
						ORDER BY created_at DESC LIMIT 1
					) as attempt_status,
					r.name as room_name,
					? as session_number,
					(SELECT COUNT(*) FROM exam_sessions WHERE exam_id = e.id) > 0 as has_sessions,
					(
						SELECT GROUP_CONCAT(u2.name, '||')
						FROM exam_proctors epr
						JOIN users u2 ON epr.proctor_id = u2.id
						WHERE epr.exam_id = e.id AND COALESCE(epr.proctor_role, 'p1') NOT IN ('pt', 'cm')
					) as proctor_names
				FROM exams e
				JOIN exam_participants ep ON ep.exam_id = e.id
				JOIN exam_types et ON e.exam_type_id = et.id
				LEFT JOIN exam_rooms r ON ep.room_id = r.id
				LEFT JOIN subjects s ON e.subject_id = s.id
				WHERE ep.student_id = ?
				  AND e.school_id = ? 
				  AND e.is_active = 1
				  AND et.is_active = 1
				ORDER BY et.id ASC, e.start_time ASC, e.id ASC
			`).bind(userId, studentSession, userId, schoolId).all();
			rawSchedules = schedulesRes.results || [];
		} catch (e) {
			console.error('Error loading dashboard schedules:', e);
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

		const enrichedActiveExams = await enrichExamsWithSessions(activeExams || []);
		const enrichedSchedules = await enrichExamsWithSessions(rawSchedules || []);

		return {
			activeExams: enrichedActiveExams || [],
			myAttempts: myAttempts || [],
			activeAttempt,
			schedules: enrichedSchedules || []
		};
	} catch (e: any) {
		if (e && typeof e === 'object' && 'status' in e && (e as { status: number }).status === 302) {
			throw e;
		}
		console.error("Error loading student dashboard:", e);
		return {
			activeExams: [],
			myAttempts: [],
			activeAttempt: null,
			schedules: []
		};
	}
};
