import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { redirect, error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ platform, locals, params }) => {
	if (locals.user?.role !== 'guru') throw redirect(302, '/');

	const db = getDB(platform);
	const typeId = params.typeId;
	const schoolId = locals.user.school_id;
	const userId = locals.user.id;

	// Verifikasi guru memiliki akses ke minimal satu ujian dengan tipe ini
	const examType = await db.prepare(`
		SELECT DISTINCT et.id, et.name, et.code 
		FROM exam_types et
		JOIN exams e ON et.id = e.exam_type_id
		WHERE et.id = ? AND et.school_id = ?
		AND (e.created_by = ? OR EXISTS (SELECT 1 FROM exam_teachers teacher_join WHERE teacher_join.exam_id = e.id AND teacher_join.teacher_id = ?))
	`).bind(typeId, schoolId, userId, userId).first<{ id: number; name: string; code: string }>();

	if (!examType) {
		throw error(404, 'Tipe ujian tidak ditemukan atau Anda tidak memiliki akses.');
	}

	// Agregasi nilai berdasarkan tipe ujian, terbatas pada ujian guru tersebut
	const leaderboardQuery = await db.prepare(`
		SELECT 
			u.id as student_id,
			u.name as student_name,
			u.photo,
			c.name as class_name,
			SUM(sa.total_points) as total_points,
			SUM(sa.score) as total_score, 
			AVG(sa.score) as avg_score,
			COUNT(sa.id) as exams_completed
		FROM student_attempts sa
		JOIN users u ON sa.student_id = u.id
		LEFT JOIN classes c ON u.class_id = c.id
		JOIN exams e ON sa.exam_id = e.id
		WHERE e.exam_type_id = ? AND sa.status = 'selesai'
		AND (e.created_by = ? OR EXISTS (SELECT 1 FROM exam_teachers teacher_join WHERE teacher_join.exam_id = e.id AND teacher_join.teacher_id = ?))
		GROUP BY u.id
		ORDER BY total_score DESC, avg_score DESC
	`).bind(typeId, userId, userId).all<{ 
		student_id: number;
		student_name: string; 
		photo: string | null; 
		class_name: string | null; 
		total_points: number; 
		total_score: number; 
		avg_score: number; 
		exams_completed: number 
	}>();

	// Detail per-ujian per-siswa untuk dropdown
	const detailQuery = await db.prepare(`
		SELECT 
			u.id as student_id,
			e.title as exam_title,
			sa.total_points,
			sa.score
		FROM student_attempts sa
		JOIN users u ON sa.student_id = u.id
		JOIN exams e ON sa.exam_id = e.id
		WHERE e.exam_type_id = ? AND sa.status = 'selesai'
		AND (e.created_by = ? OR EXISTS (SELECT 1 FROM exam_teachers teacher_join WHERE teacher_join.exam_id = e.id AND teacher_join.teacher_id = ?))
		ORDER BY u.id, e.title ASC
	`).bind(typeId, userId, userId).all<{ student_id: number; exam_title: string; total_points: number; score: number }>();

	// Kelompokkan detail berdasarkan student_id
	const detailMap: Record<number, { exam_title: string; total_points: number; score: number }[]> = {};
	for (const row of detailQuery.results || []) {
		if (!detailMap[row.student_id]) detailMap[row.student_id] = [];
		detailMap[row.student_id].push({ exam_title: row.exam_title, total_points: row.total_points, score: row.score });
	}

	return {
		examType,
		leaderboard: leaderboardQuery.results || [],
		detailMap
	};
};
