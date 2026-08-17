import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { formatExamTitle } from '$lib/utils/exam';

export const load: PageServerLoad = async ({ params, platform, locals }) => {
	const db = getDB(platform);
	const attemptId = params.attemptId;

	const attempt = await db.prepare(`
		SELECT sa.*, u.name as student_name, u.username as nisn, c.name as class_name, 
		       e.title, s.name as subject_name, et.code as exam_type_code, ec.name as exam_class_name, e.duration_minutes
		FROM student_attempts sa
		JOIN users u ON sa.student_id = u.id
		LEFT JOIN classes c ON u.class_id = c.id
		JOIN exams e ON sa.exam_id = e.id
		LEFT JOIN subjects s ON e.subject_id = s.id
		LEFT JOIN exam_types et ON e.exam_type_id = et.id
		LEFT JOIN classes ec ON e.class_id = ec.id
		WHERE sa.id = ? AND e.school_id = ?
		AND (e.created_by = ? OR EXISTS (SELECT 1 FROM exam_teachers teacher_join WHERE teacher_join.exam_id = e.id AND teacher_join.teacher_id = ?))
	`).bind(attemptId, locals.user!.school_id, locals.user!.id, locals.user!.id).first<any>();

	if (!attempt) throw error(404, 'Data hasil ujian tidak ditemukan atau Anda tidak memiliki akses ke data ini.');

	const formattedAttempt = {
		...attempt,
		exam_title: formatExamTitle({
			title: attempt.title,
			examTypeCode: attempt.exam_type_code,
			subjectName: attempt.subject_name,
			className: attempt.exam_class_name || attempt.class_name
		})
	};

	const answers = await db.prepare(`
		SELECT q.question_number, q.question_text, q.type, q.options_json, q.correct_answer_json, q.points as max_points,
		       sa.answer_given, sa.score_given, sa.is_correct, sa.is_doubted
		FROM student_answers sa
		JOIN questions q ON sa.question_id = q.id
		WHERE sa.attempt_id = ?
		ORDER BY q.question_number ASC
	`).bind(attemptId).all();

	return {
		attempt: formattedAttempt,
		answers: answers.results
	};
};
