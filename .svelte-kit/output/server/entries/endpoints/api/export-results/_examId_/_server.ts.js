import { json } from "@sveltejs/kit";
import { g as getDB } from "../../../../../chunks/db.js";
const GET = async ({ params, platform, locals }) => {
  if (!locals.user || !["admin", "superadmin", "guru", "panitia"].includes(locals.user.role)) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  const db = getDB(platform);
  const examId = params.examId;
  let exam;
  if (locals.user.role === "superadmin") {
    exam = await db.prepare(`
			SELECT e.*, s.name as subject_name 
			FROM exams e
			LEFT JOIN subjects s ON e.subject_id = s.id
			WHERE e.id = ?
		`).bind(examId).first();
  } else if (locals.user.role === "guru") {
    exam = await db.prepare(`
			SELECT e.*, s.name as subject_name 
			FROM exams e
			LEFT JOIN subjects s ON e.subject_id = s.id
			WHERE e.id = ? AND e.school_id = ?
			AND (e.created_by = ? OR EXISTS (SELECT 1 FROM exam_teachers et WHERE et.exam_id = e.id AND et.teacher_id = ?))
		`).bind(examId, locals.user.school_id, locals.user.id, locals.user.id).first();
  } else {
    exam = await db.prepare(`
			SELECT e.*, s.name as subject_name 
			FROM exams e
			LEFT JOIN subjects s ON e.subject_id = s.id
			WHERE e.id = ? AND e.school_id = ?
		`).bind(examId, locals.user.school_id).first();
  }
  if (!exam) {
    return json({ error: "Ujian tidak ditemukan atau Anda tidak memiliki akses." }, { status: 404 });
  }
  const questions = await db.prepare(`
		SELECT * FROM questions 
		WHERE exam_id = ? 
		ORDER BY question_number ASC
	`).bind(examId).all();
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
  const allAnswersResult = await db.prepare(`
		SELECT an.attempt_id, an.question_id, an.answer_given, an.score_given, an.is_correct
		FROM student_answers an
		JOIN student_attempts sa ON an.attempt_id = sa.id
		WHERE sa.exam_id = ?
	`).bind(examId).all();
  const allAnswers = allAnswersResult.results;
  const kv = platform?.env?.EXAM_ANSWERS;
  const formattedParticipants = await Promise.all(participants.results.map(async (p) => {
    let answers = allAnswers.filter((a) => a.attempt_id === p.attempt_id);
    let status = p.status || "belum_mengerjakan";
    if (status === "mengerjakan" && kv && p.attempt_id) {
      const stored = await kv.get(`attempt_${p.attempt_id}_answers`);
      if (stored) {
        try {
          const data = JSON.parse(stored);
          if (data && data.answers) {
            Object.keys(data.answers).forEach((qId) => {
              const existing = answers.find((a) => a.question_id.toString() === qId);
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
        } catch (e) {
        }
      }
    }
    return {
      ...p,
      status,
      answers: answers.reduce((acc, curr) => {
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
export {
  GET
};
