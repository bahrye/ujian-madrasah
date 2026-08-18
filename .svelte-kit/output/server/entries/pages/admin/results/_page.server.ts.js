import { fail, redirect } from "@sveltejs/kit";
import { g as getDB } from "../../../../chunks/db.js";
import { d as deleteFromCloudinary } from "../../../../chunks/cloudinary.js";
import { b as private_env } from "../../../../chunks/shared-server.js";
import { f as formatExamTitle } from "../../../../chunks/exam.js";
const load = async ({ platform, url, locals }) => {
  if (!locals.user) throw redirect(302, "/login");
  const db = getDB(platform);
  const examFilterStr = url.searchParams.get("exam_id") || "";
  const examFilter = parseInt(examFilterStr, 10);
  const examsRes = await db.prepare(`
		SELECT e.id, e.title, e.show_score_type, s.name as subject_name, et.code as exam_type_code, c.name as class_name
		FROM exams e 
		LEFT JOIN subjects s ON e.subject_id = s.id
		LEFT JOIN exam_types et ON e.exam_type_id = et.id
		LEFT JOIN classes c ON e.class_id = c.id
		WHERE e.school_id = ? 
		ORDER BY e.title
	`).bind(locals.user.school_id).all();
  const exams = (examsRes.results || []).map((e) => ({
    ...e,
    title: formatExamTitle({
      title: e.title,
      examTypeCode: e.exam_type_code,
      subjectName: e.subject_name,
      className: e.class_name
    })
  }));
  let query = `
		SELECT sa.*, 
		       COALESCE(sa.is_score_released, 0) as is_score_released,
		       COALESCE(sa.is_graded, 0) as is_graded,
		       (SELECT COUNT(*) 
		        FROM questions q 
		        JOIN student_answers ans ON ans.question_id = q.id 
		        WHERE q.exam_id = e.id 
		          AND ans.attempt_id = sa.id 
		          AND q.type IN ('essay', 'isian') 
		          AND ans.is_correct IS NULL
		       ) as ungraded_count,
		       u.name as student_name, u.username, u.nomor_peserta, u.nisn, e.title as exam_title, s.name as subject_name, et.code as exam_type_code, c.name as class_name, e.show_score_type, e.end_time as exam_end_time, et.end_time as exam_type_end_time
		FROM student_attempts sa
		JOIN users u ON sa.student_id = u.id
		JOIN exams e ON sa.exam_id = e.id
		LEFT JOIN subjects s ON e.subject_id = s.id
		LEFT JOIN exam_types et ON e.exam_type_id = et.id
		LEFT JOIN classes c ON e.class_id = c.id
		WHERE sa.status IN ('selesai', 'waktu_habis') AND e.school_id = ?
	`;
  const params = [locals.user.school_id];
  if (!isNaN(examFilter)) {
    query += " AND e.id = ?";
    params.push(examFilter);
  }
  query += " ORDER BY sa.submit_time DESC";
  const resultsRes = await db.prepare(query).bind(...params).all();
  const results = (resultsRes.results || []).map((r) => ({
    ...r,
    exam_title: formatExamTitle({
      title: r.exam_title,
      examTypeCode: r.exam_type_code,
      subjectName: r.subject_name,
      className: r.class_name
    })
  }));
  return {
    exams,
    results,
    examFilter: isNaN(examFilter) ? "" : String(examFilter)
  };
};
const actions = {
  toggleRelease: async ({ request, platform, locals }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });
    const db = getDB(platform);
    const form = await request.formData();
    const attemptId = parseInt(form.get("attempt_id")?.toString() || "", 10);
    if (isNaN(attemptId)) return fail(400, { error: "ID tidak valid" });
    const attempt = await db.prepare(`
			SELECT sa.id, sa.is_score_released, sa.is_graded,
			       (SELECT COUNT(*) FROM questions q JOIN student_answers ans ON ans.question_id = q.id WHERE q.exam_id = sa.exam_id AND ans.attempt_id = sa.id AND q.type IN ('essay', 'isian') AND ans.is_correct IS NULL) as ungraded_count
			FROM student_attempts sa
			JOIN exams e ON sa.exam_id = e.id
			WHERE sa.id = ? AND e.school_id = ?
		`).bind(attemptId, locals.user.school_id).first();
    if (!attempt) return fail(404, { error: "Data hasil ujian tidak ditemukan." });
    const isComplete = attempt.is_graded === 1 || attempt.ungraded_count === 0;
    if (!isComplete && attempt.is_score_released !== 1) {
      return fail(400, { error: "Nilai belum lengkap. Selesaikan penilaian essay/isian terlebih dahulu sebelum mengirim nilai." });
    }
    const newStatus = attempt.is_score_released === 1 ? 0 : 1;
    await db.prepare("UPDATE student_attempts SET is_score_released = ? WHERE id = ?").bind(newStatus, attemptId).run();
    return { success: true, released: newStatus === 1 };
  },
  releaseAll: async ({ request, platform, locals }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });
    const db = getDB(platform);
    const form = await request.formData();
    const examId = parseInt(form.get("exam_id")?.toString() || "", 10);
    if (isNaN(examId)) return fail(400, { error: "Pilih ujian terlebih dahulu" });
    await db.prepare(`
			UPDATE student_attempts
			SET is_score_released = 1
			WHERE exam_id = ? 
			  AND status IN ('selesai', 'waktu_habis')
			  AND (
				is_graded = 1 OR NOT EXISTS (
					SELECT 1 FROM questions q 
					JOIN student_answers ans ON ans.question_id = q.id 
					WHERE q.exam_id = student_attempts.exam_id 
					  AND ans.attempt_id = student_attempts.id 
					  AND q.type IN ('essay', 'isian') 
					  AND ans.is_correct IS NULL
				)
			  )
		`).bind(examId).run();
    return { success: true, releaseAll: true };
  },
  delete: async ({ request, platform, locals }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });
    const db = getDB(platform);
    const form = await request.formData();
    const attemptIdStr = form.get("attempt_id")?.toString();
    const parsedId = parseInt(attemptIdStr || "", 10);
    if (isNaN(parsedId)) {
      return fail(400, { error: "ID tidak valid" });
    }
    try {
      const attemptCheck = await db.prepare(`
				SELECT sa.id, sa.signature FROM student_attempts sa
				JOIN exams e ON sa.exam_id = e.id
				WHERE sa.id = ? AND e.school_id = ?
			`).bind(parsedId, locals.user.school_id).first();
      if (!attemptCheck) {
        return fail(403, { error: "Data hasil ujian tidak ditemukan atau bukan milik sekolah Anda." });
      }
      if (attemptCheck.signature && attemptCheck.signature.includes("res.cloudinary.com")) {
        const mergedEnv = platform?.env || private_env;
        await deleteFromCloudinary(attemptCheck.signature, mergedEnv);
      }
      await db.batch([
        db.prepare("DELETE FROM student_answers WHERE attempt_id = ?").bind(parsedId),
        db.prepare("DELETE FROM student_attempts WHERE id = ?").bind(parsedId)
      ]);
      return { success: true };
    } catch (e) {
      console.error("Error deleting attempt:", e);
      return fail(500, { error: e.message || "Terjadi kesalahan saat menghapus data ujian." });
    }
  }
};
export {
  actions,
  load
};
