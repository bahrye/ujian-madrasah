import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load: PageServerLoad = async ({ platform, url, locals }) => {
	const db = getDB(platform);

	const examParam = url.searchParams.get('exam_id');
	const studentFilterStr = url.searchParams.get('student_id') || '';
	const studentFilter = parseInt(studentFilterStr, 10);

	try {
		let answers: any[] = [];
		let students: any[] = [];
		let selectedExam: any = null;

		const exams = await db.prepare(`
			SELECT id, title FROM exams 
			WHERE school_id = ? AND (created_by = ? OR EXISTS (SELECT 1 FROM exam_teachers et WHERE et.exam_id = exams.id AND et.teacher_id = ?))
			ORDER BY title
		`).bind(locals.user!.school_id, locals.user!.id, locals.user!.id).all();

		if (examParam !== null) {
			const isAllExams = examParam === 'all';
			const examFilter = isAllExams ? '' : parseInt(examParam, 10);
			
			let studentQuery = `SELECT 
				u.id, 
				u.name,
				COUNT(CASE WHEN sa.score_given IS NULL THEN 1 END) as ungraded_count,
				MAX(CASE WHEN st.is_graded = 1 THEN 1 ELSE 0 END) as is_locked
				FROM student_attempts st 
				JOIN users u ON st.student_id = u.id 
				JOIN exams e ON st.exam_id = e.id 
				LEFT JOIN student_answers sa ON sa.attempt_id = st.id AND sa.question_id IN (
					SELECT id FROM questions WHERE type IN ('essay', 'isian_singkat')
				)
				WHERE e.school_id = ? AND (e.created_by = ? OR EXISTS (SELECT 1 FROM exam_teachers et WHERE et.exam_id = e.id AND et.teacher_id = ?))
				AND (st.status IN ('selesai', 'waktu_habis') OR (e.end_time IS NOT NULL AND e.end_time <= datetime('now')))`;
			const studentParams: any[] = [locals.user!.school_id, locals.user!.id, locals.user!.id];
			
			if (examFilter !== '') {
				studentQuery += ` AND e.id = ?`;
				studentParams.push(examFilter);
				
				// Ambil detail ujian yang dipilih untuk toggle rilis nilai
				selectedExam = await db.prepare('SELECT id, title, show_score_type, is_score_released FROM exams WHERE id = ?').bind(examFilter).first();
			}
			studentQuery += ` GROUP BY u.id, u.name ORDER BY u.name`;
			const studentsResult = await db.prepare(studentQuery).bind(...studentParams).all();
			students = (studentsResult.results || []).map((s: any) => ({
				id: s.id,
				name: s.name,
				is_locked: s.is_locked === 1,
				is_graded: s.is_locked === 1 || s.ungraded_count === 0
			}));

			let query = `SELECT sa.id as answer_id, sa.answer_given, sa.score_given, sa.is_correct,
				q.id as question_id, q.question_text, q.question_number, q.type, q.points, q.correct_answer_json,
				q.media_type, q.media_url,
				st.id as attempt_id, COALESCE(st.is_graded, 0) as is_locked, u.name as student_name, e.title as exam_title, e.id as exam_id
				FROM student_answers sa
				JOIN questions q ON sa.question_id = q.id
				JOIN student_attempts st ON sa.attempt_id = st.id
				JOIN users u ON st.student_id = u.id
				JOIN exams e ON st.exam_id = e.id
				WHERE q.type IN ('essay', 'isian_singkat') 
				AND e.school_id = ?
				AND (e.created_by = ? OR EXISTS (SELECT 1 FROM exam_teachers et WHERE et.exam_id = e.id AND et.teacher_id = ?))
				AND (st.status IN ('selesai', 'waktu_habis') OR (e.end_time IS NOT NULL AND e.end_time <= datetime('now')))`;

			const params: unknown[] = [locals.user!.school_id, locals.user!.id, locals.user!.id];
			if (!isAllExams && !isNaN(examFilter as number)) {
				query += ' AND e.id = ?';
				params.push(examFilter);
			}
			if (!isNaN(studentFilter)) {
				query += ' AND u.id = ?';
				params.push(studentFilter);
			}
			query += ' ORDER BY e.id, u.name, q.question_number';

			const answersResult = await db.prepare(query).bind(...params).all();
			answers = answersResult.results;
		}

		return { answers, exams: exams.results, students, examParam, studentFilter: isNaN(studentFilter) ? '' : String(studentFilter), selectedExam };
	} catch (e: any) {
		console.error("Load Error in guru penilaian:", e);
		return { answers: [], exams: [], students: [], examParam: '', studentFilter: '', selectedExam: null, loadError: e.message || String(e) };
	}
};

export const actions: Actions = {
	grade: async ({ request, platform, locals }) => {
		if (!locals.user) return fail(401, { error: 'Unauthorized' });
		const db = getDB(platform);
		const form = await request.formData();

		const answerIdStr = form.get('answer_id')?.toString();
		const parsedAnswerId = parseInt(answerIdStr || '', 10);
		const scoreStr = form.get('score_given')?.toString();
		const maxPoints = parseInt(form.get('max_points')?.toString() || '1');

		if (isNaN(parsedAnswerId)) return fail(400, { error: 'ID jawaban tidak valid.' });
		if (!scoreStr || scoreStr.trim() === '') return fail(400, { error: 'Nilai tidak boleh kosong.' });

		try {
			// Verifikasi bahwa jawaban ini berasal dari ujian sekolah yang ditugaskan ke guru
			const answerAuthCheck = await db.prepare(`
				SELECT sa.id, sa.attempt_id, COALESCE(st.is_graded, 0) as is_graded
				FROM student_answers sa
				JOIN student_attempts st ON sa.attempt_id = st.id
				JOIN exams e ON st.exam_id = e.id
				WHERE sa.id = ? AND e.school_id = ?
				AND (e.created_by = ? OR EXISTS (SELECT 1 FROM exam_teachers et WHERE et.exam_id = e.id AND et.teacher_id = ?))
			`).bind(parsedAnswerId, locals.user.school_id, locals.user.id, locals.user.id).first<{ id: number; attempt_id: number; is_graded: number }>();

			if (!answerAuthCheck) {
				return fail(403, { error: 'Anda tidak memiliki hak untuk menilai jawaban ini.' });
			}

			if (answerAuthCheck.is_graded === 1) {
				return fail(400, { error: 'Penilaian untuk siswa ini telah dikunci. Batalkan kunci terlebih dahulu untuk mengedit nilai.' });
			}

			const scoreGiven = parseFloat(scoreStr);
			const isCorrect = scoreGiven >= maxPoints ? 1 : (scoreGiven > 0 ? 0 : 0);

			await db.prepare('UPDATE student_answers SET score_given = ?, is_correct = ? WHERE id = ?')
				.bind(scoreGiven, isCorrect, parsedAnswerId).run();

			// Check if all manual questions for this attempt are now graded
			const remainingUngraded = await db.prepare(`
				SELECT COUNT(*) as c
				FROM student_answers sa
				JOIN questions q ON sa.question_id = q.id
				WHERE sa.attempt_id = ? AND q.type IN ('essay', 'isian_singkat') AND sa.score_given IS NULL
			`).bind(answerAuthCheck.attempt_id).first<{ c: number }>();

			const isNowFullyGraded = (remainingUngraded?.c || 0) === 0 ? 1 : 0;

			// Recalculate total score for the attempt
			const totalResult = await db.prepare(`
				SELECT SUM(COALESCE(sa.score_given, 0)) as total_score, SUM(q.points) as total_points
				FROM student_answers sa JOIN questions q ON sa.question_id = q.id
				WHERE sa.attempt_id = ?
			`).bind(answerAuthCheck.attempt_id).first<{ total_score: number; total_points: number }>();

			if (totalResult && totalResult.total_points > 0) {
				const score = (totalResult.total_score / totalResult.total_points) * 100;
				await db.prepare('UPDATE student_attempts SET score = ?, is_graded = ? WHERE id = ?')
					.bind(Math.round(score * 10) / 10, isNowFullyGraded, answerAuthCheck.attempt_id).run();
			}

			// If exam is already released and this attempt is now fully graded, release attempt score
			if (isNowFullyGraded === 1) {
				const examRel = await db.prepare('SELECT is_score_released FROM exams WHERE id = (SELECT exam_id FROM student_attempts WHERE id = ?)')
					.bind(answerAuthCheck.attempt_id).first<{ is_score_released: number }>();
				if (examRel && examRel.is_score_released === 1) {
					await db.prepare('UPDATE student_attempts SET is_score_released = 1 WHERE id = ?')
						.bind(answerAuthCheck.attempt_id).run();
				}
			}

			return { success: 'Nilai berhasil disimpan.' };
		} catch (e: any) {
			console.error(e);
			return fail(500, { error: e.message || 'Gagal menyimpan nilai.' });
		}
	},

	finalizeGrading: async ({ request, platform, locals }) => {
		if (!locals.user) return fail(401, { error: 'Unauthorized' });
		const db = getDB(platform);
		const form = await request.formData();
		const examIdStr = form.get('exam_id')?.toString();
		const studentIdStr = form.get('student_id')?.toString();

		if (!examIdStr) return fail(400, { error: 'Ujian tidak dipilih.' });

		const isAllExams = examIdStr === 'all';
		const parsedExamId = parseInt(examIdStr, 10);
		const parsedStudentId = parseInt(studentIdStr || '', 10);

		try {
			let attemptsQuery = `
				SELECT st.id
				FROM student_attempts st
				JOIN exams e ON st.exam_id = e.id
				WHERE e.school_id = ?
				AND (e.created_by = ? OR EXISTS (SELECT 1 FROM exam_teachers et WHERE et.exam_id = e.id AND et.teacher_id = ?))
				AND (st.status IN ('selesai', 'waktu_habis') OR (e.end_time IS NOT NULL AND e.end_time <= datetime('now')))
			`;
			const params: any[] = [locals.user.school_id, locals.user.id, locals.user.id];

			if (!isAllExams && !isNaN(parsedExamId)) {
				attemptsQuery += ' AND e.id = ?';
				params.push(parsedExamId);
			}
			if (!isNaN(parsedStudentId)) {
				attemptsQuery += ' AND st.student_id = ?';
				params.push(parsedStudentId);
			}

			const attemptResults = await db.prepare(attemptsQuery).bind(...params).all<{ id: number }>();
			const attemptIds = (attemptResults.results || []).map(a => a.id);

			if (attemptIds.length === 0) {
				return fail(400, { error: 'Tidak ada data pengerjaan siswa yang dapat dikunci.' });
			}

			const placeholders = attemptIds.map(() => '?').join(',');

			// 1. Fill un-graded essay / isian_singkat answers with 0
			await db.prepare(`
				UPDATE student_answers 
				SET score_given = 0, is_correct = 0 
				WHERE attempt_id IN (${placeholders}) 
				AND question_id IN (SELECT id FROM questions WHERE type IN ('essay', 'isian_singkat'))
				AND score_given IS NULL
			`).bind(...attemptIds).run();

			// 2. Recalculate score for each attempt and set is_graded = 1
			for (const attemptId of attemptIds) {
				const totalResult = await db.prepare(`
					SELECT SUM(COALESCE(sa.score_given, 0)) as total_score, SUM(q.points) as total_points
					FROM student_answers sa JOIN questions q ON sa.question_id = q.id
					WHERE sa.attempt_id = ?
				`).bind(attemptId).first<{ total_score: number; total_points: number }>();

				let score = 0;
				if (totalResult && totalResult.total_points > 0) {
					score = (totalResult.total_score / totalResult.total_points) * 100;
				}

				await db.prepare(`
					UPDATE student_attempts 
					SET score = ?, is_graded = 1 
					WHERE id = ?
				`).bind(Math.round(score * 10) / 10, attemptId).run();
			}

			// If exam is already released, release newly finalized attempts
			const examRel = await db.prepare('SELECT is_score_released FROM exams WHERE id = ?')
				.bind(parsedExamId).first<{ is_score_released: number }>();
			if (examRel && examRel.is_score_released === 1) {
				await db.prepare(`
					UPDATE student_attempts 
					SET is_score_released = 1 
					WHERE id IN (${placeholders})
				`).bind(...attemptIds).run();
			}

			return { success: 'Penilaian berhasil dikunci.' };
		} catch (e: any) {
			console.error(e);
			return fail(500, { error: e.message || 'Gagal mengunci penilaian.' });
		}
	},

	unlockGrading: async ({ request, platform, locals }) => {
		if (!locals.user) return fail(401, { error: 'Unauthorized' });
		const db = getDB(platform);
		const form = await request.formData();
		const examIdStr = form.get('exam_id')?.toString();
		const studentIdStr = form.get('student_id')?.toString();

		if (!examIdStr) return fail(400, { error: 'Ujian tidak dipilih.' });

		const isAllExams = examIdStr === 'all';
		const parsedExamId = parseInt(examIdStr, 10);
		const parsedStudentId = parseInt(studentIdStr || '', 10);

		try {
			let attemptsQuery = `
				SELECT st.id
				FROM student_attempts st
				JOIN exams e ON st.exam_id = e.id
				WHERE e.school_id = ?
				AND (e.created_by = ? OR EXISTS (SELECT 1 FROM exam_teachers et WHERE et.exam_id = e.id AND et.teacher_id = ?))
			`;
			const params: any[] = [locals.user.school_id, locals.user.id, locals.user.id];

			if (!isAllExams && !isNaN(parsedExamId)) {
				attemptsQuery += ' AND e.id = ?';
				params.push(parsedExamId);
			}
			if (!isNaN(parsedStudentId)) {
				attemptsQuery += ' AND st.student_id = ?';
				params.push(parsedStudentId);
			}

			const attemptResults = await db.prepare(attemptsQuery).bind(...params).all<{ id: number }>();
			const attemptIds = (attemptResults.results || []).map(a => a.id);

			if (attemptIds.length > 0) {
				const placeholders = attemptIds.map(() => '?').join(',');
				await db.prepare(`
					UPDATE student_attempts 
					SET is_graded = 0 
					WHERE id IN (${placeholders})
				`).bind(...attemptIds).run();
			}

			return { success: 'Kunci penilaian berhasil dibatalkan. Nilai dapat diubah kembali.' };
		} catch (e: any) {
			console.error(e);
			return fail(500, { error: e.message || 'Gagal membatalkan kunci penilaian.' });
		}
	},

	toggleScoreRelease: async ({ request, platform, locals }) => {
		if (!locals.user) return fail(401, { error: 'Unauthorized' });
		const db = getDB(platform);
		const form = await request.formData();
		const examIdStr = form.get('exam_id')?.toString();
		const parsedExamId = parseInt(examIdStr || '', 10);

		if (isNaN(parsedExamId)) return fail(400, { error: 'ID ujian tidak valid.' });

		try {
			// Verifikasi bahwa ujian milik sekolah ini dan ditugaskan ke guru
			const examAuthCheck = await db.prepare(`
				SELECT id, is_score_released FROM exams
				WHERE id = ? AND school_id = ?
				AND (created_by = ? OR EXISTS (SELECT 1 FROM exam_teachers et WHERE et.exam_id = exams.id AND et.teacher_id = ?))
			`).bind(parsedExamId, locals.user.school_id, locals.user.id, locals.user.id).first<{ id: number; is_score_released: number }>();

			if (!examAuthCheck) {
				return fail(403, { error: 'Anda tidak memiliki hak untuk mengubah pengaturan ujian ini.' });
			}

			const currentlyReleased = examAuthCheck.is_score_released === 1;
			const newReleaseStatus = currentlyReleased ? 0 : 1;

			// Jika akan merilis (dari 0 ke 1), pastikan semua siswa sudah dinilai
			if (!currentlyReleased) {
				const ungradedCheck = await db.prepare(`
					SELECT COUNT(*) as ungraded_students
					FROM student_attempts st
					WHERE st.exam_id = ?
					AND (st.status IN ('selesai', 'waktu_habis') OR EXISTS (
						SELECT 1 FROM exams e WHERE e.id = st.exam_id AND e.end_time IS NOT NULL AND e.end_time <= datetime('now')
					))
					AND st.is_graded = 0
					AND EXISTS (
						SELECT 1 FROM student_answers sa 
						JOIN questions q ON sa.question_id = q.id 
						WHERE sa.attempt_id = st.id 
						AND q.type IN ('essay', 'isian_singkat') 
						AND sa.score_given IS NULL
					)
				`).bind(parsedExamId).first<{ ungraded_students: number }>();

				if (ungradedCheck && ungradedCheck.ungraded_students > 0) {
					return fail(400, { error: 'Tidak dapat merilis nilai. Masih ada siswa yang belum dinilai. Pastikan semua nilai manual siswa terisi.' });
				}
			}

			// Update status rilis pada tabel exams
			await db.prepare(`
				UPDATE exams 
				SET is_score_released = ?, updated_at = datetime('now') 
				WHERE id = ? AND school_id = ?
			`).bind(newReleaseStatus, parsedExamId, locals.user.school_id).run();

			// Sinkronkan status rilis ke student_attempts untuk ujian ini
			// HANYA untuk siswa yang SUDAH SELESAI DINILAI!
			if (newReleaseStatus === 1) {
				await db.prepare(`
					UPDATE student_attempts 
					SET is_score_released = 1
					WHERE exam_id = ?
					AND status IN ('selesai', 'waktu_habis')
					AND (
						is_graded = 1 OR NOT EXISTS (
							SELECT 1 FROM student_answers sa 
							JOIN questions q ON sa.question_id = q.id 
							WHERE sa.attempt_id = student_attempts.id 
							AND q.type IN ('essay', 'isian_singkat') 
							AND sa.score_given IS NULL
						)
					)
				`).bind(parsedExamId).run();
			} else {
				await db.prepare(`
					UPDATE student_attempts 
					SET is_score_released = 0
					WHERE exam_id = ?
				`).bind(parsedExamId).run();
			}
			
			if (newReleaseStatus === 1) {
				return { success: 'Nilai berhasil dirilis untuk siswa yang sudah selesai dinilai! Status nilai pada Hasil Ujian telah diperbarui.' };
			} else {
				return { success: 'Rilis nilai dibatalkan. Nilai kembali disembunyikan dari siswa.' };
			}
		} catch (e: any) {
			console.error(e);
			return fail(500, { error: e.message || 'Gagal memperbarui status rilis nilai.' });
		}
	}
};
