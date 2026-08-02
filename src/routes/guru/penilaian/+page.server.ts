import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load: PageServerLoad = async ({ platform, url, locals }) => {
	const db = getDB(platform);
	const examParam = url.searchParams.get('exam_id');
	const studentFilter = url.searchParams.get('student_id') || '';

	let answers: any[] = [];
	let students: any[] = [];

	const exams = await db.prepare('SELECT id, title FROM exams WHERE school_id = ? ORDER BY title').bind(locals.user!.school_id).all();

	if (examParam !== null) {
		const isAllExams = examParam === 'all';
		const examFilter = isAllExams ? '' : examParam;
		
		let studentQuery = `SELECT DISTINCT u.id, u.name 
			FROM student_attempts st 
			JOIN users u ON st.student_id = u.id 
			JOIN exams e ON st.exam_id = e.id 
			WHERE e.school_id = ?`;
		const studentParams: any[] = [locals.user!.school_id];
		
		if (examFilter !== '') {
			studentQuery += ` AND e.id = ?`;
			studentParams.push(examFilter);
		}
		studentQuery += ` ORDER BY u.name`;
		const studentsResult = await db.prepare(studentQuery).bind(...studentParams).all();
		students = studentsResult.results;

		let query = `SELECT sa.id as answer_id, sa.answer_given, sa.score_given, sa.is_correct,
			q.id as question_id, q.question_text, q.type, q.points, q.correct_answer_json,
			st.id as attempt_id, u.name as student_name, e.title as exam_title, e.id as exam_id
			FROM student_answers sa
			JOIN questions q ON sa.question_id = q.id
			JOIN student_attempts st ON sa.attempt_id = st.id
			JOIN users u ON st.student_id = u.id
			JOIN exams e ON st.exam_id = e.id
			WHERE q.type IN ('essay', 'isian_singkat') AND e.school_id = ?`;

		const params: unknown[] = [locals.user!.school_id];
		if (examFilter !== '') {
			query += ' AND e.id = ?';
			params.push(examFilter);
		}
		if (studentFilter !== '') {
			query += ' AND u.id = ?';
			params.push(studentFilter);
		}
		query += ' ORDER BY e.id, u.name, q.question_number';

		const answersResult = await db.prepare(query).bind(...params).all();
		answers = answersResult.results;
	}

	return { answers, exams: exams.results, students, examParam, studentFilter };
};

export const actions: Actions = {
	grade: async ({ request, platform }) => {
		const db = getDB(platform);
		const form = await request.formData();

		const answerId = form.get('answer_id')?.toString();
		const scoreStr = form.get('score_given')?.toString();
		const maxPoints = parseInt(form.get('max_points')?.toString() || '1');

		if (!answerId) return fail(400, { error: 'ID jawaban tidak valid.' });
		if (!scoreStr || scoreStr.trim() === '') return fail(400, { error: 'Nilai tidak boleh kosong.' });

		const scoreGiven = parseFloat(scoreStr);
		const isCorrect = scoreGiven >= maxPoints ? 1 : (scoreGiven > 0 ? 0 : 0);

		await db.prepare('UPDATE student_answers SET score_given = ?, is_correct = ? WHERE id = ?')
			.bind(scoreGiven, isCorrect, answerId).run();

		// Recalculate total score for the attempt
		const answer = await db.prepare('SELECT attempt_id FROM student_answers WHERE id = ?').bind(answerId).first<{ attempt_id: number }>();
		if (answer) {
			const totalResult = await db.prepare(`
				SELECT SUM(COALESCE(sa.score_given, 0)) as total_score, SUM(q.points) as total_points
				FROM student_answers sa JOIN questions q ON sa.question_id = q.id
				WHERE sa.attempt_id = ?
			`).bind(answer.attempt_id).first<{ total_score: number; total_points: number }>();

			if (totalResult && totalResult.total_points > 0) {
				const score = (totalResult.total_score / totalResult.total_points) * 100;
				await db.prepare('UPDATE student_attempts SET score = ? WHERE id = ?')
					.bind(Math.round(score * 10) / 10, answer.attempt_id).run();
			}
		}

		return { success: 'Nilai berhasil disimpan.' };
	}
};
