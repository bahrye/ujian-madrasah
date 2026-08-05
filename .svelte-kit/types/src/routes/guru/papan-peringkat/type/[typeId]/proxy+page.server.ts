// @ts-nocheck
import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { redirect, error } from '@sveltejs/kit';

export const load = async ({ platform, locals, params, url }: Parameters<PageServerLoad>[0]) => {
	if (locals.user?.role !== 'guru') throw redirect(302, '/');

	const db = getDB(platform);
	const typeId = params.typeId;
	const schoolId = locals.user.school_id;
	const userId = locals.user.id;
	const classFilter = url.searchParams.get('class_id') || '';

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

	// Ambil daftar kelas yang ada pesertanya pada ujian guru ini
	const classesQuery = await db.prepare(`
		SELECT DISTINCT c.id, c.name
		FROM classes c
		JOIN users u ON u.class_id = c.id
		JOIN student_attempts sa ON sa.student_id = u.id
		JOIN exams e ON sa.exam_id = e.id
		WHERE e.exam_type_id = ? AND sa.status = 'selesai' AND c.school_id = ?
		AND (e.created_by = ? OR EXISTS (SELECT 1 FROM exam_teachers teacher_join WHERE teacher_join.exam_id = e.id AND teacher_join.teacher_id = ?))
		ORDER BY c.name ASC
	`).bind(typeId, schoolId, userId, userId).all<{ id: number; name: string }>();

	// Agregasi nilai berdasarkan tipe ujian, terbatas pada ujian guru tersebut
	let leaderboardSQL = `
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
	`;
	const leaderboardParams: unknown[] = [typeId, userId, userId];
	if (classFilter) {
		leaderboardSQL += ' AND u.class_id = ?';
		leaderboardParams.push(classFilter);
	}
	leaderboardSQL += ' GROUP BY u.id ORDER BY total_score DESC, avg_score DESC';

	const leaderboardQuery = await db.prepare(leaderboardSQL)
		.bind(...leaderboardParams)
		.all<{ student_id: number; student_name: string; photo: string | null; class_name: string | null; total_points: number; total_score: number; avg_score: number; exams_completed: number }>();

	// Detail per-ujian per-siswa untuk dropdown
	let detailSQL = `
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
	`;
	const detailParams: unknown[] = [typeId, userId, userId];
	if (classFilter) {
		detailSQL += ' AND u.class_id = ?';
		detailParams.push(classFilter);
	}
	detailSQL += ' ORDER BY u.id, e.title ASC';

	const detailQuery = await db.prepare(detailSQL)
		.bind(...detailParams)
		.all<{ student_id: number; exam_title: string; total_points: number; score: number }>();

	// Kelompokkan detail berdasarkan student_id
	const detailMap: Record<number, { exam_title: string; total_points: number; score: number }[]> = {};
	for (const row of detailQuery.results || []) {
		if (!detailMap[row.student_id]) detailMap[row.student_id] = [];
		detailMap[row.student_id].push({ exam_title: row.exam_title, total_points: row.total_points, score: row.score });
	}

	return {
		examType,
		classes: classesQuery.results || [],
		classFilter,
		leaderboard: leaderboardQuery.results || [],
		detailMap
	};
};
