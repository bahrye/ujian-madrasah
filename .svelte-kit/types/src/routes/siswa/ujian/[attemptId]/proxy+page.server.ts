// @ts-nocheck
import { fail, redirect, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load = async ({ platform, locals, params }: Parameters<PageServerLoad>[0]) => {
	const db = getDB(platform);
	const attemptId = params.attemptId;

	// Ambil data attempt
	const attempt = await db.prepare(`
		SELECT sa.*, e.title as exam_title, e.subject, e.duration_minutes
		FROM student_attempts sa
		JOIN exams e ON sa.exam_id = e.id
		WHERE sa.id = ? AND sa.student_id = ?
	`).bind(attemptId, locals.user!.id).first<any>();

	if (!attempt) throw error(404, 'Sesi ujian tidak ditemukan.');

	if (attempt.status !== 'mengerjakan') {
		throw redirect(302, '/siswa');
	}

	// Ambil soal
	const questions = await db.prepare(`
		SELECT q.* FROM questions q
		WHERE q.exam_id = ?
		ORDER BY q.question_number
	`).bind(attempt.exam_id).all();

	// Ambil jawaban
	const answers = await db.prepare(`
		SELECT sa.* FROM student_answers sa
		WHERE sa.attempt_id = ?
	`).bind(attemptId).all();

	// Map answers by question_id
	const answerMap: Record<number, any> = {};
	for (const a of answers.results as any[]) {
		answerMap[a.question_id] = a;
	}

	return {
		attempt,
		questions: questions.results,
		answerMap
	};
};

export const actions = {
	saveAnswer: async ({ request, platform, params }: import('./$types').RequestEvent) => {
		const db = getDB(platform);
		const form = await request.formData();

		const questionId = form.get('question_id')?.toString();
		const answerGiven = form.get('answer_given')?.toString() ?? '';
		const isDoubted = form.get('is_doubted')?.toString() === '1' ? 1 : 0;

		if (!questionId) return fail(400, { error: 'Data tidak valid.' });

		await db.prepare(`
			UPDATE student_answers
			SET answer_given = ?, is_doubted = ?, answered_at = datetime('now')
			WHERE attempt_id = ? AND question_id = ?
		`).bind(answerGiven, isDoubted, params.attemptId, questionId).run();

		return { saved: true };
	},

	submit: async ({ platform, params, locals }: import('./$types').RequestEvent) => {
		const db = getDB(platform);
		const attemptId = params.attemptId;

		// Ambil attempt
		const attempt = await db.prepare('SELECT * FROM student_attempts WHERE id = ? AND student_id = ?')
			.bind(attemptId, locals.user!.id).first<any>();

		if (!attempt || attempt.status !== 'mengerjakan') {
			return fail(400, { error: 'Sesi ujian tidak valid.' });
		}

		// Auto-grade soal objektif
		const answers = await db.prepare(`
			SELECT sa.*, q.type, q.correct_answer_json, q.points
			FROM student_answers sa
			JOIN questions q ON sa.question_id = q.id
			WHERE sa.attempt_id = ?
		`).bind(attemptId).all();

		let totalScore = 0;
		let totalPoints = 0;

		const updateStmts = [];

		for (const ans of answers.results as any[]) {
			totalPoints += ans.points;

			if (ans.type === 'essay') {
				// Essay dinilai manual — skip
				continue;
			}

			if (!ans.correct_answer_json || !ans.answer_given) {
				updateStmts.push(
					db.prepare('UPDATE student_answers SET score_given = 0, is_correct = 0 WHERE id = ?').bind(ans.id)
				);
				continue;
			}

			let correctAnswer: string;
			try {
				correctAnswer = JSON.parse(ans.correct_answer_json);
			} catch {
				continue;
			}

			let isCorrect = false;

			if (ans.type === 'pilihan_ganda' || ans.type === 'benar_salah') {
				isCorrect = ans.answer_given === correctAnswer;
			} else if (ans.type === 'isian_singkat') {
				isCorrect = ans.answer_given.trim().toLowerCase() === String(correctAnswer).trim().toLowerCase();
			} else if (ans.type === 'menjodohkan') {
				try {
					const givenMap = JSON.parse(ans.answer_given);
					const correctMap = typeof correctAnswer === 'string' ? JSON.parse(correctAnswer) : correctAnswer;
					isCorrect = JSON.stringify(givenMap) === JSON.stringify(correctMap);
				} catch {
					isCorrect = false;
				}
			}

			const scoreGiven = isCorrect ? ans.points : 0;
			totalScore += scoreGiven;

			updateStmts.push(
				db.prepare('UPDATE student_answers SET score_given = ?, is_correct = ? WHERE id = ?')
					.bind(scoreGiven, isCorrect ? 1 : 0, ans.id)
			);
		}

		// Hitung skor persentase
		const finalScore = totalPoints > 0 ? Math.round((totalScore / totalPoints) * 1000) / 10 : 0;

		updateStmts.push(
			db.prepare(`UPDATE student_attempts SET status = 'selesai', submit_time = datetime('now'),
				score = ?, total_points = ? WHERE id = ?`)
				.bind(finalScore, totalPoints, attemptId)
		);

		await db.batch(updateStmts);

		throw redirect(302, '/siswa');
	}
};
;null as any as Actions;