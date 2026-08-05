// @ts-nocheck
import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { redirect, error } from '@sveltejs/kit';

export const load = async ({ platform, locals, params }: Parameters<PageServerLoad>[0]) => {
	if (locals.user?.role !== 'admin') throw redirect(302, '/');

	const db = getDB(platform);
	const typeId = params.typeId;
	const schoolId = locals.user.school_id;

	const examType = await db.prepare(`
		SELECT id, name, code FROM exam_types WHERE id = ? AND school_id = ?
	`).bind(typeId, schoolId).first<{ id: number; name: string; code: string }>();

	if (!examType) {
		throw error(404, 'Tipe ujian tidak ditemukan.');
	}

	// Agregasi nilai berdasarkan tipe ujian untuk semua siswa
	const leaderboardQuery = await db.prepare(`
		SELECT 
			u.name as student_name,
			u.photo,
			c.name as class_name,
			SUM(sa.total_points) as total_points,
			SUM(sa.score) as total_score, 
			AVG(sa.score) as avg_score,
			SUM(julianday(sa.submit_time) - julianday(sa.start_time)) as total_time,
			COUNT(sa.id) as exams_completed
		FROM student_attempts sa
		JOIN users u ON sa.student_id = u.id
		LEFT JOIN classes c ON u.class_id = c.id
		JOIN exams e ON sa.exam_id = e.id
		WHERE e.exam_type_id = ? AND sa.status = 'selesai'
		GROUP BY u.id
		ORDER BY total_score DESC, avg_score DESC, total_time ASC
	`).bind(typeId).all<{ student_name: string; photo: string | null; class_name: string | null; total_points: number; total_score: number; avg_score: number; total_time: number; exams_completed: number }>();

	return {
		examType,
		leaderboard: leaderboardQuery.results || []
	};
};
