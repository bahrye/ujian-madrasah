import { fail } from "@sveltejs/kit";
import { g as getDB } from "../../../../../../../../chunks/db.js";
const load = async ({ params, platform, locals }) => {
  const db = getDB(platform);
  const typeId = parseInt(params.typeId, 10);
  const classId = parseInt(params.classId, 10);
  if (isNaN(typeId) || isNaN(classId)) throw new Error("ID tidak valid");
  const examType = await db.prepare("SELECT * FROM exam_types WHERE id = ? AND school_id = ?").bind(typeId, locals.user.school_id).first();
  if (!examType) throw new Error("Tipe Ujian tidak ditemukan");
  const classData = await db.prepare("SELECT * FROM classes WHERE id = ? AND school_id = ?").bind(classId, locals.user.school_id).first();
  if (!classData) throw new Error("Kelas tidak ditemukan");
  const exams = await db.prepare(`
		SELECT e.*, u.name as creator_name, s.name as subject_name,
			(SELECT COUNT(*) FROM questions WHERE exam_id = e.id) as question_count,
			(SELECT COUNT(*) FROM exam_participants WHERE exam_id = e.id) as participant_count,
			(SELECT COUNT(*) FROM exam_teachers WHERE exam_id = e.id) as teacher_count,
			(SELECT COUNT(*) FROM exam_proctors WHERE exam_id = e.id) as proctor_count,
			COALESCE(
				(
					SELECT GROUP_CONCAT(u2.name, '||')
					FROM exam_proctors epr
					JOIN users u2 ON epr.proctor_id = u2.id
					WHERE epr.exam_id = e.id
				),
				(
					SELECT u3.name FROM users u3 WHERE u3.id = e.created_by AND u3.role = 'guru'
				)
			) as proctors
		FROM exams e
		LEFT JOIN users u ON e.created_by = u.id
		LEFT JOIN subjects s ON e.subject_id = s.id
		WHERE e.school_id = ? AND e.exam_type_id = ? AND (e.class_id = ? OR e.class_id IS NULL)
		ORDER BY e.created_at DESC
	`).bind(locals.user.school_id, typeId, classId).all();
  const examIds = exams.results.map((e) => e.id);
  let allSessions = [];
  if (examIds.length > 0) {
    try {
      const placeholders = examIds.map(() => "?").join(",");
      const sessionsResult = await db.prepare(`SELECT * FROM exam_sessions WHERE exam_id IN (${placeholders})`).bind(...examIds).all();
      allSessions = sessionsResult.results;
    } catch (e) {
      console.warn("Failed to fetch exam_sessions, table might not exist yet:", e.message);
    }
  }
  const examsWithSessions = exams.results.map((e) => ({
    ...e,
    sessions: allSessions.filter((s) => s.exam_id === e.id)
  }));
  const subjects = await db.prepare("SELECT id, name FROM subjects WHERE school_id = ? ORDER BY name").bind(locals.user.school_id).all();
  return { examType, classData, exams: examsWithSessions, subjects: subjects.results };
};
const actions = {
  create: async ({ request, params, platform, locals }) => {
    const db = getDB(platform);
    const form = await request.formData();
    const typeId = parseInt(params.typeId, 10);
    const classId = parseInt(params.classId, 10);
    if (isNaN(typeId) || isNaN(classId)) return fail(400, { error: "ID tidak valid" });
    const examType = await db.prepare("SELECT * FROM exam_types WHERE id = ? AND school_id = ?").bind(typeId, locals.user.school_id).first();
    if (!examType) return fail(400, { error: "Tipe Ujian tidak valid." });
    const subjectIdStr = form.get("subject_id")?.toString() || null;
    const parsedSubjectId = parseInt(subjectIdStr || "", 10);
    if (isNaN(parsedSubjectId)) return fail(400, { error: "Mata Pelajaran wajib dipilih." });
    const subject = await db.prepare("SELECT name FROM subjects WHERE id = ?").bind(parsedSubjectId).first();
    let title = `${examType.code} - ${subject.name}`;
    const description = form.get("description")?.toString().trim() || "";
    const durationMinutes = parseInt(form.get("duration_minutes")?.toString() || "60");
    const maxAttempts = parseInt(form.get("max_attempts")?.toString() || "1");
    const startTime = form.get("start_time")?.toString() || null;
    const endTime = form.get("end_time")?.toString() || null;
    const shuffleQuestions = parseInt(form.get("shuffle_questions")?.toString() || "0");
    const showScoreType = form.get("show_score_type")?.toString() || "after_submit";
    const isActive = form.get("is_active")?.toString() === "1" ? 1 : 0;
    if (startTime && examType.start_time) {
      if (new Date(startTime) < new Date(examType.start_time)) {
        return fail(400, { error: "Waktu mulai tidak boleh mendahului rentang waktu Tipe Ujian." });
      }
    }
    if (endTime && examType.end_time) {
      if (new Date(endTime) > new Date(examType.end_time)) {
        return fail(400, { error: "Waktu selesai tidak boleh melebihi rentang waktu Tipe Ujian." });
      }
    }
    try {
      const result = await db.prepare(`INSERT INTO exams (school_id, exam_type_id, class_id, title, description, subject_id, duration_minutes, start_time, end_time, is_active, shuffle_questions, show_score_type, max_attempts, created_by)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(locals.user.school_id, typeId, classId, title, description, parsedSubjectId, durationMinutes, startTime, endTime, isActive, shuffleQuestions, showScoreType, maxAttempts, locals.user?.id).run();
      const newExamId = result.meta?.last_row_id;
      if (newExamId) {
        const typeParticipants = await db.prepare(`
					SELECT id as student_id 
					FROM users 
					WHERE class_id = ? AND role = 'siswa' AND is_active = 1 AND school_id = ?
				`).bind(classId, locals.user.school_id).all();
        if (typeParticipants.results.length > 0) {
          const insertBatch = typeParticipants.results.map(
            (p) => db.prepare("INSERT OR IGNORE INTO exam_participants (exam_id, student_id) VALUES (?, ?)").bind(newExamId, p.student_id)
          );
          await db.batch(insertBatch);
        }
        if (form.get("use_sessions")) {
          const sessionBatch = [];
          for (let i = 1; i <= 4; i++) {
            const sStart = form.get(`session_${i}_start`)?.toString() || null;
            const sEnd = form.get(`session_${i}_end`)?.toString() || null;
            if (sStart || sEnd) {
              sessionBatch.push(
                db.prepare("INSERT INTO exam_sessions (exam_id, session_number, start_time, end_time) VALUES (?, ?, ?, ?)").bind(newExamId, i, sStart, sEnd)
              );
            }
          }
          if (sessionBatch.length > 0) await db.batch(sessionBatch);
        } else {
          await db.prepare(`
						UPDATE users 
						SET session_number = 1, updated_at = datetime('now')
						WHERE id IN (SELECT student_id FROM exam_participants WHERE exam_id = ?)
					`).bind(newExamId).run();
        }
      }
      return { success: "Ujian berhasil dibuat." };
    } catch (e) {
      console.error(e);
      return fail(500, { error: e.message || "Gagal membuat ujian" });
    }
  },
  update: async ({ request, platform, locals, params }) => {
    const db = getDB(platform);
    const form = await request.formData();
    const typeIdStr = params.typeId;
    const parsedTypeId = parseInt(typeIdStr, 10);
    if (isNaN(parsedTypeId)) return fail(400, { error: "ID Tipe Ujian tidak valid." });
    const examType = await db.prepare("SELECT * FROM exam_types WHERE id = ? AND school_id = ?").bind(parsedTypeId, locals.user.school_id).first();
    if (!examType) return fail(400, { error: "Tipe Ujian tidak valid." });
    const idStr = form.get("id")?.toString();
    const subjectIdStr = form.get("subject_id")?.toString() || null;
    const parsedId = parseInt(idStr || "", 10);
    const parsedSubjectId = parseInt(subjectIdStr || "", 10);
    if (isNaN(parsedId)) return fail(400, { error: "Data tidak lengkap." });
    if (isNaN(parsedSubjectId)) return fail(400, { error: "Mata pelajaran wajib diisi." });
    const subject = await db.prepare("SELECT name FROM subjects WHERE id = ?").bind(parsedSubjectId).first();
    let title = subject ? `${examType.code} - ${subject.name}` : void 0;
    const description = form.get("description")?.toString().trim() || "";
    const durationMinutes = parseInt(form.get("duration_minutes")?.toString() || "60");
    const maxAttempts = parseInt(form.get("max_attempts")?.toString() || "1");
    const startTime = form.get("start_time")?.toString() || null;
    const endTime = form.get("end_time")?.toString() || null;
    const isActive = form.get("is_active")?.toString() === "1" ? 1 : 0;
    const shuffleQuestions = parseInt(form.get("shuffle_questions")?.toString() || "0");
    const showScoreType = form.get("show_score_type")?.toString() || "after_submit";
    if (startTime && examType.start_time) {
      if (new Date(startTime) < new Date(examType.start_time)) {
        return fail(400, { error: "Waktu mulai tidak boleh mendahului rentang waktu Tipe Ujian." });
      }
    }
    if (endTime && examType.end_time) {
      if (new Date(endTime) > new Date(examType.end_time)) {
        return fail(400, { error: "Waktu selesai tidak boleh melebihi rentang waktu Tipe Ujian." });
      }
    }
    try {
      await db.prepare(`UPDATE exams SET title=?, description=?, subject_id=?, duration_minutes=?,
				start_time=?, end_time=?, is_active=?, shuffle_questions=?, show_score_type=?, max_attempts=?, updated_at=datetime('now') WHERE id=? AND school_id=?`).bind(title, description, parsedSubjectId, durationMinutes, startTime, endTime, isActive, shuffleQuestions, showScoreType, maxAttempts, parsedId, locals.user.school_id).run();
      await db.prepare("DELETE FROM exam_sessions WHERE exam_id = ?").bind(parsedId).run();
      if (form.get("use_sessions")) {
        const sessionBatch = [];
        for (let i = 1; i <= 4; i++) {
          const sStart = form.get(`session_${i}_start`)?.toString() || null;
          const sEnd = form.get(`session_${i}_end`)?.toString() || null;
          if (sStart || sEnd) {
            sessionBatch.push(
              db.prepare("INSERT INTO exam_sessions (exam_id, session_number, start_time, end_time) VALUES (?, ?, ?, ?)").bind(parsedId, i, sStart, sEnd)
            );
          }
        }
        if (sessionBatch.length > 0) await db.batch(sessionBatch);
      } else {
        await db.prepare(`
					UPDATE users 
					SET session_number = 1, updated_at = datetime('now')
					WHERE id IN (SELECT student_id FROM exam_participants WHERE exam_id = ?)
				`).bind(parsedId).run();
      }
      return { success: "Ujian berhasil diperbarui." };
    } catch (e) {
      console.error(e);
      return fail(500, { error: e.message || "Gagal mengupdate ujian" });
    }
  },
  delete: async ({ request, platform, locals }) => {
    const db = getDB(platform);
    const form = await request.formData();
    const idStr = form.get("id")?.toString();
    const parsedId = parseInt(idStr || "", 10);
    if (isNaN(parsedId)) return fail(400, { error: "ID tidak valid." });
    try {
      const attempts = await db.prepare("SELECT id FROM student_attempts WHERE exam_id = ?").bind(parsedId).all();
      const attemptIds = attempts.results.map((a) => a.id);
      const batch = [];
      if (attemptIds.length > 0) {
        const placeholders = attemptIds.map(() => "?").join(",");
        batch.push(db.prepare(`DELETE FROM student_answers WHERE attempt_id IN (${placeholders})`).bind(...attemptIds));
        batch.push(db.prepare("DELETE FROM student_attempts WHERE exam_id = ?").bind(parsedId));
      }
      batch.push(db.prepare("DELETE FROM questions WHERE exam_id = ?").bind(parsedId));
      batch.push(db.prepare("DELETE FROM tokens WHERE exam_id = ?").bind(parsedId));
      batch.push(db.prepare("DELETE FROM exam_participants WHERE exam_id = ?").bind(parsedId));
      batch.push(db.prepare("DELETE FROM exam_proctors WHERE exam_id = ?").bind(parsedId));
      batch.push(db.prepare("DELETE FROM exam_teachers WHERE exam_id = ?").bind(parsedId));
      batch.push(db.prepare("DELETE FROM exam_sessions WHERE exam_id = ?").bind(parsedId));
      batch.push(db.prepare("DELETE FROM exams WHERE id = ? AND school_id = ?").bind(parsedId, locals.user.school_id));
      await db.batch(batch);
      return { success: "Ujian berhasil dihapus." };
    } catch (e) {
      console.error("Delete error:", e);
      return fail(500, { error: "Gagal menghapus ujian." });
    }
  },
  toggleActive: async ({ request, platform, locals }) => {
    const db = getDB(platform);
    const form = await request.formData();
    const idStr = form.get("id")?.toString();
    const parsedId = parseInt(idStr || "", 10);
    if (isNaN(parsedId)) return fail(400, { error: "ID tidak valid." });
    try {
      await db.prepare(`UPDATE exams SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END, updated_at=datetime('now') WHERE id = ? AND school_id = ?`).bind(parsedId, locals.user.school_id).run();
      return { success: "Status ujian berhasil diperbarui." };
    } catch (e) {
      console.error(e);
      return fail(500, { error: e.message || "Gagal mengubah status ujian" });
    }
  }
};
export {
  actions,
  load
};
