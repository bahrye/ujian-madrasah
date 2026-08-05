import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { redirect, error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ platform, locals, params }) => {
	if (locals.user?.role !== 'siswa') throw redirect(302, '/');

	const db = getDB(platform);
	const examId = params.examId;
	const classId = locals.user.class_id;
	const schoolId = locals.user.school_id;

	if (!classId) {
		throw error(400, 'Anda belum terdaftar dalam kelas mana pun.');
	}

	const exam = await db.prepare(`
		SELECT e.id, e.title, e.subject_id 
		FROM exams e
		JOIN exam_participants ep ON e.id = ep.exam_id
		WHERE e.id = ? AND e.school_id = ? AND ep.student_id = ?
	`).bind(examId, schoolId, locals.user.id).first<{ id: number; title: string; subject_id: number }>();

	if (!exam) {
		throw error(404, 'Ujian tidak ditemukan atau Anda bukan peserta ujian ini.');
	}

	// Ambil subject name
	const subject = await db.prepare(`
		SELECT name FROM subjects WHERE id = ?
	`).bind(exam.subject_id).first<{ name: string }>();

	// Ambil leaderboard khusus untuk kelas siswa ini
	const leaderboardQuery = await db.prepare(`
		SELECT 
			u.name as student_name,
			u.photo,
			sa.submit_time
		FROM student_attempts sa
		JOIN users u ON sa.student_id = u.id
		WHERE sa.exam_id = ? AND sa.status = 'selesai' AND u.class_id = ?
		ORDER BY sa.score DESC, (julianday(sa.submit_time) - julianday(sa.start_time)) ASC
	`).bind(examId, classId).all<{ student_name: string; photo: string | null; submit_time: string }>();

	return {
		exam: {
			...exam,
			subject_name: subject ? subject.name : 'Ujian'
		},
		leaderboard: leaderboardQuery.results || []
	};
};
