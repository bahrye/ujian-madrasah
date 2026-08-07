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
		SELECT sa.*, e.title as exam_title, s.name as subject, e.duration_minutes, e.show_score_type, e.is_score_released, e.end_time as exam_end_time, et.end_time as exam_type_end_time,
		(SELECT SUM(points) FROM questions WHERE exam_id = e.id AND type IN ('pilihan_ganda', 'benar_salah', 'menjodohkan', 'pilihan_ganda_kompleks')) as objective_max_points,
		(SELECT SUM(score_given) FROM student_answers sa2 JOIN questions q2 ON sa2.question_id = q2.id WHERE sa2.attempt_id = sa.id AND q2.type IN ('pilihan_ganda', 'benar_salah', 'menjodohkan', 'pilihan_ganda_kompleks')) as objective_earned_points
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

	// Jadwal Ujian (berdasarkan tipe ujian yang ditugaskan ke siswa)
	const schedules = await db.prepare(`
		SELECT 
			e.id,
			e.title,
			e.start_time,
			e.end_time,
			s.name as subject_name,
			et.name as exam_type_name,
			(
				SELECT GROUP_CONCAT(u.name, '||')
				FROM exam_proctors epr
				JOIN users u ON epr.proctor_id = u.id
				WHERE epr.exam_id = e.id
			) as proctor_names
		FROM exams e
		JOIN exam_types et ON e.exam_type_id = et.id
		LEFT JOIN subjects s ON e.subject_id = s.id
		WHERE e.school_id = ? 
		  AND e.exam_type_id IN (
			  SELECT DISTINCT exam_type_id 
			  FROM exams 
			  WHERE id IN (
				  SELECT exam_id FROM exam_participants WHERE student_id = ?
			  )
		  )
		  AND e.is_active = 1
		  AND et.is_active = 1
		ORDER BY et.id ASC, e.start_time ASC, e.id ASC
	`).bind(locals.user!.school_id, userId).all();

	return {
		activeExams: activeExams.results,
		myAttempts: myAttempts.results,
		activeAttempt,
		schedules: schedules.results
	};
};
