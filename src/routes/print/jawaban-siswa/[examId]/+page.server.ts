import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { formatExamTitle } from '$lib/utils/exam';

export const load: PageServerLoad = async ({ params, platform, locals }) => {
	if (!locals.user || !['superadmin', 'admin', 'guru', 'panitia'].includes(locals.user.role)) {
		throw redirect(302, '/login');
	}

	const db = getDB(platform);
	const examId = parseInt(params.examId, 10);
	if (isNaN(examId)) throw error(400, 'ID Ujian tidak valid');

	// Verify exam
	let exam: any = null;
	if (locals.user.role === 'superadmin') {
		exam = await db.prepare(`
			SELECT e.*, s.name as subject_name, et.code as exam_type_code, c.name as class_name, c.level as class_level,
			       u.name as teacher_name, u.nip as teacher_nip
			FROM exams e
			LEFT JOIN subjects s ON e.subject_id = s.id
			LEFT JOIN exam_types et ON e.exam_type_id = et.id
			LEFT JOIN classes c ON e.class_id = c.id
			LEFT JOIN users u ON e.created_by = u.id
			WHERE e.id = ?
		`).bind(examId).first<any>();
	} else {
		exam = await db.prepare(`
			SELECT e.*, s.name as subject_name, et.code as exam_type_code, c.name as class_name, c.level as class_level,
			       u.name as teacher_name, u.nip as teacher_nip
			FROM exams e
			LEFT JOIN subjects s ON e.subject_id = s.id
			LEFT JOIN exam_types et ON e.exam_type_id = et.id
			LEFT JOIN classes c ON e.class_id = c.id
			LEFT JOIN users u ON e.created_by = u.id
			WHERE e.id = ? AND e.school_id = ?
		`).bind(examId, locals.user.school_id).first<any>();
	}

	if (!exam) throw error(404, 'Ujian tidak ditemukan');

	exam.display_title = formatExamTitle({
		title: exam.title,
		examTypeCode: exam.exam_type_code,
		subjectName: exam.subject_name,
		className: exam.class_name,
		classLevel: exam.class_level
	});

	const effectiveSchoolId = locals.user.school_id || exam.school_id || 1;

	// School info
	const school = await db.prepare(`
		SELECT * FROM schools WHERE id = ?
	`).bind(effectiveSchoolId).first<any>();

	// Questions
	const questionsRes = await db.prepare(`
		SELECT id, question_number, type, question_text, points, options_json, correct_answer_json 
		FROM questions 
		WHERE exam_id = ? 
		ORDER BY question_number ASC, id ASC
	`).bind(examId).all<any>();

	// Attempts
	const attemptsRes = await db.prepare(`
		SELECT sa.id, sa.student_id, sa.score, sa.total_points, sa.status, sa.created_at, sa.submit_time,
		       u.name as student_name, u.username, u.nisn, u.nomor_peserta, u.class_id, c.name as class_name
		FROM student_attempts sa
		JOIN users u ON sa.student_id = u.id
		LEFT JOIN classes c ON u.class_id = c.id
		WHERE sa.exam_id = ? AND sa.status IN ('selesai', 'waktu_habis')
		ORDER BY c.name ASC, u.name ASC
	`).bind(examId).all<any>();

	// Answers
	const answersRes = await db.prepare(`
		SELECT sa.attempt_id, sa.question_id, sa.is_correct, sa.answer_given, sa.score_given
		FROM student_answers sa
		JOIN student_attempts a ON sa.attempt_id = a.id
		WHERE a.exam_id = ?
	`).bind(examId).all<any>();

	const questions = questionsRes.results || [];
	const attempts = attemptsRes.results || [];
	const answers = answersRes.results || [];
	const totalAttempts = attempts.length;

	// Clean text helper
	const cleanHtml = (html: string | null) => {
		if (!html) return '';
		return html.replace(/<[^>]*>?/gm, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
	};

	// Map answers
	const answerMatrixMap: Record<string, any> = {};
	const answersByQuestion: Record<number, any[]> = {};
	for (const ans of answers) {
		answerMatrixMap[`${ans.attempt_id}_${ans.question_id}`] = ans;
		if (!answersByQuestion[ans.question_id]) {
			answersByQuestion[ans.question_id] = [];
		}
		answersByQuestion[ans.question_id].push(ans);
	}

	// Question Diagnostics
	const questionDiagnostics = questions.map((q, idx) => {
		let correctCount = 0;
		let wrongCount = 0;
		let emptyCount = 0;

		const distribution: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 };
		const wrongDistribution: Record<string, number> = {};

		let cleanCorrectKey = '-';
		if (q.type === 'essay' || q.type === 'isian') {
			cleanCorrectKey = '-';
		} else if (q.type === 'benar_salah') {
			try {
				let raw = q.correct_answer_json;
				if (typeof raw === 'string' && (raw.startsWith('{') || raw.startsWith('['))) raw = JSON.parse(raw);
				const str = String(raw).toLowerCase().trim();
				cleanCorrectKey = (str === 'true' || str === 'benar' || str === 'b' || str === '1') ? 'B' : 'S';
			} catch {
				const str = (q.correct_answer_json || '').toLowerCase().trim();
				cleanCorrectKey = (str === 'true' || str === 'benar' || str === 'b' || str === '1') ? 'B' : 'S';
			}
		} else {
			try {
				if (q.correct_answer_json) {
					const parsed = JSON.parse(q.correct_answer_json);
					if (Array.isArray(parsed)) {
						cleanCorrectKey = parsed.map(x => String(x).trim().toUpperCase()).join(', ');
					} else if (typeof parsed === 'object' && parsed !== null) {
						cleanCorrectKey = Object.entries(parsed).map(([k, v]) => `${k}:${v}`).join(', ');
					} else {
						cleanCorrectKey = String(parsed).trim().toUpperCase();
					}
				}
			} catch {
				cleanCorrectKey = (q.correct_answer_json || '-').trim().toUpperCase();
			}
		}

		for (const att of attempts) {
			const ans = answerMatrixMap[`${att.id}_${q.id}`];
			if (!ans || ans.answer_given == null || ans.answer_given === '') {
				emptyCount++;
			} else if (ans.is_correct === 1 || ans.is_correct === true) {
				correctCount++;
				const given = (ans.answer_given || '').trim().toUpperCase();
				if (distribution[given] !== undefined) distribution[given]++;
			} else {
				wrongCount++;
				const given = (ans.answer_given || '').trim().toUpperCase();
				if (distribution[given] !== undefined) distribution[given]++;
				if (given) {
					wrongDistribution[given] = (wrongDistribution[given] || 0) + 1;
				}
			}
		}

		let dominantDistractor = '-';
		let dominantDistractorCount = 0;
		for (const [opt, count] of Object.entries(wrongDistribution)) {
			if (count > dominantDistractorCount) {
				dominantDistractorCount = count;
				dominantDistractor = opt;
			}
		}

		const wrongPercentage = totalAttempts > 0 ? Math.round(((wrongCount + emptyCount) / totalAttempts) * 100) : 0;
		const correctPercentage = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;

		return {
			no: idx + 1,
			id: q.id,
			question_number: q.question_number,
			type: q.type,
			text: cleanHtml(q.question_text),
			points: q.points || 1,
			correctKey: cleanCorrectKey,
			correctCount,
			wrongCount,
			emptyCount,
			correctPercentage,
			wrongPercentage,
			dominantDistractor: dominantDistractorCount > 0 ? dominantDistractor : '-',
			dominantDistractorCount,
			dominantDistractorPct: totalAttempts > 0 ? Math.round((dominantDistractorCount / totalAttempts) * 100) : 0,
			distribution
		};
	});

	let totalExamScore = 0;
	attempts.forEach(a => {
		totalExamScore += (a.score || 0);
	});
	const avgScore = totalAttempts > 0 ? Math.round((totalExamScore / totalAttempts) * 10) / 10 : 0;
	const passCount = attempts.filter(a => (a.score || 0) >= 75).length;
	const passPercentage = totalAttempts > 0 ? Math.round((passCount / totalAttempts) * 100) : 0;

	// Teachers list for dropdown
	const teachersRes = await db.prepare(`
		SELECT id, name, nip, role FROM users 
		WHERE school_id = ? AND role IN ('guru', 'admin', 'superadmin', 'panitia') AND is_active = 1 
		ORDER BY name ASC
	`).bind(effectiveSchoolId).all<any>();

	return {
		school,
		exam,
		questions,
		attempts,
		answerMatrixMap,
		questionDiagnostics,
		totalAttempts,
		avgScore,
		passPercentage,
		passCount,
		teachers: teachersRes.results || []
	};
};
