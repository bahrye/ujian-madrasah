import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { error, redirect } from '@sveltejs/kit';
import { formatExamTitle } from '$lib/utils/exam';

export const load: PageServerLoad = async ({ platform, params, locals, url }) => {
	if (!locals.user || !['superadmin', 'admin', 'guru', 'panitia'].includes(locals.user.role)) {
		throw redirect(302, '/login');
	}

	const db = getDB(platform);
	const examId = parseInt(params.exam_id, 10);
	if (isNaN(examId)) throw error(400, 'ID Ujian tidak valid');

	const kkmParam = url.searchParams.get('kkm');
	const kkm = kkmParam ? parseFloat(kkmParam) : 75;

	// 1. Fetch Exam
	let examQuery = `
		SELECT e.*, s.name as subject_name, et.code as exam_type_code, et.name as exam_type_name,
		       c.name as class_name, u.name as created_by_name, u.nip as created_by_nip
		FROM exams e
		LEFT JOIN subjects s ON e.subject_id = s.id
		LEFT JOIN exam_types et ON e.exam_type_id = et.id
		LEFT JOIN classes c ON e.class_id = c.id
		LEFT JOIN users u ON e.created_by = u.id
		WHERE e.id = ?
	`;
	const examParams: any[] = [examId];

	if (locals.user.role === 'guru') {
		examQuery += ` AND e.school_id = ? AND (e.created_by = ? OR EXISTS (SELECT 1 FROM exam_teachers et WHERE et.exam_id = e.id AND et.teacher_id = ?))`;
		examParams.push(locals.user.school_id, locals.user.id, locals.user.id);
	} else if (locals.user.role !== 'superadmin') {
		examQuery += ` AND e.school_id = ?`;
		examParams.push(locals.user.school_id);
	}

	const exam = await db.prepare(examQuery).bind(...examParams).first<any>();
	if (!exam) throw error(404, 'Ujian tidak ditemukan atau Anda tidak memiliki akses.');

	const effectiveSchoolId = locals.user.school_id || exam.school_id || 1;

	// 2. Fetch School info
	const school = await db.prepare('SELECT * FROM schools WHERE id = ?').bind(effectiveSchoolId).first<any>();

	// 3. Fetch Questions
	const questionsRes = await db.prepare(`
		SELECT id, question_number, type, points
		FROM questions
		WHERE exam_id = ?
		ORDER BY question_number ASC, id ASC
	`).bind(examId).all<any>();
	const questions = questionsRes.results || [];
	const totalQuestions = questions.length;

	// 4. Fetch Completed Attempts
	const attemptsRes = await db.prepare(`
		SELECT sa.id as attempt_id, sa.student_id, sa.score, sa.total_points, sa.status, sa.start_time, sa.submit_time,
		       u.name as student_name, u.username, u.nisn, u.nomor_peserta,
		       c.name as class_name,
		       er.name as room_name,
		       u.session_number
		FROM student_attempts sa
		JOIN users u ON sa.student_id = u.id
		LEFT JOIN classes c ON u.class_id = c.id
		LEFT JOIN exam_participants ep ON ep.exam_id = sa.exam_id AND ep.student_id = sa.student_id
		LEFT JOIN exam_rooms er ON ep.room_id = er.id
		WHERE sa.exam_id = ? AND sa.status IN ('selesai', 'waktu_habis')
		ORDER BY c.name ASC, u.name ASC
	`).bind(examId).all<any>();
	const attempts = attemptsRes.results || [];

	// 5. Fetch Answers
	const answersRes = await db.prepare(`
		SELECT an.attempt_id, an.question_id, an.is_correct, an.score_given
		FROM student_answers an
		JOIN student_attempts sa ON an.attempt_id = sa.id
		WHERE sa.exam_id = ?
	`).bind(examId).all<any>();
	const answers = answersRes.results || [];

	// Group answers by attempt_id
	const answersByAttempt: Record<number, any[]> = {};
	for (const a of answers) {
		if (!answersByAttempt[a.attempt_id]) {
			answersByAttempt[a.attempt_id] = [];
		}
		answersByAttempt[a.attempt_id].push(a);
	}

	// 6. Calculate per-student stats (Benar, Salah, Nilai, Keterangan)
	let sumScore = 0;
	let maxScore = attempts.length > 0 ? (attempts[0].score || 0) : 0;
	let minScore = attempts.length > 0 ? (attempts[0].score || 0) : 0;
	let passedCount = 0;

	const students = attempts.map((att: any, idx: number) => {
		const attAnswers = answersByAttempt[att.attempt_id] || [];
		let correctCount = 0;
		for (const ans of attAnswers) {
			if (ans.is_correct === 1 || ans.is_correct === true) {
				correctCount++;
			}
		}
		const incorrectCount = Math.max(0, totalQuestions - correctCount);
		const score = att.score != null ? Math.round(Number(att.score) * 100) / 100 : 0;

		sumScore += score;
		if (score > maxScore) maxScore = score;
		if (score < minScore) minScore = score;

		const isPassed = score >= kkm;
		if (isPassed) passedCount++;

		return {
			no: idx + 1,
			studentName: att.student_name,
			nis: att.nisn || att.nomor_peserta || att.username || '-',
			className: att.class_name || '-',
			roomName: att.room_name || '-',
			correctCount,
			incorrectCount,
			score: score.toFixed(2),
			isPassed,
			keterangan: isPassed ? 'Tuntas' : 'Belum tuntas',
			startTime: att.start_time,
			submitTime: att.submit_time
		};
	});

	const totalStudents = students.length;
	const meanScore = totalStudents > 0 ? Math.round((sumScore / totalStudents) * 100) / 100 : 0;
	const passedPercentage = totalStudents > 0 ? Math.round((passedCount / totalStudents) * 1000) / 10 : 0;

	// 7. Fetch Sessions
	const sessionsRes = await db.prepare(`
		SELECT * FROM exam_sessions WHERE exam_id = ? ORDER BY session_number ASC
	`).bind(examId).all<any>();
	const sessions = sessionsRes.results || [];

	// 8. Fetch Teachers
	const teachersRes = await db.prepare(`
		SELECT DISTINCT u.id, u.name, u.nip, u.role
		FROM users u
		WHERE u.id IN (
			SELECT et.teacher_id FROM exam_teachers et WHERE et.exam_id = ?
			UNION
			SELECT created_by FROM exams WHERE id = ?
		)
		AND u.is_active = 1
		ORDER BY u.name ASC
	`).bind(examId, examId).all<any>();
	const teachers = teachersRes.results || [];

	return {
		school,
		exam,
		kkm,
		totalQuestions,
		students,
		totalStudents,
		stats: {
			meanScore: meanScore.toFixed(2),
			maxScore: maxScore.toFixed(2),
			minScore: minScore.toFixed(2),
			passedCount,
			passedPercentage: passedPercentage.toFixed(1)
		},
		sessions,
		teachers
	};
};
