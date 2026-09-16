import { parseDate } from '$lib/utils/date';
import { matchShortAnswer } from '$lib/utils/exam';

export interface FinalizeResult {
	attemptId: number;
	score: number;
	totalPoints: number;
	status: 'selesai' | 'waktu_habis';
}

/**
 * Finalizes a specific attempt by:
 * 1. Grading all objective answers (pilihan ganda, benar salah, pg kompleks, menjodohkan, isian singkat)
 * 2. Calculating the final score and total points
 * 3. Updating the attempt status to 'waktu_habis' or 'selesai'
 * 4. Setting the submit_time and updated_at
 */
export async function finalizeAttempt(
	db: any,
	attemptId: number,
	targetStatus: 'waktu_habis' | 'selesai' = 'waktu_habis'
): Promise<FinalizeResult | null> {
	try {
		const attempt = (await db
			.prepare('SELECT id, exam_id, student_id, end_time, status, violation_count, violation_logs FROM student_attempts WHERE id = ?')
			.bind(attemptId)
			.first()) as any;

		if (!attempt || attempt.status !== 'mengerjakan') {
			return null;
		}

		// 1. Fetch questions for the exam
		const questionsRes = (await db
			.prepare('SELECT id, type, points, correct_answer_json FROM questions WHERE exam_id = ?')
			.bind(attempt.exam_id)
			.all()) as any;
		const questions = (questionsRes.results || []) as any[];

		// 2. Fetch existing student answers
		const answersRes = (await db
			.prepare('SELECT * FROM student_answers WHERE attempt_id = ?')
			.bind(attemptId)
			.all()) as any;
		const answers = (answersRes.results || []) as any[];
		const answersMap = new Map<number, any>();
		for (const a of answers) {
			answersMap.set(a.question_id, a);
		}

		let totalScore = 0;
		let totalPoints = 0;
		const updateStmts: any[] = [];
		let hasUnfinishedGrading = false;

		for (const q of questions) {
			const qPoints = q.points || 1;
			totalPoints += qPoints;

			const ans = answersMap.get(q.id);

			if (q.type === 'essay') {
				hasUnfinishedGrading = true;
				continue;
			}

			if (q.type === 'isian_singkat') {
				if (!ans || !ans.answer_given || !String(ans.answer_given).trim()) {
					if (ans) {
						updateStmts.push(
							db.prepare('UPDATE student_answers SET score_given = 0, is_correct = 0 WHERE id = ?').bind(ans.id)
						);
					}
					continue;
				}

				const isMatched = matchShortAnswer(ans.answer_given, q.correct_answer_json);
				if (isMatched) {
					totalScore += qPoints;
					updateStmts.push(
						db.prepare('UPDATE student_answers SET score_given = ?, is_correct = 1 WHERE id = ?').bind(qPoints, ans.id)
					);
				} else {
					hasUnfinishedGrading = true;
				}
				continue;
			}

			if (!ans || !ans.answer_given || !q.correct_answer_json) {
				if (ans) {
					updateStmts.push(
						db.prepare('UPDATE student_answers SET score_given = 0, is_correct = 0 WHERE id = ?').bind(ans.id)
					);
				}
				continue;
			}

			let correctAnswer: any;
			try {
				correctAnswer = JSON.parse(q.correct_answer_json);
			} catch {
				continue;
			}

			let isCorrect = false;
			let partialScore: number | null = null;

			if (q.type === 'pilihan_ganda') {
				isCorrect = String(ans.answer_given).trim() === String(correctAnswer).trim();
			} else if (q.type === 'benar_salah') {
				if (typeof correctAnswer === 'object' && correctAnswer !== null && !Array.isArray(correctAnswer)) {
					try {
						const givenMap = typeof ans.answer_given === 'string' ? JSON.parse(ans.answer_given) : ans.answer_given;
						const keys = Object.keys(correctAnswer);
						const totalStatements = keys.length;
						if (totalStatements > 0) {
							let correctCount = 0;
							for (const key of keys) {
								if (givenMap && String(givenMap[key] || '').trim().toLowerCase() === String(correctAnswer[key] || '').trim().toLowerCase()) {
									correctCount++;
								}
							}
							isCorrect = correctCount === totalStatements;
							partialScore = Math.round((correctCount / totalStatements) * qPoints * 100) / 100;
						}
					} catch {
						isCorrect = false;
					}
				} else {
					isCorrect = String(ans.answer_given).trim().toLowerCase() === String(correctAnswer).trim().toLowerCase();
				}
			} else if (q.type === 'pilihan_ganda_kompleks') {
				try {
					const givenRaw = typeof ans.answer_given === 'string' ? JSON.parse(ans.answer_given) : ans.answer_given;
					const correctRaw = Array.isArray(correctAnswer) ? correctAnswer : (typeof correctAnswer === 'string' ? JSON.parse(correctAnswer) : []);
					const givenAnswers = Array.isArray(givenRaw) ? givenRaw.map(String) : [];
					const correctAnswers = Array.isArray(correctRaw) ? correctRaw.map(String) : [];

					if (correctAnswers.length > 0) {
						let correctPicks = 0;
						let wrongPicks = 0;

						for (const g of givenAnswers) {
							if (correctAnswers.includes(g)) {
								correctPicks++;
							} else {
								wrongPicks++;
							}
						}

						let rawScore = (correctPicks - wrongPicks) / correctAnswers.length;
						if (rawScore < 0) rawScore = 0;

						isCorrect = correctPicks === correctAnswers.length && wrongPicks === 0;
						partialScore = Math.round(rawScore * qPoints * 100) / 100;
					}
				} catch {
					isCorrect = false;
				}
			} else if (q.type === 'menjodohkan') {
				try {
					const givenMap = typeof ans.answer_given === 'string' ? JSON.parse(ans.answer_given) : ans.answer_given;
					const correctMap = typeof correctAnswer === 'string' ? JSON.parse(correctAnswer) : correctAnswer;

					if (givenMap && correctMap && typeof correctMap === 'object') {
						const keys = Object.keys(correctMap);
						const totalPairs = keys.length;
						if (totalPairs > 0) {
							let correctCount = 0;
							for (const key of keys) {
								if (String(givenMap[key]).trim() === String(correctMap[key]).trim()) {
									correctCount++;
								}
							}
							isCorrect = correctCount === totalPairs;
							partialScore = Math.round((correctCount / totalPairs) * qPoints * 100) / 100;
						}
					}
				} catch {
					isCorrect = false;
				}
			}

			const scoreGiven = partialScore !== null ? partialScore : (isCorrect ? qPoints : 0);
			totalScore += scoreGiven;

			updateStmts.push(
				db.prepare('UPDATE student_answers SET score_given = ?, is_correct = ? WHERE id = ?')
					.bind(scoreGiven, isCorrect ? 1 : 0, ans.id)
			);
		}

		// Hitung skor persentase (skala 100)
		const finalScore = totalPoints > 0 ? Math.round((totalScore / totalPoints) * 1000) / 10 : 0;
		const isGraded = hasUnfinishedGrading ? 0 : 1;

		updateStmts.push(
			db.prepare(`
				UPDATE student_attempts 
				SET status = ?, 
				    submit_time = COALESCE(submit_time, end_time, datetime('now')),
				    score = ?, 
				    total_points = ?, 
				    is_graded = ?, 
				    updated_at = datetime('now')
				WHERE id = ?
			`).bind(targetStatus, finalScore, totalPoints, isGraded, attemptId)
		);

		if (updateStmts.length > 0) {
			const chunkSize = 50;
			for (let i = 0; i < updateStmts.length; i += chunkSize) {
				await db.batch(updateStmts.slice(i, i + chunkSize));
			}
		}

		return {
			attemptId,
			score: finalScore,
			totalPoints,
			status: targetStatus
		};
	} catch (err) {
		console.error(`Error finalizing attempt ${attemptId}:`, err);
		return null;
	}
}

/**
 * Sweeps and finalizes all attempts whose time has expired but status is still 'mengerjakan'.
 * Handles network dropouts where student device or proctor could not send the submit request.
 */
export async function finalizeExpiredAttempts(
	db: any,
	options?: { schoolId?: number | null; examId?: number | null; attemptId?: number | null }
): Promise<number> {
	if (!db) return 0;

	try {
		let query = `
			SELECT sa.id, sa.exam_id, sa.student_id, sa.end_time, sa.is_paused, sa.paused_at,
			       e.end_time as exam_end_time, et.end_time as exam_type_end_time
			FROM student_attempts sa
			JOIN exams e ON sa.exam_id = e.id
			LEFT JOIN exam_types et ON e.exam_type_id = et.id
			WHERE sa.status = 'mengerjakan'
		`;
		const bindings: any[] = [];

		if (options?.attemptId) {
			query += ' AND sa.id = ?';
			bindings.push(options.attemptId);
		} else {
			if (options?.schoolId) {
				query += ' AND e.school_id = ?';
				bindings.push(options.schoolId);
			}
			if (options?.examId) {
				query += ' AND e.id = ?';
				bindings.push(options.examId);
			}
		}

		const candidatesRes = (await db.prepare(query).bind(...bindings).all()) as any;
		const candidates = (candidatesRes.results || []) as any[];

		if (candidates.length === 0) return 0;

		const now = Date.now();
		let finalizedCount = 0;

		for (const cand of candidates) {
			// If attemptId was explicitly specified (e.g. forced by proctor/action), finalize directly
			if (options?.attemptId && options.attemptId === cand.id) {
				const res = await finalizeAttempt(db, cand.id, 'waktu_habis');
				if (res) finalizedCount++;
				continue;
			}

			// If paused by proctor, do not auto-finalize
			if (cand.is_paused === 1) {
				continue;
			}

			let isExpired = false;

			// Check attempt end_time
			if (cand.end_time) {
				const endMs = parseDate(cand.end_time).getTime();
				if (!isNaN(endMs) && endMs <= now) {
					isExpired = true;
				}
			}

			// Check exam overall end_time
			if (!isExpired && cand.exam_end_time) {
				const examEndMs = parseDate(cand.exam_end_time).getTime();
				if (!isNaN(examEndMs) && examEndMs <= now) {
					isExpired = true;
				}
			}

			// Check exam type end_time
			if (!isExpired && cand.exam_type_end_time) {
				const typeEndMs = parseDate(cand.exam_type_end_time).getTime();
				if (!isNaN(typeEndMs) && typeEndMs <= now) {
					isExpired = true;
				}
			}

			if (isExpired) {
				const res = await finalizeAttempt(db, cand.id, 'waktu_habis');
				if (res) finalizedCount++;
			}
		}

		return finalizedCount;
	} catch (err) {
		console.error('Error in finalizeExpiredAttempts:', err);
		return 0;
	}
}
