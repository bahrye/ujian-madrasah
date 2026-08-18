import { fail, redirect, error, isRedirect, isHttpError } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { verifyExamTokenSignature } from '$lib/server/auth';

import { formatExamTitle, matchShortAnswer } from '$lib/utils/exam';

export const load: PageServerLoad = async ({ platform, locals, params, cookies }) => {
	if (!locals.user) throw redirect(302, '/login');
	const db = getDB(platform);
	const attemptIdStr = params.attemptId;
	const parsedAttemptId = parseInt(attemptIdStr, 10);
	if (isNaN(parsedAttemptId)) throw redirect(302, '/siswa');

	try {
		// Ambil data attempt
		const attempt = await db.prepare(`
			SELECT sa.*, 
			       e.title as exam_title, 
			       s.name as subject_name, 
			       et.code as exam_type_code,
			       c.name as class_name, 
			       c.level as class_level,
			       e.duration_minutes, 
			       e.shuffle_questions,
			       t.is_released as token_is_released, 
			       t.released_at as token_released_at, 
			       t.expires_at as token_expires_at,
			       e.is_active as exam_active
			FROM student_attempts sa
			JOIN exams e ON sa.exam_id = e.id
			LEFT JOIN tokens t ON sa.token_id = t.id
			LEFT JOIN subjects s ON e.subject_id = s.id
			LEFT JOIN exam_types et ON e.exam_type_id = et.id
			JOIN users u ON sa.student_id = u.id
			LEFT JOIN classes c ON u.class_id = c.id
			WHERE sa.id = ? AND sa.student_id = ?
		`).bind(parsedAttemptId, locals.user.id).first<any>();

		if (!attempt) {
			throw redirect(302, '/siswa');
		}

		attempt.exam_title = formatExamTitle({
			title: attempt.exam_title,
			examTypeCode: attempt.exam_type_code,
			subjectName: attempt.subject_name,
			className: attempt.class_name,
			classLevel: attempt.class_level
		});

		if (attempt.status !== 'mengerjakan') {
			throw redirect(302, '/siswa');
		}

		// Verifikasi cookie sesi ujian
		const cookieVal = cookies.get('exam_token_verified_' + parsedAttemptId);
		const isVerified = await verifyExamTokenSignature(cookieVal, parsedAttemptId, locals.user.id);
		
		if (!isVerified) {
			// Cookie tidak ada/tidak valid - siswa harus memasukkan token untuk masuk
			cookies.delete('exam_token_verified_' + parsedAttemptId, { path: '/' });
			throw redirect(302, `/siswa/ujian?exam_id=${attempt.exam_id}`);
		}

		// Ambil soal
		let questionsList: any[] = [];
		try {
			const questions = await db.prepare(`
				SELECT q.* FROM questions q
				WHERE q.exam_id = ?
				ORDER BY q.question_number
			`).bind(attempt.exam_id).all();
			questionsList = (questions.results || []) as any[];
		} catch (qErr) {
			console.error("Error loading questions:", qErr);
			questionsList = [];
		}

		if (attempt.shuffle_questions === 1 && questionsList.length > 0) {
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

		// Ambil jawaban langsung dari D1
		const answerMap: Record<number, any> = {};
		try {
			const answers = await db.prepare(`
				SELECT sa.* FROM student_answers sa
				WHERE sa.attempt_id = ?
			`).bind(parsedAttemptId).all();
			if (answers.results) {
				for (const a of answers.results as any[]) {
					answerMap[a.question_id] = a;
				}
			}
		} catch (aErr) {
			console.error("Error loading answers:", aErr);
		}

		return {
			attempt,
			questions: questionsList,
			answerMap
		};
	} catch (e: any) {
		if (isRedirect(e)) throw e;
		console.error("Load error in siswa ujian attempt:", e);
		throw redirect(302, '/siswa');
	}
};

export const actions: Actions = {
	saveAnswer: async ({ request, platform, params, locals, cookies }) => {
		if (!locals.user) return fail(401, { error: 'Unauthorized' });
		const db = getDB(platform);

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
				const parsedAnswers = answersStr ? JSON.parse(answersStr) : {};
				const parsedDoubts = doubtsStr ? JSON.parse(doubtsStr) : {};
				const warnings = warningsStr ? parseInt(warningsStr, 10) : 0;
				const warningLogs = warningLogsStr || '[]';

				const syncStmts: any[] = [];

				for (const [qIdStr, ansVal] of Object.entries(parsedAnswers)) {
					const qId = parseInt(qIdStr, 10);
					if (isNaN(qId)) continue;
					const valStr = ansVal !== null && typeof ansVal !== 'undefined' ? String(ansVal) : null;
					const isDoubted = parsedDoubts[qId] ? 1 : 0;

					syncStmts.push(
						db.prepare(`
							INSERT INTO student_answers (attempt_id, question_id, answer_given, is_doubted, answered_at)
							VALUES (?, ?, ?, ?, datetime('now'))
							ON CONFLICT(attempt_id, question_id) DO UPDATE SET
								answer_given = excluded.answer_given,
								is_doubted = excluded.is_doubted,
								answered_at = datetime('now')
						`).bind(parsedAttemptId, qId, valStr, isDoubted)
					);
				}

				syncStmts.push(
					db.prepare(`
						UPDATE student_attempts 
						SET violation_count = ?, violation_logs = ?
						WHERE id = ? AND student_id = ?
					`).bind(warnings, warningLogs, parsedAttemptId, locals.user.id)
				);

				if (syncStmts.length > 0) {
					const chunkSize = 50;
					for (let i = 0; i < syncStmts.length; i += chunkSize) {
						await db.batch(syncStmts.slice(i, i + chunkSize));
					}
				}
			} catch (e: any) {
				console.error("Save answer error:", e?.message || e);
				return fail(400, { error: 'Gagal menyimpan jawaban: ' + (e?.message || '') });
			}
		}

		return { saved: true };
	},

	submit: async ({ request, platform, params, locals, cookies }) => {
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

			// Sync any last second submitted form answers directly to D1
			const examQuestions = await db.prepare('SELECT id FROM questions WHERE exam_id = ?').bind(attempt.exam_id).all<{ id: number }>();
			const syncStmts: any[] = [];
			for (const q of examQuestions.results) {
				if (typeof formAnswers[q.id] !== 'undefined' && formAnswers[q.id] !== null) {
					const ansVal = String(formAnswers[q.id]);
					const isDoubted = formDoubts[q.id] ? 1 : 0;
					syncStmts.push(
						db.prepare(`
							INSERT INTO student_answers (attempt_id, question_id, answer_given, is_doubted, answered_at)
							VALUES (?, ?, ?, ?, datetime('now'))
							ON CONFLICT(attempt_id, question_id) DO UPDATE SET
								answer_given = excluded.answer_given,
								is_doubted = excluded.is_doubted,
								answered_at = datetime('now')
						`).bind(parsedAttemptId, q.id, ansVal, isDoubted)
					);
				}
			}

			if (syncStmts.length > 0) {
				const chunkSize = 50;
				for (let i = 0; i < syncStmts.length; i += chunkSize) {
					await db.batch(syncStmts.slice(i, i + chunkSize));
				}
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

			const updateStmts: any[] = [];

			for (const ans of answers.results as any[]) {
				totalPoints += ans.points;

				if (ans.type === 'essay') {
					// Essay dinilai manual oleh guru
					continue;
				}

				if (ans.type === 'isian_singkat') {
					// Jika siswa tidak menjawab (kosong), beri nilai 0
					if (!ans.answer_given || !String(ans.answer_given).trim()) {
						updateStmts.push(
							db.prepare('UPDATE student_answers SET score_given = 0, is_correct = 0 WHERE id = ?').bind(ans.id)
						);
						continue;
					}

					// Cek kecocokan otomatis (case-insensitive, toleran spasi dan tanda baca)
					const isMatched = matchShortAnswer(ans.answer_given, ans.correct_answer_json);
					if (isMatched) {
						// Jawaban sama / cocok -> Otomatis Benar!
						const scoreGiven = ans.points;
						totalScore += scoreGiven;
						updateStmts.push(
							db.prepare('UPDATE student_answers SET score_given = ?, is_correct = 1 WHERE id = ?')
								.bind(scoreGiven, ans.id)
						);
					} else {
						// Jawaban berbeda / bervariasi -> Dibiarkan NULL agar dinilai manual oleh guru
					}
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

				if (ans.type === 'pilihan_ganda') {
					isCorrect = String(ans.answer_given).trim() === String(correctAnswer).trim();
				} else if (ans.type === 'benar_salah') {
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
								partialScore = Math.round((correctCount / totalStatements) * ans.points * 100) / 100;
							}
						} catch {
							isCorrect = false;
						}
					} else {
						isCorrect = String(ans.answer_given).trim().toLowerCase() === String(correctAnswer).trim().toLowerCase();
					}
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
			
			// Cek apakah masih ada soal yang memerlukan penilaian manual guru:
			// 1. Soal essay
			// 2. Soal isian_singkat yang tidak cocok otomatis dengan kunci (jawaban berbeda)
			const hasUnfinishedGrading = (answers.results as any[]).some((ans: any) => {
				if (ans.type === 'essay') {
					return true;
				}
				if (ans.type === 'isian_singkat') {
					if (!ans.answer_given || !String(ans.answer_given).trim()) return false;
					return !matchShortAnswer(ans.answer_given, ans.correct_answer_json);
				}
				return false;
			});
			const isGraded = hasUnfinishedGrading ? 0 : 1;

			// Simpan status selesai ke student_attempts
			updateStmts.push(
				db.prepare(`UPDATE student_attempts SET status = 'selesai', submit_time = datetime('now'),
					score = ?, total_points = ?, violation_count = ?, violation_logs = ?, is_graded = ? WHERE id = ?`)
					.bind(finalScore, totalPoints, warnings, warningLogs, isGraded, parsedAttemptId)
			);

			if (updateStmts.length > 0) {
				const chunkSize = 50;
				for (let i = 0; i < updateStmts.length; i += chunkSize) {
					await db.batch(updateStmts.slice(i, i + chunkSize));
				}
			}

			// Hapus cookie sesi ujian
			cookies.delete('exam_token_verified_' + parsedAttemptId, { path: '/' });

			throw redirect(302, '/siswa');
		} catch (e: any) {
			if (isRedirect(e) || isHttpError(e)) throw e;
			console.error("Submit error:", e?.message || e);
			return fail(500, { error: e?.message || 'Gagal mengirim ujian.' });
		}
	}
};
