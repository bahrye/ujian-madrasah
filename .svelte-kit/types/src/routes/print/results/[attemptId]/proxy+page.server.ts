// @ts-nocheck
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load = async ({ params, platform, locals }: Parameters<PageServerLoad>[0]) => {
	const db = getDB(platform);
	const attemptId = params.attemptId;

	const school = await db.prepare('SELECT * FROM schools WHERE id = ?').bind(locals.user!.school_id).first();

	const attempt = await db.prepare(`
		SELECT sa.*, u.name as student_name, u.username as nisn, u.nomor_peserta, c.name as class_name, e.title as exam_title, s.name as subject_name, e.duration_minutes
		FROM student_attempts sa
		JOIN users u ON sa.student_id = u.id
		LEFT JOIN classes c ON u.class_id = c.id
		JOIN exams e ON sa.exam_id = e.id
		LEFT JOIN subjects s ON e.subject_id = s.id
		WHERE sa.id = ? AND e.school_id = ?
	`).bind(attemptId, locals.user!.school_id).first<any>();

	if (!attempt) throw error(404, 'Data hasil ujian tidak ditemukan.');

	// Authorization check
	if (locals.user!.role === 'siswa' && attempt.student_id !== locals.user!.id) {
		throw error(403, 'Anda tidak memiliki akses ke data ini.');
	}
	if (locals.user!.role === 'guru') {
		const isAuthorized = await db.prepare(`
			SELECT 1 FROM exams e 
			WHERE e.id = ? AND (e.created_by = ? OR EXISTS (SELECT 1 FROM exam_teachers et WHERE et.exam_id = e.id AND et.teacher_id = ?))
		`).bind(attempt.exam_id, locals.user!.id, locals.user!.id).first();
		if (!isAuthorized) throw error(403, 'Anda tidak memiliki akses ke data ini.');
	}

	const answers = await db.prepare(`
		SELECT q.question_number, q.question_text, q.type, q.options_json, q.correct_answer_json, q.points as max_points,
		       sa.answer_given, sa.score_given, sa.is_correct, sa.is_doubted
		FROM student_answers sa
		JOIN questions q ON sa.question_id = q.id
		WHERE sa.attempt_id = ?
		ORDER BY q.question_number ASC
	`).bind(attemptId).all();

	return {
		school,
		attempt,
		answers: answers.results || []
	};
};
