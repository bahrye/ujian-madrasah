// @ts-nocheck
import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load = async ({ platform, locals }: Parameters<PageServerLoad>[0]) => {
	const db = getDB(platform);
	const userId = locals.user!.id;

	// Ujian aktif yang tokennya sudah dirilis
	const activeExams = await db.prepare(`
		SELECT DISTINCT e.*, t.token_code, t.expires_at as token_expires, s.name as subject
		FROM exams e
		JOIN tokens t ON t.exam_id = e.id
		LEFT JOIN subjects s ON e.subject_id = s.id
		WHERE e.is_active = 1
		AND e.school_id = ?
		AND t.is_released = 1
		AND datetime(t.expires_at) > datetime('now')
		ORDER BY e.start_time
	`).bind(locals.user!.school_id).all();

	// Riwayat ujian siswa
	const myAttempts = await db.prepare(`
		SELECT sa.*, e.title as exam_title, s.name as subject
		FROM student_attempts sa
		JOIN exams e ON sa.exam_id = e.id
		LEFT JOIN subjects s ON e.subject_id = s.id
		WHERE sa.student_id = ?
		ORDER BY sa.created_at DESC
	`).bind(userId).all();

	// Ujian yang sedang dikerjakan
	const activeAttempt = await db.prepare(`
		SELECT sa.id, e.title as exam_title
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
