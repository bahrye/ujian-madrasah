// @ts-nocheck
import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { redirect, error } from '@sveltejs/kit';
import { formatExamTitle } from '$lib/utils/exam';

export const load = async ({ platform, locals, params }: Parameters<PageServerLoad>[0]) => {
	if (locals.user?.role !== 'guru') throw redirect(302, '/');

	const db = getDB(platform);
	const examId = params.examId;
	const schoolId = locals.user.school_id;
	const userId = locals.user.id;

	const exam = await db.prepare(`
		SELECT e.id, e.title, e.subject_id, e.exam_type_id, e.duration_minutes,
		       s.name as subject_name, et.code as exam_type_code, c.name as class_name
		FROM exams e
		LEFT JOIN subjects s ON e.subject_id = s.id
		LEFT JOIN exam_types et ON e.exam_type_id = et.id
		LEFT JOIN classes c ON e.class_id = c.id
		WHERE e.id = ? AND e.school_id = ? 
		AND (e.created_by = ? OR EXISTS (SELECT 1 FROM exam_teachers teacher_join WHERE teacher_join.exam_id = e.id AND teacher_join.teacher_id = ?))
	`).bind(examId, schoolId, userId, userId).first<any>();

	if (!exam) {
		throw error(404, 'Ujian tidak ditemukan atau Anda tidak memiliki akses ke ujian ini.');
	}

	const formattedTitle = formatExamTitle({
		title: exam.title,
		examTypeCode: exam.exam_type_code,
		subjectName: exam.subject_name,
		className: exam.class_name
	});

	// Ambil leaderboard semua kelas untuk ujian ini, lengkap dengan nilainya
	const leaderboardQuery = await db.prepare(`
		SELECT 
			u.name as student_name,
			u.photo,
			c.name as class_name,
			MAX(sa.score) as score,
			sa.total_points,
			sa.submit_time,
			sa.start_time
		FROM student_attempts sa
		JOIN users u ON sa.student_id = u.id
		LEFT JOIN classes c ON u.class_id = c.id
		WHERE sa.exam_id = ? AND sa.status = 'selesai'
		GROUP BY u.id
		ORDER BY score DESC, (julianday(sa.submit_time) - julianday(sa.start_time)) ASC
	`).bind(examId).all<{ student_name: string; photo: string | null; class_name: string | null; score: number; total_points: number; submit_time: string; start_time: string }>();

	return {
		exam: {
			...exam,
			title: formattedTitle,
			subject_name: exam.subject_name || 'Ujian'
		},
		leaderboard: leaderboardQuery.results || []
	};
};
