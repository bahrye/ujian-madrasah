import { fail, error } from "@sveltejs/kit";
import { g as getDB } from "../../../../../chunks/db.js";
import { d as deleteFromCloudinary } from "../../../../../chunks/cloudinary.js";
import { b as private_env } from "../../../../../chunks/shared-server.js";
const load = async ({ platform, params, locals }) => {
  const db = getDB(platform);
  const exam = await db.prepare("SELECT * FROM exams WHERE id = ? AND school_id = ?").bind(params.examId, locals.user.school_id).first();
  if (!exam) throw error(404, "Ujian tidak ditemukan");
  const questions = await db.prepare("SELECT * FROM questions WHERE exam_id = ? ORDER BY question_number").bind(params.examId).all();
  return { exam, questions: questions.results };
};
const actions = {
  create: async ({ request, platform, params, locals }) => {
    const db = getDB(platform);
    const exam = await db.prepare("SELECT id FROM exams WHERE id = ? AND school_id = ?").bind(params.examId, locals.user.school_id).first();
    if (!exam) return fail(403, { error: "Anda tidak memiliki akses ke ujian ini." });
    const form = await request.formData();
    const type = form.get("type")?.toString();
    const questionText = form.get("question_text")?.toString().trim();
    const points = parseInt(form.get("points")?.toString() || "1");
    const mediaType = form.get("media_type")?.toString() || null;
    const mediaUrl = form.get("media_url")?.toString().trim() || null;
    const audioMaxPlays = parseInt(form.get("audio_max_plays")?.toString() || "3");
    if (!type || !questionText) return fail(400, { error: "Tipe dan teks soal wajib diisi." });
    const last = await db.prepare("SELECT MAX(question_number) as max_num FROM questions WHERE exam_id = ?").bind(params.examId).first();
    const nextNum = (last?.max_num ?? 0) + 1;
    let optionsJson = null;
    let correctAnswerJson = null;
    if (type === "pilihan_ganda") {
      const opts = [];
      for (let i = 0; i < 5; i++) {
        const opt = form.get(`option_${i}`)?.toString().trim();
        if (opt) opts.push(opt);
      }
      optionsJson = JSON.stringify(opts);
      correctAnswerJson = JSON.stringify(form.get("correct_answer")?.toString() || "A");
    } else if (type === "benar_salah") {
      optionsJson = JSON.stringify(["Benar", "Salah"]);
      correctAnswerJson = JSON.stringify(form.get("correct_answer")?.toString() || "Benar");
    } else if (type === "isian_singkat") {
      correctAnswerJson = JSON.stringify(form.get("correct_answer")?.toString().trim() || "");
    } else if (type === "menjodohkan") {
      const leftItems = [];
      const rightItems = [];
      for (let i = 0; i < 6; i++) {
        const l = form.get(`left_${i}`)?.toString().trim();
        const r = form.get(`right_${i}`)?.toString().trim();
        if (l && r) {
          leftItems.push(l);
          rightItems.push(r);
        }
      }
      optionsJson = JSON.stringify({ left: leftItems, right: rightItems });
      const mapping = {};
      leftItems.forEach((_, i) => {
        mapping[String(i)] = String(i);
      });
      correctAnswerJson = JSON.stringify(mapping);
    }
    await db.prepare(`INSERT INTO questions (exam_id, type, question_text, question_number, points,
			media_type, media_url, audio_max_plays, options_json, correct_answer_json)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(
      params.examId,
      type,
      questionText,
      nextNum,
      points,
      mediaType === "none" ? null : mediaType,
      mediaUrl,
      audioMaxPlays,
      optionsJson,
      correctAnswerJson
    ).run();
    return { success: "Soal berhasil ditambahkan." };
  },
  edit: async ({ request, platform, params, locals }) => {
    const db = getDB(platform);
    const exam = await db.prepare("SELECT id FROM exams WHERE id = ? AND school_id = ?").bind(params.examId, locals.user.school_id).first();
    if (!exam) return fail(403, { error: "Anda tidak memiliki akses ke ujian ini." });
    const form = await request.formData();
    const id = form.get("id")?.toString();
    const type = form.get("type")?.toString();
    const questionText = form.get("question_text")?.toString().trim();
    const points = parseInt(form.get("points")?.toString() || "1");
    const mediaType = form.get("media_type")?.toString() || null;
    const mediaUrl = form.get("media_url")?.toString().trim() || null;
    if (!id || !type || !questionText) return fail(400, { error: "ID, tipe, dan teks soal wajib diisi." });
    let optionsJson = null;
    let correctAnswerJson = null;
    if (type === "pilihan_ganda") {
      const opts = [];
      for (let i = 0; i < 5; i++) {
        const opt = form.get(`option_${i}`)?.toString().trim();
        if (opt) opts.push(opt);
      }
      optionsJson = JSON.stringify(opts);
      correctAnswerJson = JSON.stringify(form.get("correct_answer")?.toString() || "A");
    } else if (type === "benar_salah") {
      optionsJson = JSON.stringify(["Benar", "Salah"]);
      correctAnswerJson = JSON.stringify(form.get("correct_answer")?.toString() || "Benar");
    } else if (type === "isian_singkat") {
      correctAnswerJson = JSON.stringify(form.get("correct_answer")?.toString().trim() || "");
    } else if (type === "menjodohkan") {
      const leftItems = [];
      const rightItems = [];
      for (let i = 0; i < 6; i++) {
        const l = form.get(`left_${i}`)?.toString().trim();
        const r = form.get(`right_${i}`)?.toString().trim();
        if (l && r) {
          leftItems.push(l);
          rightItems.push(r);
        }
      }
      optionsJson = JSON.stringify({ left: leftItems, right: rightItems });
      const prevMap = await db.prepare("SELECT correct_answer_json FROM questions WHERE id = ?").bind(id).first();
      if (prevMap && prevMap.correct_answer_json) {
        correctAnswerJson = prevMap.correct_answer_json;
      } else {
        const mapping = {};
        leftItems.forEach((_, i) => {
          mapping[String(i)] = String(i);
        });
        correctAnswerJson = JSON.stringify(mapping);
      }
    }
    const prevMedia = await db.prepare("SELECT media_url FROM questions WHERE id = ?").bind(id).first();
    if (prevMedia && prevMedia.media_url && prevMedia.media_url !== mediaUrl && prevMedia.media_url.includes("res.cloudinary.com")) {
      await deleteFromCloudinary(prevMedia.media_url, private_env);
    }
    await db.prepare(`UPDATE questions SET 
			question_text = ?, points = ?, media_type = ?, media_url = ?, 
			options_json = ?, correct_answer_json = ? 
			WHERE id = ?`).bind(questionText, points, mediaType === "none" ? null : mediaType, mediaUrl, optionsJson, correctAnswerJson, id).run();
    return { success: "Soal berhasil diubah." };
  },
  delete: async ({ request, platform, params, locals }) => {
    const db = getDB(platform);
    const exam = await db.prepare("SELECT id FROM exams WHERE id = ? AND school_id = ?").bind(params.examId, locals.user.school_id).first();
    if (!exam) return fail(403, { error: "Anda tidak memiliki akses ke ujian ini." });
    const form = await request.formData();
    const id = form.get("id")?.toString();
    if (!id) return fail(400, { error: "ID tidak valid." });
    const q = await db.prepare("SELECT media_url FROM questions WHERE id = ?").bind(id).first();
    if (q && q.media_url && q.media_url.includes("res.cloudinary.com")) {
      await deleteFromCloudinary(q.media_url, private_env);
    }
    await db.prepare("DELETE FROM questions WHERE id = ?").bind(id).run();
    return { success: "Soal berhasil dihapus." };
  },
  importExcel: async ({ request, platform, params, locals }) => {
    const db = getDB(platform);
    const exam = await db.prepare("SELECT id FROM exams WHERE id = ? AND school_id = ?").bind(params.examId, locals.user.school_id).first();
    if (!exam) return fail(403, { error: "Anda tidak memiliki akses ke ujian ini." });
    const form = await request.formData();
    const questionsJson = form.get("questions_json")?.toString();
    if (!questionsJson) return fail(400, { error: "Data soal tidak valid." });
    let parsedQuestions = [];
    try {
      parsedQuestions = JSON.parse(questionsJson);
    } catch (e) {
      return fail(400, { error: "Format data soal tidak valid." });
    }
    if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
      return fail(400, { error: "Tidak ada soal yang ditemukan." });
    }
    const last = await db.prepare("SELECT MAX(question_number) as max_num FROM questions WHERE exam_id = ?").bind(params.examId).first();
    let nextNum = (last?.max_num ?? 0) + 1;
    const statements = [];
    const stmt = db.prepare(`INSERT INTO questions (exam_id, type, question_text, question_number, points, options_json, correct_answer_json) VALUES (?, ?, ?, ?, ?, ?, ?)`);
    for (const q of parsedQuestions) {
      statements.push(
        stmt.bind(params.examId, q.type, q.question_text, nextNum, q.points || 1, q.options_json || null, q.correct_answer_json || null)
      );
      nextNum++;
    }
    try {
      await db.batch(statements);
    } catch (e) {
      return fail(500, { error: "Gagal menyimpan soal ke database." });
    }
    return { success: `Berhasil mengimpor ${parsedQuestions.length} soal.` };
  }
};
export {
  actions,
  load
};
