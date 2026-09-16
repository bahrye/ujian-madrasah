import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { calculateExamAnalytics } from '$lib/server/analytics';
import { formatExamTitle } from '$lib/utils/exam';

export const load: PageServerLoad = async ({ platform, url, locals }) => {
	if (!locals.user || !['admin', 'superadmin', 'panitia'].includes(locals.user.role)) {
		throw redirect(302, '/login');
	}

	const db = getDB(platform);
	const schoolId = locals.user.school_id;

	// 1. Get all exams for this school
	const examsRes = await db.prepare(`
		SELECT e.id, e.title, e.duration_minutes, e.start_time, e.end_time,
		       s.name as subject_name, et.code as exam_type_code, c.name as class_name
		FROM exams e 
		LEFT JOIN subjects s ON e.subject_id = s.id
		LEFT JOIN exam_types et ON e.exam_type_id = et.id
		LEFT JOIN classes c ON e.class_id = c.id
		WHERE e.school_id = ? 
		ORDER BY e.id DESC
	`).bind(schoolId).all<any>();

	const exams = (examsRes.results || []).map((e: any) => ({
		...e,
		title: formatExamTitle({
			title: e.title,
			examTypeCode: e.exam_type_code,
			subjectName: e.subject_name,
			className: e.class_name
		})
	}));

	const examIdParam = url.searchParams.get('exam_id');
	let selectedExamId: number | null = examIdParam ? parseInt(examIdParam, 10) : null;

	// Auto-select first exam if not specified and exams exist
	if (!selectedExamId && exams.length > 0) {
		selectedExamId = exams[0].id;
	}

	let analytics = null;
	const kkm = parseInt(url.searchParams.get('kkm') || '75', 10);

	if (selectedExamId) {
		const exam = exams.find((e: any) => e.id === selectedExamId);
		if (exam) {
			// Fetch questions
			const questionsRes = await db.prepare(`
				SELECT id, question_number, type, question_text, points, options_json, correct_answer_json 
				FROM questions 
				WHERE exam_id = ? 
				ORDER BY question_number ASC, id ASC
			`).bind(selectedExamId).all<any>();

			// Fetch attempts
			const attemptsRes = await db.prepare(`
				SELECT sa.id, sa.student_id, sa.score, sa.total_points, sa.status, 
				       sa.start_time, sa.end_time, sa.submit_time, sa.violation_count,
				       u.name as student_name, u.username, u.nisn, u.nomor_peserta, c.name as class_name
				FROM student_attempts sa
				JOIN users u ON sa.student_id = u.id
				LEFT JOIN classes c ON u.class_id = c.id
				WHERE sa.exam_id = ?
				ORDER BY sa.score DESC, sa.id ASC
			`).bind(selectedExamId).all<any>();

			// Fetch student answers
			const answersRes = await db.prepare(`
				SELECT an.attempt_id, an.question_id, an.is_correct, an.answer_given, an.score_given
				FROM student_answers an
				JOIN student_attempts sa ON an.attempt_id = sa.id
				WHERE sa.exam_id = ?
			`).bind(selectedExamId).all<any>();

			// Fetch registered participants
			const participantsRes = await db.prepare(`
				SELECT ep.student_id
				FROM exam_participants ep
				WHERE ep.exam_id = ?
			`).bind(selectedExamId).all<any>();

			analytics = calculateExamAnalytics(
				exam,
				questionsRes.results || [],
				attemptsRes.results || [],
				answersRes.results || [],
				participantsRes.results || [],
				{ kkm }
			);
		}
	}

	return {
		exams,
		selectedExamId,
		analytics,
		kkm
	};
};
