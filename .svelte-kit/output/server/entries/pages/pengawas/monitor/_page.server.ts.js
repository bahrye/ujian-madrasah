import { fail } from "@sveltejs/kit";
import { g as getDB } from "../../../../chunks/db.js";
const load = async ({ platform, url }) => {
  const db = getDB(platform);
  const examFilter = url.searchParams.get("exam_id") || "";
  const exams = await db.prepare("SELECT id, title FROM exams WHERE is_active = 1 ORDER BY title").all();
  let attempts = [];
  if (examFilter) {
    const result = await db.prepare(`
			SELECT sa.*, u.name as student_name, u.username
			FROM student_attempts sa
			JOIN users u ON sa.student_id = u.id
			WHERE sa.exam_id = ?
			ORDER BY sa.status DESC, sa.start_time DESC
		`).bind(examFilter).all();
    attempts = result.results;
  } else {
    const result = await db.prepare(`
			SELECT sa.*, u.name as student_name, u.username, e.title as exam_title
			FROM student_attempts sa
			JOIN users u ON sa.student_id = u.id
			JOIN exams e ON sa.exam_id = e.id
			WHERE sa.status = 'mengerjakan'
			ORDER BY sa.start_time DESC
		`).all();
    attempts = result.results;
  }
  return { exams: exams.results, attempts, examFilter };
};
const actions = {
  resetAttempt: async ({ request, platform }) => {
    const db = getDB(platform);
    const form = await request.formData();
    const attemptId = form.get("attempt_id")?.toString();
    if (!attemptId) return fail(400, { error: "ID tidak valid." });
    await db.batch([
      db.prepare("DELETE FROM student_answers WHERE attempt_id = ?").bind(attemptId),
      db.prepare("DELETE FROM student_attempts WHERE id = ?").bind(attemptId)
    ]);
    return { success: "Sesi ujian siswa berhasil direset." };
  }
};
export {
  actions,
  load
};
