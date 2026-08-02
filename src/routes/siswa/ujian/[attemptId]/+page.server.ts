import { fail, redirect, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load: PageServerLoad = async ({ platform, locals, params }) => {
	const db = getDB(platform);
	const attemptId = params.attemptId;

	// Ambil data attempt
	const attempt = await db.prepare(`
		SELECT sa.*, e.title as exam_title, s.name as subject, e.duration_minutes
		FROM student_attempts sa
		JOIN exams e ON sa.exam_id = e.id
		LEFT JOIN subjects s ON e.subject_id = s.id
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

	const kv = platform?.env?.EXAM_ANSWERS;
	let kvData: any = null;
	if (kv) {
		const stored = await kv.get(`attempt_${attemptId}_answers`);
		if (stored) {
			try { kvData = JSON.parse(stored); } catch {}
		}
	}

	if (kvData) {
		for (const q of questions.results as any[]) {
			if (!answerMap[q.id]) {
				answerMap[q.id] = { answer_given: '', is_doubted: 0 };
			}
			if (kvData.answers && typeof kvData.answers[q.id] !== 'undefined') {
				answerMap[q.id].answer_given = kvData.answers[q.id];
			}
			if (kvData.doubts && typeof kvData.doubts[q.id] !== 'undefined') {
				answerMap[q.id].is_doubted = kvData.doubts[q.id] ? 1 : 0;
			}
		}
	}

	return {
		attempt,
		questions: questions.results,
		answerMap
	};
};

export const actions: Actions = {
	saveAnswer: async ({ request, platform, params }) => {
		const kv = platform?.env?.EXAM_ANSWERS;
		if (!kv) return fail(500, { error: 'KV not configured' });

		const form = await request.formData();
		const answersStr = form.get('answers')?.toString();
		const doubtsStr = form.get('doubts')?.toString();

		if (answersStr) {
			try {
				const payload = {
					answers: JSON.parse(answersStr),
					doubts: doubtsStr ? JSON.parse(doubtsStr) : {}
				};
				await kv.put(`attempt_${params.attemptId}_answers`, JSON.stringify(payload));
			} catch (e) {
				return fail(400, { error: 'Invalid JSON payload' });
			}
		}

		return { saved: true };
	},

	submit: async ({ platform, params, locals }) => {
		const db = getDB(platform);
		const attemptId = params.attemptId;

		// Ambil attempt
		const attempt = await db.prepare('SELECT * FROM student_attempts WHERE id = ? AND student_id = ?')
			.bind(attemptId, locals.user!.id).first<any>();

		if (!attempt || attempt.status !== 'mengerjakan') {
			return fail(400, { error: 'Sesi ujian tidak valid.' });
		}

		const kv = platform?.env?.EXAM_ANSWERS;
		if (kv) {
			const stored = await kv.get(`attempt_${attemptId}_answers`);
			if (stored) {
				try {
					const kvData = JSON.parse(stored);
					if (kvData && kvData.answers) {
						const kvUpdateStmts = [];
						for (const [qIdStr, ansVal] of Object.entries(kvData.answers)) {
							const qId = parseInt(qIdStr, 10);
							const isDoubted = kvData.doubts && kvData.doubts[qId] ? 1 : 0;
							kvUpdateStmts.push(
								db.prepare(`UPDATE student_answers SET answer_given = ?, is_doubted = ?, answered_at = datetime('now') WHERE attempt_id = ? AND question_id = ?`)
								.bind(String(ansVal), isDoubted, attemptId, qId)
							);
						}
						if (kvUpdateStmts.length > 0) {
							await db.batch(kvUpdateStmts);
						}
					}
					await kv.delete(`attempt_${attemptId}_answers`);
				} catch (e) {}
			}
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
