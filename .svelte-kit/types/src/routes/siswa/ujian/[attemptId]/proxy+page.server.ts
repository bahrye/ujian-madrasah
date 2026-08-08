// @ts-nocheck
import { fail, redirect, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { verifyExamTokenSignature } from '$lib/server/auth';

export const load = async ({ platform, locals, params, cookies }: Parameters<PageServerLoad>[0]) => {
	if (!locals.user) throw redirect(302, '/login');
	const db = getDB(platform);
	const attemptIdStr = params.attemptId;
	const parsedAttemptId = parseInt(attemptIdStr, 10);
	if (isNaN(parsedAttemptId)) throw error(400, 'ID Ujian tidak valid');

	try {
	// Ambil data attempt
	const attempt = await db.prepare(`
		SELECT sa.*, e.title as exam_title, s.name as subject, e.duration_minutes, e.shuffle_questions
		FROM student_attempts sa
		JOIN exams e ON sa.exam_id = e.id
		LEFT JOIN subjects s ON e.subject_id = s.id
		WHERE sa.id = ? AND sa.student_id = ?
	`).bind(parsedAttemptId, locals.user.id).first<any>();

	if (!attempt) throw error(404, 'Sesi ujian tidak ditemukan.');

	if (attempt.status !== 'mengerjakan') {
		throw redirect(302, '/siswa');
	}

	const cookieVal = cookies.get('exam_token_verified_' + parsedAttemptId);
	const isVerified = await verifyExamTokenSignature(cookieVal, parsedAttemptId, locals.user.id);
	if (!isVerified) {
		throw redirect(302, `/siswa/ujian?exam_id=${attempt.exam_id}`);
	}

	// Ambil soal
	let questions = await db.prepare(`
		SELECT q.* FROM questions q
		WHERE q.exam_id = ?
		ORDER BY q.question_number
	`).bind(attempt.exam_id).all();

	let questionsList = questions.results as any[];

	if (attempt.shuffle_questions === 1) {
		// Implement deterministic shuffle using attempt.id as seed (Mulberry32 PRNG)
		let seed = attempt.id * 1234567;
		const random = () => {
			seed |= 0; seed = seed + 0x6D2B79F5 | 0;
			let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
			t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
			return ((t ^ t >>> 14) >>> 0) / 4294967296;
		};
		
		for (let i = questionsList.length - 1; i > 0; i--) {
			const j = Math.floor(random() * (i + 1));
			[questionsList[i], questionsList[j]] = [questionsList[j], questionsList[i]];
		}
	}

	// Ambil jawaban
	const answers = await db.prepare(`
		SELECT sa.* FROM student_answers sa
		WHERE sa.attempt_id = ?
	`).bind(parsedAttemptId).all();

	// Map answers by question_id
	const answerMap: Record<number, any> = {};
	for (const a of answers.results as any[]) {
		answerMap[a.question_id] = a;
	}

	const kv = platform?.env?.EXAM_ANSWERS;
	let kvData: any = null;
	if (kv) {
		const stored = await kv.get(`attempt_${parsedAttemptId}_answers`);
		if (stored) {
			try { kvData = JSON.parse(stored); } catch {}
		}
	}

	if (kvData) {
		for (const q of questionsList) {
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
		questions: questionsList,
		answerMap
	};
	} catch (e: any) {
		if (e.status === 302 || e.status === 404) throw e;
		console.error("Load error in siswa ujian attempt:", e);
		throw redirect(302, '/siswa');
	}
};

export const actions = {
	saveAnswer: async ({ request, platform, params, locals, cookies }: import('./$types').RequestEvent) => {
		if (!locals.user) return fail(401, { error: 'Unauthorized' });
		const kv = platform?.env?.EXAM_ANSWERS;
		if (!kv) return fail(500, { error: 'KV not configured' });

		const attemptIdStr = params.attemptId;
		const parsedAttemptId = parseInt(attemptIdStr, 10);
		if (isNaN(parsedAttemptId)) return fail(400, { error: 'ID tidak valid' });

		const cookieVal = cookies.get('exam_token_verified_' + parsedAttemptId);
		const isVerified = await verifyExamTokenSignature(cookieVal, parsedAttemptId, locals.user.id);
		if (!isVerified) return fail(401, { error: 'Sesi token tidak valid.' });

		const form = await request.formData();
		const answersStr = form.get('answers')?.toString();
		const doubtsStr = form.get('doubts')?.toString();
		const warningsStr = form.get('warnings')?.toString();
		const warningLogsStr = form.get('warningLogs')?.toString();

		if (answersStr || warningsStr) {
			try {
				const payload = {
					answers: answersStr ? JSON.parse(answersStr) : {},
					doubts: doubtsStr ? JSON.parse(doubtsStr) : {},
					warnings: warningsStr ? parseInt(warningsStr, 10) : 0,
					warningLogs: warningLogsStr ? JSON.parse(warningLogsStr) : []
				};

				await kv.put(`attempt_${parsedAttemptId}_answers`, JSON.stringify(payload));
			} catch (e) {
				return fail(400, { error: 'Invalid JSON payload' });
			}
		}

		return { saved: true };
	},

	submit: async ({ request, platform, params, locals, cookies }: import('./$types').RequestEvent) => {
		if (!locals.user) return fail(401, { error: 'Sesi telah berakhir. Silakan login kembali.' });
		const db = getDB(platform);
		const attemptIdStr = params.attemptId;
		const parsedAttemptId = parseInt(attemptIdStr, 10);
		if (isNaN(parsedAttemptId)) return fail(400, { error: 'ID tidak valid' });

		try {
			// Ambil attempt dan verifikasi kepemilikan siswa
			const attempt = await db.prepare('SELECT * FROM student_attempts WHERE id = ? AND student_id = ?')
				.bind(parsedAttemptId, locals.user.id).first<any>();

			if (!attempt || attempt.status !== 'mengerjakan') {
				return fail(400, { error: 'Sesi ujian tidak valid atau sudah selesai.' });
			}

			const form = await request.formData().catch(() => null);
			let formAnswers: Record<string, any> = {};
			let formDoubts: Record<string, any> = {};
			let warnings = 0;
			let warningLogs = '[]';

			if (form) {
				const formAnswersStr = form.get('answers')?.toString();
				const formDoubtsStr = form.get('doubts')?.toString();
				const formWarningsStr = form.get('warnings')?.toString();
				const formWarningLogsStr = form.get('warningLogs')?.toString();

				if (formAnswersStr) {
					try { formAnswers = JSON.parse(formAnswersStr); } catch {}
				}
				if (formDoubtsStr) {
					try { formDoubts = JSON.parse(formDoubtsStr); } catch {}
				}
				if (formWarningsStr) {
					warnings = parseInt(formWarningsStr, 10) || 0;
				}
				if (formWarningLogsStr) {
					warningLogs = formWarningLogsStr;
				}
			}

			let kvAnswers: Record<string, any> = { ...formAnswers };
			let kvDoubts: Record<string, any> = { ...formDoubts };

			const kv = platform?.env?.EXAM_ANSWERS;
			if (kv) {
				const stored = await kv.get(`attempt_${parsedAttemptId}_answers`);
				if (stored) {
					try {
						const kvData = JSON.parse(stored);
						if (kvData && kvData.warnings) warnings = kvData.warnings;
						if (kvData && kvData.warningLogs) warningLogs = JSON.stringify(kvData.warningLogs);
						if (kvData && kvData.answers) kvAnswers = { ...kvAnswers, ...kvData.answers };
						if (kvData && kvData.doubts) kvDoubts = { ...kvDoubts, ...kvData.doubts };
						await kv.delete(`attempt_${parsedAttemptId}_answers`);
					} catch (e) {}
				}
			}

			// Sync answers to student_answers database
			const examQuestions = await db.prepare('SELECT id FROM questions WHERE exam_id = ?').bind(attempt.exam_id).all<{ id: number }>();
			const existingAnswers = await db.prepare('SELECT question_id, id FROM student_answers WHERE attempt_id = ?').bind(parsedAttemptId).all<{ question_id: number; id: number }>();
			const existingMap = new Map<number, number>(existingAnswers.results.map(a => [a.question_id, a.id]));

			const syncStmts = [];
			for (const q of examQuestions.results) {
				const ansVal = typeof kvAnswers[q.id] !== 'undefined' && kvAnswers[q.id] !== null ? String(kvAnswers[q.id]) : null;
				const isDoubted = kvDoubts[q.id] ? 1 : 0;

				if (existingMap.has(q.id)) {
					if (ansVal !== null) {
						syncStmts.push(
							db.prepare(`UPDATE student_answers SET answer_given = ?, is_doubted = ?, answered_at = datetime('now') WHERE attempt_id = ? AND question_id = ?`)
								.bind(ansVal, isDoubted, parsedAttemptId, q.id)
						);
					}
				} else {
					syncStmts.push(
						db.prepare(`INSERT INTO student_answers (attempt_id, question_id, answer_given, is_doubted, answered_at) VALUES (?, ?, ?, ?, datetime('now'))`)
							.bind(parsedAttemptId, q.id, ansVal, isDoubted)
					);
				}
			}

			if (syncStmts.length > 0) {
				await db.batch(syncStmts);
			}

			// Auto-grade soal objektif
			const answers = await db.prepare(`
				SELECT sa.*, q.type, q.correct_answer_json, q.points
				FROM student_answers sa
				JOIN questions q ON sa.question_id = q.id
				WHERE sa.attempt_id = ?
			`).bind(parsedAttemptId).all();

			let totalScore = 0;
			let totalPoints = 0;

			const updateStmts = [];

			for (const ans of answers.results as any[]) {
				totalPoints += ans.points;

				if (ans.type === 'essay' || ans.type === 'isian_singkat') {
					// Essay dan isian singkat dinilai manual oleh guru
					continue;
				}

				if (!ans.correct_answer_json || !ans.answer_given) {
					updateStmts.push(
						db.prepare('UPDATE student_answers SET score_given = 0, is_correct = 0 WHERE id = ?').bind(ans.id)
					);
					continue;
				}

				let correctAnswer: any;
				try {
					correctAnswer = JSON.parse(ans.correct_answer_json);
				} catch {
					continue;
				}

				let isCorrect = false;
				let partialScore: number | null = null;

				if (ans.type === 'pilihan_ganda' || ans.type === 'benar_salah') {
					isCorrect = String(ans.answer_given).trim() === String(correctAnswer).trim();
				} else if (ans.type === 'pilihan_ganda_kompleks') {
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
							partialScore = Math.round(rawScore * ans.points * 100) / 100;
						}
					} catch {
						isCorrect = false;
					}
				} else if (ans.type === 'menjodohkan') {
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
								partialScore = Math.round((correctCount / totalPairs) * ans.points * 100) / 100;
							}
						}
					} catch {
						isCorrect = false;
					}
				}

				const scoreGiven = partialScore !== null ? partialScore : (isCorrect ? ans.points : 0);
				totalScore += scoreGiven;

				updateStmts.push(
					db.prepare('UPDATE student_answers SET score_given = ?, is_correct = ? WHERE id = ?')
						.bind(scoreGiven, isCorrect ? 1 : 0, ans.id)
				);
			}

			// Hitung skor persentase
			const finalScore = totalPoints > 0 ? Math.round((totalScore / totalPoints) * 1000) / 10 : 0;

			// Simpan status selesai ke student_attempts
			updateStmts.push(
				db.prepare(`UPDATE student_attempts SET status = 'selesai', submit_time = datetime('now'),
					score = ?, total_points = ?, violation_count = ?, violation_logs = ? WHERE id = ?`)
					.bind(finalScore, totalPoints, warnings, warningLogs, parsedAttemptId)
			);

			await db.batch(updateStmts);

			// Hapus cookie sesi ujian
			cookies.delete('exam_token_verified_' + parsedAttemptId, { path: '/' });

			throw redirect(302, '/siswa');
		} catch (e: any) {
			if (e.status === 302) throw e;
			console.error("Submit error:", e);
			return fail(500, { error: e.message || 'Gagal mengirim ujian.' });
		}
	}
};
;null as any as Actions;