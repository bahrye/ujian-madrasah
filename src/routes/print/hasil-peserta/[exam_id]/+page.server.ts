import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { error, redirect } from '@sveltejs/kit';
import { finalizeExpiredAttempts } from '$lib/server/exam-finalize';

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

	// Auto-finalize sesi ujian yang waktu pengerjaannya sudah habis
	await finalizeExpiredAttempts(db, { schoolId: effectiveSchoolId, examId });

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
	const totalExamPoints = questions.reduce((sum: number, q: any) => sum + (q.points || 1), 0);

	// 4. Fetch Completed Attempts
	const attemptsRes = await db.prepare(`
		SELECT sa.id as attempt_id, sa.student_id, sa.score, sa.total_points, sa.status, 
		       sa.start_time, COALESCE(sa.submit_time, sa.end_time) as submit_time, sa.violation_count, sa.violation_logs,
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

	// 6. Format each student's complete result report card
	const students = attempts.map((att: any, idx: number) => {
		const attAnswers = answersByAttempt[att.attempt_id] || [];
		let correctCount = 0;
		let earnedPoints = 0;

		for (const ans of attAnswers) {
			const isCorr = ans.is_correct === 1 || ans.is_correct === true;
			if (isCorr) {
				correctCount++;
			}
			if (ans.score_given != null) {
				earnedPoints += Number(ans.score_given);
			} else if (isCorr) {
				earnedPoints += 1;
			}
		}

		const incorrectCount = Math.max(0, totalQuestions - correctCount);
		const scoreNum = att.score != null ? Math.round(Number(att.score) * 100) / 100 : 0;
		const isPassed = scoreNum >= kkm;

		// Parse violations
		let violations: any[] = [];
		try {
			if (att.violation_logs) {
				const parsed = JSON.parse(att.violation_logs);
				if (Array.isArray(parsed)) {
					violations = parsed.map((v: any, vIdx: number) => {
						let waktuStr = '-';
						if (v.time || v.timestamp) {
							const vDate = new Date(v.time || v.timestamp);
							if (!isNaN(vDate.getTime())) {
								const day = String(vDate.getDate()).padStart(2, '0');
								const mon = String(vDate.getMonth() + 1).padStart(2, '0');
								const h = String(vDate.getHours()).padStart(2, '0');
								const m = String(vDate.getMinutes()).padStart(2, '0');
								const s = String(vDate.getSeconds()).padStart(2, '0');
								waktuStr = `${day}/${mon} ${h}:${m}:${s}`;
							}
						}
						const jenisStr = v.type || 'Pelanggaran pengawasan';
						let ketStr = v.description || v.reason || '';
						if (!ketStr) {
							if (jenisStr.toLowerCase().includes('fullscreen') || jenisStr.toLowerCase().includes('layar')) {
								ketStr = 'Siswa keluar dari mode layar penuh';
							} else if (jenisStr.toLowerCase().includes('focus') || jenisStr.toLowerCase().includes('jendela') || jenisStr.toLowerCase().includes('tab')) {
								ketStr = 'Jendela ujian kehilangan fokus';
							} else {
								ketStr = jenisStr;
							}
						}
						return {
							no: vIdx + 1,
							waktu: waktuStr,
							jenis: jenisStr,
							keterangan: ketStr
						};
					});
				}
			}
		} catch {}

		// Submission status text
		let statusPengumpulan = 'Mandiri';
		if ((att.violation_count || 0) >= 3 && att.status === 'waktu_habis') {
			statusPengumpulan = 'Otomatis (pelanggaran)';
		} else if (att.status === 'waktu_habis') {
			statusPengumpulan = 'Otomatis (waktu habis)';
		}

		return {
			no: idx + 1,
			studentName: att.student_name,
			nisn: att.nisn || att.nomor_peserta || att.username || '-',
			className: att.class_name || '-',
			roomName: att.room_name || '-',
			startTime: att.start_time,
			submitTime: att.submit_time,
			correctCount,
			incorrectCount,
			earnedPoints: earnedPoints.toFixed(2),
			totalExamPoints: totalExamPoints.toFixed(2),
			score: scoreNum.toFixed(2),
			isPassed,
			keterangan: isPassed ? 'Tuntas' : 'Belum tuntas',
			violationCount: att.violation_count || violations.length || 0,
			statusPengumpulan,
			violations
		};
	});

	// 7. Fetch Teachers
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
		totalExamPoints,
		students,
		teachers
	};
};
