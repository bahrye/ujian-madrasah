// @ts-nocheck
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load = async ({ params, platform, locals }: Parameters<PageServerLoad>[0]) => {
	if (!locals.user || locals.user.role !== 'guru') throw redirect(302, '/');

	const db = getDB(platform);
	const examId = parseInt(params.examId, 10);
	if (isNaN(examId)) throw error(400, 'Invalid Exam ID');

	const exam = await db.prepare(`
		SELECT * FROM exams 
		WHERE id = ? AND school_id = ? 
		AND (created_by = ? OR EXISTS (SELECT 1 FROM exam_teachers et WHERE et.exam_id = exams.id AND et.teacher_id = ?))
	`).bind(examId, locals.user.school_id, locals.user.id, locals.user.id).first();

	if (!exam) throw error(404, 'Ujian tidak ditemukan atau Anda tidak memiliki akses.');

	const questionsReq = db.prepare('SELECT id, question_number, type, question_text FROM questions WHERE exam_id = ? ORDER BY question_number').bind(examId).all();
	const attemptsReq = db.prepare('SELECT id, student_id, score FROM student_attempts WHERE exam_id = ? AND status IN ("selesai", "waktu_habis") ORDER BY score DESC, id ASC').bind(examId).all();
	const answersReq = db.prepare('SELECT sa.attempt_id, sa.question_id, sa.is_correct, sa.answer_given FROM student_answers sa JOIN student_attempts a ON sa.attempt_id = a.id WHERE a.exam_id = ?').bind(examId).all();

	const [questionsRes, attemptsRes, answersRes] = await Promise.all([questionsReq, attemptsReq, answersReq]);

	const questions = questionsRes.results as any[];
	const attempts = attemptsRes.results as any[];
	const answers = answersRes.results as any[];

	// Calculate Upper and Lower groups
	const totalAttempts = attempts.length;
	let groupSize = Math.ceil(totalAttempts * 0.27);
	if (totalAttempts > 0 && groupSize === 0) groupSize = 1;
	if (groupSize > Math.floor(totalAttempts / 2)) {
		groupSize = Math.floor(totalAttempts / 2);
	}

	const upperAttempts = new Set(attempts.slice(0, groupSize).map(a => a.id));
	const lowerAttempts = new Set(attempts.slice(-groupSize).map(a => a.id));

	const answersByQuestion = answers.reduce((acc, ans) => {
		if (!acc[ans.question_id]) acc[ans.question_id] = [];
		acc[ans.question_id].push(ans);
		return acc;
	}, {} as Record<number, any[]>);

	const analysis = questions.map(q => {
		const qAnswers = answersByQuestion[q.id] || [];
		
		let correctCount = 0;
		let upperCorrect = 0;
		let lowerCorrect = 0;
		const distribution: Record<string, number> = {};

		qAnswers.forEach((ans: any) => {
			if (ans.is_correct) {
				correctCount++;
				if (upperAttempts.has(ans.attempt_id)) upperCorrect++;
				if (lowerAttempts.has(ans.attempt_id)) lowerCorrect++;
			}

			if (q.type === 'pilihan_ganda' || q.type === 'pilihan_ganda_kompleks') {
				const given = ans.answer_given || '-';
				distribution[given] = (distribution[given] || 0) + 1;
			}
		});

		const p = totalAttempts > 0 ? correctCount / totalAttempts : 0;
		
		let pCategory = 'Sedang';
		if (p < 0.3) pCategory = 'Sukar';
		else if (p > 0.7) pCategory = 'Mudah';

		const d = groupSize > 0 ? (upperCorrect - lowerCorrect) / groupSize : 0;
		
		let dCategory = 'Cukup';
		let status = 'Gunakan';
		if (d >= 0.4) {
			dCategory = 'Sangat Baik';
		} else if (d >= 0.3) {
			dCategory = 'Baik';
		} else if (d >= 0.2) {
			dCategory = 'Cukup';
			status = 'Revisi';
		} else {
			dCategory = 'Buruk';
			status = 'Buang / Revisi Total';
		}

		return {
			...q,
			correctCount,
			pIndex: parseFloat(p.toFixed(2)),
			pCategory,
			upperCorrect,
			lowerCorrect,
			dIndex: parseFloat(d.toFixed(2)),
			dCategory,
			status,
			distribution
		};
	});

	return {
		exam: exam as any,
		totalAttempts,
		groupSize,
		analysis
	};
};
