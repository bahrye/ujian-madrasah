import { json } from '@sveltejs/kit';
import { getDB } from '$lib/server/db';

export const GET = async ({ params, platform, locals }: any) => {
	if (!locals.user || !['admin', 'superadmin', 'guru'].includes(locals.user.role)) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const db = getDB(platform);
	const examId = params.examId;

	// 1. Get Exam Details
	const exam = await db.prepare(`
		SELECT e.*, s.name as subject_name 
		FROM exams e
		LEFT JOIN subjects s ON e.subject_id = s.id
		WHERE e.id = ? AND e.school_id = ?
	`).bind(examId, locals.user.school_id).first();

	if (!exam) {
		return json({ error: 'Ujian tidak ditemukan.' }, { status: 404 });
	}

	// 2. Get All Questions for the Exam
	const questions = await db.prepare(`
		SELECT * FROM questions 
		WHERE exam_id = ? 
		ORDER BY question_number ASC
	`).bind(examId).all();

	// 3. Get All Participants and their attempts
	const participants = await db.prepare(`
		SELECT 
			epart.student_id,
			u.name as student_name, 
			u.username as nisn, 
			sa.id as attempt_id,
			sa.start_time,
			sa.end_time,
			sa.submit_time,
			sa.score,
			sa.total_points,
			sa.status,
			sa.violation_count
		FROM exam_participants epart
		JOIN users u ON epart.student_id = u.id
		LEFT JOIN student_attempts sa ON sa.student_id = epart.student_id AND sa.exam_id = epart.exam_id
		WHERE epart.exam_id = ?
		ORDER BY u.name ASC
	`).bind(examId).all();

	// 4. Get Student Answers for those attempts
	// Since Cloudflare D1 query limits could be an issue, we can fetch all answers for the exam and then map them
	const allAnswersResult = await db.prepare(`
		SELECT an.attempt_id, an.question_id, an.answer_given, an.score_given, an.is_correct
		FROM student_answers an
		JOIN student_attempts sa ON an.attempt_id = sa.id
		WHERE sa.exam_id = ?
	`).bind(examId).all();
	const allAnswers = allAnswersResult.results;

	// Also check KV for ongoing attempts if we want up-to-date answers for 'mengerjakan' status
	const kv = platform?.env?.EXAM_ANSWERS;
	
	const formattedParticipants = await Promise.all(participants.results.map(async (p: any) => {
		let answers = allAnswers.filter(a => a.attempt_id === p.attempt_id);
		let status = p.status || 'belum_mengerjakan';
		
		if (status === 'mengerjakan' && kv && p.attempt_id) {
			const stored = await kv.get(`attempt_${p.attempt_id}_answers`);
			if (stored) {
				try {
					const data = JSON.parse(stored);
					if (data && data.answers) {
						// KV only stores answer_given, not score_given (that's calculated on submit).
						// But for export, we can just show the answer given. Score will be 0.
						Object.keys(data.answers).forEach(qId => {
							const existing = answers.find((a: any) => a.question_id.toString() === qId);
							if (existing) {
								existing.answer_given = data.answers[qId];
							} else {
								answers.push({
									attempt_id: p.attempt_id,
									question_id: parseInt(qId),
									answer_given: data.answers[qId],
									score_given: 0,
									is_correct: 0
								});
							}
						});
					}
				} catch (e) {}
			}
		}

		return {
			...p,
			status,
			answers: answers.reduce((acc: any, curr: any) => {
				acc[curr.question_id] = curr;
				return acc;
			}, {})
		};
	}));

	return json({
		exam,
		questions: questions.results,
		participants: formattedParticipants
	});
};
