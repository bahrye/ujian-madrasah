// @ts-nocheck
import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';

export const load = async ({ platform, locals }: Parameters<PageServerLoad>[0]) => {
	if (locals.user?.role !== 'siswa') throw redirect(302, '/');

	const db = getDB(platform);

	// Ambil semua ujian yang diikuti siswa ini
	// Dan gabungkan dengan nama pengawas
	const examsQuery = await db.prepare(`
		SELECT 
			e.*, 
			s.name as subject,
			(
				SELECT GROUP_CONCAT(u.name, ', ')
				FROM exam_proctors epr
				JOIN users u ON epr.proctor_id = u.id
				WHERE epr.exam_id = e.id
			) as proctors,
			(SELECT COUNT(*) FROM questions WHERE exam_id = e.id) as question_count
		FROM exams e
		JOIN exam_participants ep ON e.id = ep.exam_id
		LEFT JOIN subjects s ON e.subject_id = s.id
		WHERE ep.student_id = ? AND e.school_id = ?
		ORDER BY CASE WHEN e.start_time IS NULL THEN 1 ELSE 0 END, e.start_time ASC, e.created_at DESC
	`).bind(locals.user.id, locals.user.school_id).all();

	return {
		schedules: examsQuery.results || []
	};
};
