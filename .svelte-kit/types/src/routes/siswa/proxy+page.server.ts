// @ts-nocheck
import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load = async ({ platform, locals }: Parameters<PageServerLoad>[0]) => {
	const db = getDB(platform);
	const userId = locals.user!.id;

	// Ujian aktif yang tokennya sudah dirilis
	const activeExams = await db.prepare(`
		SELECT DISTINCT 
			e.*, 
			s.name as subject,
			COALESCE(
				(
					SELECT GROUP_CONCAT(u.name, ', ')
					FROM exam_proctors epr
					JOIN users u ON epr.proctor_id = u.id
					WHERE epr.exam_id = e.id
				),
				(
					SELECT u.name FROM users u WHERE u.id = e.created_by AND u.role = 'guru'
				)
			) as proctors,
			(SELECT COUNT(*) FROM questions WHERE exam_id = e.id) as question_count
		FROM exams e
		JOIN exam_participants ep ON ep.exam_id = e.id
		LEFT JOIN subjects s ON e.subject_id = s.id
		JOIN exam_types et ON e.exam_type_id = et.id
		WHERE e.is_active = 1 AND et.is_active = 1
		AND e.school_id = ?
		AND ep.student_id = ?
	`).bind(locals.user!.school_id, userId).all();

	// Riwayat Ujian (dan yang sedang berjalan)
	const myAttempts = await db.prepare(`
		SELECT sa.*, e.title as exam_title, s.name as subject, e.duration_minutes, e.show_score_type, e.is_score_released, e.end_time as exam_end_time, et.end_time as exam_type_end_time
		FROM student_attempts sa
		JOIN exams e ON sa.exam_id = e.id
		LEFT JOIN subjects s ON e.subject_id = s.id
		LEFT JOIN exam_types et ON e.exam_type_id = et.id
		WHERE sa.student_id = ?
		ORDER BY sa.created_at DESC
	`).bind(userId).all();

	// Ujian yang sedang dikerjakan
	const activeAttempt = await db.prepare(`
		SELECT sa.id, e.id as exam_id, e.title as exam_title, e.duration_minutes, sa.created_at
		FROM student_attempts sa JOIN exams e ON sa.exam_id = e.id
		WHERE sa.student_id = ? AND sa.status = 'mengerjakan'
		LIMIT 1
	`).bind(userId).first();

	return {
		activeExams: activeExams.results,
		myAttempts: myAttempts.results,
		activeAttempt
	};
};
