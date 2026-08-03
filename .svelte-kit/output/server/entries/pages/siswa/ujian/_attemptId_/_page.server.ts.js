import { fail, redirect, error } from "@sveltejs/kit";
import { g as getDB } from "../../../../../chunks/db.js";
const load = async ({ platform, locals, params, cookies }) => {
  const db = getDB(platform);
  const attemptId = params.attemptId;
  const attempt = await db.prepare(`
		SELECT sa.*, e.title as exam_title, s.name as subject, e.duration_minutes, e.shuffle_questions
		FROM student_attempts sa
		JOIN exams e ON sa.exam_id = e.id
		LEFT JOIN subjects s ON e.subject_id = s.id
		WHERE sa.id = ? AND sa.student_id = ?
	`).bind(attemptId, locals.user.id).first();
  if (!attempt) throw error(404, "Sesi ujian tidak ditemukan.");
  if (attempt.status !== "mengerjakan") {
    throw redirect(302, "/siswa");
  }
  const isVerified = cookies.get("exam_token_verified_" + attemptId);
  if (!isVerified) {
    throw redirect(302, `/siswa/ujian?exam_id=${attempt.exam_id}`);
  }
  let questions = await db.prepare(`
		SELECT q.* FROM questions q
		WHERE q.exam_id = ?
		ORDER BY q.question_number
	`).bind(attempt.exam_id).all();
  let questionsList = questions.results;
  if (attempt.shuffle_questions === 1) {
    let seed = attempt.id * 1234567;
    const random = () => {
      seed |= 0;
      seed = seed + 1831565813 | 0;
      let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
    for (let i = questionsList.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [questionsList[i], questionsList[j]] = [questionsList[j], questionsList[i]];
    }
  }
  const answers = await db.prepare(`
		SELECT sa.* FROM student_answers sa
		WHERE sa.attempt_id = ?
	`).bind(attemptId).all();
  const answerMap = {};
  for (const a of answers.results) {
    answerMap[a.question_id] = a;
  }
  const kv = platform?.env?.EXAM_ANSWERS;
  let kvData = null;
  if (kv) {
    const stored = await kv.get(`attempt_${attemptId}_answers`);
    if (stored) {
      try {
        kvData = JSON.parse(stored);
      } catch {
      }
    }
  }
  if (kvData) {
    for (const q of questionsList) {
      if (!answerMap[q.id]) {
        answerMap[q.id] = { answer_given: "", is_doubted: 0 };
      }
      if (kvData.answers && typeof kvData.answers[q.id] !== "undefined") {
        answerMap[q.id].answer_given = kvData.answers[q.id];
      }
      if (kvData.doubts && typeof kvData.doubts[q.id] !== "undefined") {
        answerMap[q.id].is_doubted = kvData.doubts[q.id] ? 1 : 0;
      }
    }
  }
  return {
    attempt,
    questions: questionsList,
    answerMap
  };
};
const actions = {
  saveAnswer: async ({ request, platform, params }) => {
    const kv = platform?.env?.EXAM_ANSWERS;
    if (!kv) return fail(500, { error: "KV not configured" });
    const form = await request.formData();
    const answersStr = form.get("answers")?.toString();
    const doubtsStr = form.get("doubts")?.toString();
    const warningsStr = form.get("warnings")?.toString();
    const warningLogsStr = form.get("warningLogs")?.toString();
    if (answersStr || warningsStr) {
      try {
        const payload = {
          answers: answersStr ? JSON.parse(answersStr) : {},
          doubts: doubtsStr ? JSON.parse(doubtsStr) : {},
          warnings: warningsStr ? parseInt(warningsStr, 10) : 0,
          warningLogs: warningLogsStr ? JSON.parse(warningLogsStr) : []
        };
        await kv.put(`attempt_${params.attemptId}_answers`, JSON.stringify(payload));
      } catch (e) {
        return fail(400, { error: "Invalid JSON payload" });
      }
    }
    return { saved: true };
  },
  submit: async ({ platform, params, locals }) => {
    const db = getDB(platform);
    const attemptId = params.attemptId;
    const attempt = await db.prepare("SELECT * FROM student_attempts WHERE id = ? AND student_id = ?").bind(attemptId, locals.user.id).first();
    if (!attempt || attempt.status !== "mengerjakan") {
      return fail(400, { error: "Sesi ujian tidak valid." });
    }
    let warnings = 0;
    let warningLogs = "[]";
    const kv = platform?.env?.EXAM_ANSWERS;
    if (kv) {
      const stored = await kv.get(`attempt_${attemptId}_answers`);
      if (stored) {
        try {
          const kvData = JSON.parse(stored);
          if (kvData && kvData.warnings) warnings = kvData.warnings;
          if (kvData && kvData.warningLogs) warningLogs = JSON.stringify(kvData.warningLogs);
          if (kvData && kvData.answers) {
            const kvUpdateStmts = [];
            for (const [qIdStr, ansVal] of Object.entries(kvData.answers)) {
              const qId = parseInt(qIdStr, 10);
              const isDoubted = kvData.doubts && kvData.doubts[qId] ? 1 : 0;
              kvUpdateStmts.push(
                db.prepare(`UPDATE student_answers SET answer_given = ?, is_doubted = ?, answered_at = datetime('now') WHERE attempt_id = ? AND question_id = ?`).bind(String(ansVal), isDoubted, attemptId, qId)
              );
            }
            if (kvUpdateStmts.length > 0) {
              await db.batch(kvUpdateStmts);
            }
          }
          await kv.delete(`attempt_${attemptId}_answers`);
        } catch (e) {
        }
      }
    }
    const answers = await db.prepare(`
			SELECT sa.*, q.type, q.correct_answer_json, q.points
			FROM student_answers sa
			JOIN questions q ON sa.question_id = q.id
			WHERE sa.attempt_id = ?
		`).bind(attemptId).all();
    let totalScore = 0;
    let totalPoints = 0;
    let objectiveScore = 0;
    let objectivePoints = 0;
    const updateStmts = [];
    for (const ans of answers.results) {
      totalPoints += ans.points;
      if (ans.type === "essay" || ans.type === "isian_singkat") {
        continue;
      }
      if (!ans.correct_answer_json || !ans.answer_given) {
        updateStmts.push(
          db.prepare("UPDATE student_answers SET score_given = 0, is_correct = 0 WHERE id = ?").bind(ans.id)
        );
        continue;
      }
      let correctAnswer;
      try {
        correctAnswer = JSON.parse(ans.correct_answer_json);
      } catch {
        continue;
      }
      let isCorrect = false;
      let partialScore = null;
      if (ans.type === "pilihan_ganda" || ans.type === "benar_salah") {
        isCorrect = ans.answer_given === correctAnswer;
      } else if (ans.type === "menjodohkan") {
        try {
          const givenMap = JSON.parse(ans.answer_given);
          const correctMap = typeof correctAnswer === "string" ? JSON.parse(correctAnswer) : correctAnswer;
          const keys = Object.keys(correctMap);
          const totalPairs = keys.length;
          if (totalPairs > 0) {
            let correctCount = 0;
            for (const key of keys) {
              if (givenMap[key] === correctMap[key]) correctCount++;
            }
            isCorrect = correctCount === totalPairs;
            partialScore = Math.round(correctCount / totalPairs * ans.points * 100) / 100;
          }
        } catch {
          isCorrect = false;
        }
      }
      const scoreGiven = partialScore !== null ? partialScore : isCorrect ? ans.points : 0;
      totalScore += scoreGiven;
      objectivePoints += ans.points;
      objectiveScore += scoreGiven;
      updateStmts.push(
        db.prepare("UPDATE student_answers SET score_given = ?, is_correct = ? WHERE id = ?").bind(scoreGiven, isCorrect ? 1 : 0, ans.id)
      );
    }
    const finalScore = totalPoints > 0 ? Math.round(totalScore / totalPoints * 1e3) / 10 : 0;
    const finalObjectiveScore = objectivePoints > 0 ? Math.round(objectiveScore / objectivePoints * 1e3) / 10 : 0;
    updateStmts.push(
      db.prepare(`UPDATE student_attempts SET status = 'selesai', submit_time = datetime('now'),
				score = ?, objective_score = ?, total_points = ?, violation_count = ?, violation_logs = ? WHERE id = ?`).bind(finalScore, finalObjectiveScore, totalPoints, warnings, warningLogs, attemptId)
    );
    await db.batch(updateStmts);
    throw redirect(302, "/siswa");
  }
};
export {
  actions,
  load
};
