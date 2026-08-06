import { fail } from "@sveltejs/kit";
import { g as getDB } from "../../../../chunks/db.js";
const load = async ({ platform, url, locals }) => {
  const db = getDB(platform);
  const examFilter = url.searchParams.get("exam_id") || "";
  const exams = await db.prepare("SELECT id, title FROM exams WHERE school_id = ? ORDER BY title").bind(locals.user.school_id).all();
  let query = `
		SELECT sa.*, u.name as student_name, e.title as exam_title, s.name as subject
		FROM student_attempts sa
		JOIN users u ON sa.student_id = u.id
		JOIN exams e ON sa.exam_id = e.id
		LEFT JOIN subjects s ON e.subject_id = s.id
		WHERE sa.status IN ('selesai', 'waktu_habis') AND e.school_id = ?
	`;
  const params = [locals.user.school_id];
  if (examFilter !== "") {
    query += " AND e.id = ?";
    params.push(examFilter);
  }
  query += " ORDER BY sa.submit_time DESC";
  const results = await db.prepare(query).bind(...params).all();
  return { results: results.results, exams: exams.results, examFilter };
};
const actions = {
  delete: async ({ request, platform, locals }) => {
    const db = getDB(platform);
    const form = await request.formData();
    const attemptId = form.get("attempt_id")?.toString();
    if (!attemptId) {
      return { success: false, error: "ID tidak valid" };
    }
    const parsedId = parseInt(attemptId, 10);
    if (isNaN(parsedId)) {
      return fail(400, { error: "ID tidak valid" });
    }
    try {
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
