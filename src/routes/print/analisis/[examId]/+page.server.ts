import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { error, redirect } from '@sveltejs/kit';
import { formatExamTitle } from '$lib/utils/exam';

export const load: PageServerLoad = async ({ platform, params, locals }) => {
	if (!locals.user || !['superadmin', 'admin', 'guru', 'panitia'].includes(locals.user.role)) {
		throw redirect(302, '/login');
	}

	const db = getDB(platform);
	const examId = parseInt(params.examId, 10);
	if (isNaN(examId)) throw error(400, 'ID Ujian tidak valid');

	// Get exam info
	let exam: any = null;
	if (locals.user.role === 'superadmin') {
		exam = await db.prepare(`
			SELECT e.*, s.name as subject_name, et.code as exam_type_code, et.name as exam_type_name,
			       c.name as class_name, c.level as class_level, u.name as teacher_name, u.nip as teacher_nip
			FROM exams e
			LEFT JOIN subjects s ON e.subject_id = s.id
			LEFT JOIN exam_types et ON e.exam_type_id = et.id
			LEFT JOIN classes c ON e.class_id = c.id
			LEFT JOIN users u ON e.created_by = u.id
			WHERE e.id = ?
		`).bind(examId).first<any>();
	} else {
		exam = await db.prepare(`
			SELECT e.*, s.name as subject_name, et.code as exam_type_code, et.name as exam_type_name,
			       c.name as class_name, c.level as class_level, u.name as teacher_name, u.nip as teacher_nip
			FROM exams e
			LEFT JOIN subjects s ON e.subject_id = s.id
			LEFT JOIN exam_types et ON e.exam_type_id = et.id
			LEFT JOIN classes c ON e.class_id = c.id
			LEFT JOIN users u ON e.created_by = u.id
			WHERE e.id = ? AND e.school_id = ?
		`).bind(examId, locals.user.school_id).first<any>();
	}

	if (!exam) throw error(404, 'Ujian tidak ditemukan');

	const effectiveSchoolId = locals.user.school_id || exam.school_id || 1;

	// Get school info
	const school = await db.prepare('SELECT * FROM schools WHERE id = ?').bind(effectiveSchoolId).first<any>();

	exam.display_title = formatExamTitle({
		title: exam.title,
		examTypeCode: exam.exam_type_code,
		subjectName: exam.subject_name,
		className: exam.class_name,
		classLevel: exam.class_level
	});

	// Get questions, attempts, answers
	const questionsReq = db.prepare(`
		SELECT id, question_number, type, question_text, points, options_json, correct_answer_json 
		FROM questions 
		WHERE exam_id = ? 
		ORDER BY question_number ASC, id ASC
	`).bind(examId).all<any>();

	const attemptsReq = db.prepare(`
		SELECT sa.id, sa.student_id, sa.score, sa.total_points, sa.status, sa.created_at,
		       u.name as student_name, u.username, u.nisn, u.nomor_peserta, c.name as class_name
		FROM student_attempts sa
		JOIN users u ON sa.student_id = u.id
		LEFT JOIN classes c ON u.class_id = c.id
		WHERE sa.exam_id = ? AND sa.status IN ('selesai', 'waktu_habis')
		ORDER BY sa.score DESC, sa.id ASC
	`).bind(examId).all<any>();

	const answersReq = db.prepare(`
		SELECT sa.attempt_id, sa.question_id, sa.is_correct, sa.answer_given, sa.score_given
		FROM student_answers sa
		JOIN student_attempts a ON sa.attempt_id = a.id
		WHERE a.exam_id = ?
	`).bind(examId).all<any>();

	const [questionsRes, attemptsRes, answersRes] = await Promise.all([questionsReq, attemptsReq, answersReq]);

	const questions = questionsRes.results || [];
	const attempts = attemptsRes.results || [];
	const answers = answersRes.results || [];

	const totalAttempts = attempts.length;
	let groupSize = Math.ceil(totalAttempts * 0.27);
	if (totalAttempts > 0 && groupSize === 0) groupSize = 1;
	if (groupSize > Math.floor(totalAttempts / 2)) {
		groupSize = Math.floor(totalAttempts / 2);
	}

	const upperAttemptsSet = new Set(attempts.slice(0, groupSize).map(a => a.id));
	const lowerAttemptsSet = new Set(attempts.slice(-groupSize).map(a => a.id));

	// Group answers by question
	const answersByQuestion: Record<number, any[]> = {};
	for (const ans of answers) {
		if (!answersByQuestion[ans.question_id]) {
			answersByQuestion[ans.question_id] = [];
		}
		answersByQuestion[ans.question_id].push(ans);
	}

	// Helper to extract clean text from HTML
	const cleanHtml = (html: string | null) => {
		if (!html) return '';
		return html.replace(/<[^>]*>?/gm, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
	};

	let totalExamScore = 0;
	let maxExamScore = attempts.length > 0 ? attempts[0].score || 0 : 0;
	let minExamScore = attempts.length > 0 ? attempts[attempts.length - 1].score || 0 : 0;

	attempts.forEach(a => {
		const s = a.score || 0;
		totalExamScore += s;
		if (s > maxExamScore) maxExamScore = s;
		if (s < minExamScore) minExamScore = s;
	});

	const avgExamScore = totalAttempts > 0 ? Math.round((totalExamScore / totalAttempts) * 10) / 10 : 0;

	// Calculate item analysis
	const analysis = questions.map((q, idx) => {
		const qAnswers = answersByQuestion[q.id] || [];
		let correctCount = 0;
		let upperCorrect = 0;
		let lowerCorrect = 0;

		const distribution: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 };

		for (const ans of qAnswers) {
			if (ans.is_correct === 1 || ans.is_correct === true) {
				correctCount++;
				if (upperAttemptsSet.has(ans.attempt_id)) upperCorrect++;
				if (lowerAttemptsSet.has(ans.attempt_id)) lowerCorrect++;
			}

			if (q.type === 'pilihan_ganda' || q.type === 'pilihan_ganda_kompleks') {
				const given = (ans.answer_given || '').trim().toUpperCase();
				if (distribution[given] !== undefined) {
					distribution[given]++;
				} else if (given) {
					distribution[given] = (distribution[given] || 0) + 1;
				}
			}
		}

		// P (Difficulty Index)
		const p = totalAttempts > 0 ? correctCount / totalAttempts : 0;
		let pCategory = 'Sedang';
		if (p < 0.3) pCategory = 'Sukar';
		else if (p > 0.7) pCategory = 'Mudah';

		// D (Discrimination Index)
		const d = groupSize > 0 ? (upperCorrect - lowerCorrect) / groupSize : 0;
		let dCategory = 'Cukup';
		let status = 'Gunakan';

		if (d >= 0.4) {
			dCategory = 'Sangat Baik';
			status = 'Gunakan';
		} else if (d >= 0.3) {
			dCategory = 'Baik';
			status = 'Gunakan';
		} else if (d >= 0.2) {
			dCategory = 'Cukup';
			status = 'Revisi';
		} else {
			dCategory = 'Buruk';
			status = 'Buang / Revisi Total';
		}

		let cleanCorrectKey = '-';
		try {
			if (q.correct_answer_json) {
				const parsed = JSON.parse(q.correct_answer_json);
				cleanCorrectKey = typeof parsed === 'string' ? parsed : JSON.stringify(parsed);
			}
		} catch {
			cleanCorrectKey = q.correct_answer_json || '-';
		}

		return {
			no: idx + 1,
			id: q.id,
			question_number: q.question_number,
			type: q.type,
			question_text: q.question_text,
			plain_text: cleanHtml(q.question_text),
			points: q.points || 1,
			correctKey: cleanCorrectKey,
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

	const summary = {
		total: analysis.length,
		gunakan: analysis.filter(a => a.status === 'Gunakan').length,
		revisi: analysis.filter(a => a.status === 'Revisi').length,
		buang: analysis.filter(a => a.status.startsWith('Buang')).length,
		mudah: analysis.filter(a => a.pCategory === 'Mudah').length,
		sedang: analysis.filter(a => a.pCategory === 'Sedang').length,
		sukar: analysis.filter(a => a.pCategory === 'Sukar').length,
		sangatBaikD: analysis.filter(a => a.dCategory === 'Sangat Baik').length,
		baikD: analysis.filter(a => a.dCategory === 'Baik').length,
		cukupD: analysis.filter(a => a.dCategory === 'Cukup').length,
		burukD: analysis.filter(a => a.dCategory === 'Buruk').length,
		avgScore: avgExamScore,
		maxScore: maxExamScore,
		minScore: minExamScore
	};

	const teachersRes = await db.prepare(`
		SELECT id, name, nip, role FROM users 
		WHERE school_id = ? AND role IN ('guru', 'admin', 'superadmin', 'panitia') AND is_active = 1 
		ORDER BY name ASC
	`).bind(effectiveSchoolId).all<any>();

	return {
		school,
		exam,
		totalAttempts,
		groupSize,
		analysis,
		summary,
		teachers: teachersRes.results || []
	};
};
