import { g as getDB } from "../../../../../chunks/db.js";
import { fail, error } from "@sveltejs/kit";
const load = async ({ platform, params, locals }) => {
  const db = getDB(platform);
  const examIdStr = params.id;
  const examId = parseInt(examIdStr, 10);
  if (isNaN(examId)) throw error(400, "ID Ujian tidak valid");
  const exam = await db.prepare("SELECT e.*, s.name as subject_name, et.code as exam_type_code, et.name as exam_type_name FROM exams e LEFT JOIN subjects s ON e.subject_id = s.id LEFT JOIN exam_types et ON e.exam_type_id = et.id WHERE e.id = ? AND e.school_id = ?").bind(examId, locals.user.school_id).first();
  if (!exam) throw error(404, "Ujian tidak ditemukan");
  const questions = await db.prepare("SELECT * FROM questions WHERE exam_id = ? ORDER BY question_number").bind(examId).all();
  const attempts = await db.prepare(`
		SELECT sa.*, u.name as student_name FROM student_attempts sa
		JOIN users u ON sa.student_id = u.id WHERE sa.exam_id = ? ORDER BY sa.created_at DESC
	`).bind(examId).all();
  const tokens = await db.prepare("SELECT * FROM tokens WHERE exam_id = ? ORDER BY created_at DESC").bind(examId).all();
  const sessionsCount = await db.prepare("SELECT COUNT(*) as count FROM exam_sessions WHERE exam_id = ?").bind(examId).first();
  const hasSessions = (sessionsCount?.count || 0) > 0;
  const participants = await db.prepare(`
		SELECT p.id as participant_id, u.id as user_id, u.name as student_name, u.username as nisn, c.name as class_name, u.session_number
		FROM exam_participants p
		JOIN users u ON p.student_id = u.id
		LEFT JOIN classes c ON u.class_id = c.id
		WHERE p.exam_id = ?
		ORDER BY c.name, u.name
	`).bind(examId).all();
  let classes = [];
  let allStudents = [];
  if (exam.exam_type_id) {
    const classesQuery = await db.prepare(`
			SELECT c.id, c.name FROM classes c
			JOIN exam_type_classes etc ON etc.class_id = c.id
			WHERE etc.exam_type_id = ? AND c.school_id = ?
			ORDER BY c.name
		`).bind(exam.exam_type_id, locals.user.school_id).all();
    classes = classesQuery.results;
    const studentsQuery = await db.prepare(`
			SELECT u.id, u.name, u.username, u.class_id FROM users u
			JOIN exam_type_classes etc ON etc.class_id = u.class_id
			WHERE etc.exam_type_id = ? AND u.school_id = ? AND u.role = 'siswa' AND u.is_active = 1
			ORDER BY u.name
		`).bind(exam.exam_type_id, locals.user.school_id).all();
    allStudents = studentsQuery.results;
  }
  const allTeachers = await db.prepare('SELECT id, name, username FROM users WHERE school_id = ? AND role = "guru" ORDER BY name').bind(locals.user.school_id).all();
  const examTeachers = await db.prepare(`
		SELECT et.id as exam_teacher_id, u.id as user_id, u.name, u.username
		FROM exam_teachers et
		JOIN users u ON et.teacher_id = u.id
		WHERE et.exam_id = ?
		ORDER BY u.name
	`).bind(examId).all();
  const allProctors = await db.prepare('SELECT id, name, username FROM users WHERE school_id = ? AND role = "pengawas" ORDER BY name').bind(locals.user.school_id).all();
  const examProctors = await db.prepare(`
		SELECT ep.id as exam_proctor_id, u.id as user_id, u.name, u.username
		FROM exam_proctors ep
		JOIN users u ON ep.proctor_id = u.id
		WHERE ep.exam_id = ?
		ORDER BY u.name
	`).bind(examId).all();
  return {
    exam,
    questions: questions.results,
    attempts: attempts.results,
    tokens: tokens.results,
    participants: participants.results,
    classes,
    allStudents,
    allTeachers: allTeachers.results,
    examTeachers: examTeachers.results,
    allProctors: allProctors.results,
    examProctors: examProctors.results,
    hasSessions
  };
};
const actions = {
  addParticipantClass: async ({ request, platform, params, locals }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });
    const db = getDB(platform);
    const form = await request.formData();
    const classIdStr = form.get("class_id")?.toString();
    const parsedClassId = parseInt(classIdStr || "", 10);
    const parsedExamId = parseInt(params.id, 10);
    if (isNaN(parsedClassId) || isNaN(parsedExamId)) return fail(400, { error: "Data tidak valid" });
    const exam = await db.prepare("SELECT id, exam_type_id FROM exams WHERE id = ? AND school_id = ?").bind(parsedExamId, locals.user.school_id).first();
    if (!exam) return fail(403, { error: "Ujian tidak ditemukan atau bukan milik sekolah Anda." });
    const validClass = await db.prepare("SELECT id FROM classes WHERE id = ? AND school_id = ?").bind(parsedClassId, locals.user.school_id).first();
    if (!validClass) return fail(403, { error: "Kelas tidak ditemukan." });
    if (exam.exam_type_id) {
      const isAllowed = await db.prepare("SELECT 1 FROM exam_type_classes WHERE exam_type_id = ? AND class_id = ?").bind(exam.exam_type_id, parsedClassId).first();
      if (!isAllowed) return fail(403, { error: "Kelas ini tidak termasuk dalam kelas yang diizinkan untuk tipe ujian ini." });
    }
    const students = await db.prepare('SELECT id FROM users WHERE class_id = ? AND school_id = ? AND role = "siswa"').bind(parsedClassId, locals.user.school_id).all();
    if (students.results.length === 0) {
      return { success: "Tidak ada siswa di kelas ini." };
    }
    const insertStmts = students.results.map(
      (student) => db.prepare("INSERT OR IGNORE INTO exam_participants (exam_id, student_id) VALUES (?, ?)").bind(parsedExamId, student.id)
    );
    await db.batch(insertStmts);
    return { success: `Berhasil menambahkan ${students.results.length} siswa dari kelas ke peserta ujian.` };
  },
  addParticipantStudent: async ({ request, platform, params, locals }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });
    const db = getDB(platform);
    const form = await request.formData();
    const studentIdsStr = form.getAll("student_ids").map((id) => id.toString());
    const parsedStudentIds = studentIdsStr.map((id) => parseInt(id, 10)).filter((id) => !isNaN(id));
    const parsedExamId = parseInt(params.id, 10);
    if (parsedStudentIds.length === 0 || isNaN(parsedExamId)) return fail(400, { error: "Data tidak valid" });
    const exam = await db.prepare("SELECT id, exam_type_id FROM exams WHERE id = ? AND school_id = ?").bind(parsedExamId, locals.user.school_id).first();
    if (!exam) return fail(403, { error: "Ujian tidak ditemukan atau bukan milik sekolah Anda." });
    let classFilterSql = "";
    if (exam.exam_type_id) {
      classFilterSql = ` AND class_id IN (SELECT class_id FROM exam_type_classes WHERE exam_type_id = ${exam.exam_type_id})`;
    }
    const placeholders = parsedStudentIds.map(() => "?").join(",");
    const validStudents = await db.prepare(`SELECT id FROM users WHERE id IN (${placeholders}) AND school_id = ? AND role = "siswa" ${classFilterSql}`).bind(...parsedStudentIds, locals.user.school_id).all();
    if (validStudents.results.length === 0) {
      return fail(400, { error: "Siswa tidak valid." });
    }
    const insertStmts = validStudents.results.map(
      (s) => db.prepare("INSERT OR IGNORE INTO exam_participants (exam_id, student_id) VALUES (?, ?)").bind(parsedExamId, s.id)
    );
    await db.batch(insertStmts);
    return { success: `Berhasil menambahkan ${validStudents.results.length} siswa ke peserta ujian.` };
  },
  removeParticipant: async ({ request, platform, locals }) => {
    const db = getDB(platform);
    const form = await request.formData();
    const pId = parseInt(form.get("participant_id")?.toString() || "", 10);
    if (isNaN(pId)) return fail(400, { error: "ID tidak valid" });
    try {
      await db.prepare(`
				DELETE FROM exam_participants 
				WHERE id = ? AND exam_id IN (SELECT id FROM exams WHERE school_id = ?)
			`).bind(pId, locals.user.school_id).run();
      return { success: "Peserta berhasil dihapus." };
    } catch (e) {
      return fail(500, { error: "Gagal menghapus peserta." });
    }
  },
  updateStudentSession: async ({ request, platform, locals }) => {
    const db = getDB(platform);
    const form = await request.formData();
    const userId = parseInt(form.get("user_id")?.toString() || "", 10);
    const sessionNumber = parseInt(form.get("session_number")?.toString() || "1", 10);
    if (isNaN(userId) || isNaN(sessionNumber)) return fail(400, { error: "Data tidak valid" });
    try {
      await db.prepare('UPDATE users SET session_number = ?, updated_at=datetime("now") WHERE id = ? AND school_id = ?').bind(sessionNumber, userId, locals.user.school_id).run();
      return { success: "Sesi siswa berhasil diperbarui." };
    } catch (e) {
      console.error(e);
      return fail(500, { error: "Gagal memperbarui sesi siswa." });
    }
  },
  addTeacher: async ({ request, platform, params, locals }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });
    const db = getDB(platform);
    const form = await request.formData();
    const teacherIdsStr = form.getAll("teacher_ids").map((id) => id.toString());
    const parsedTeacherIds = teacherIdsStr.map((id) => parseInt(id, 10)).filter((id) => !isNaN(id));
    const parsedExamId = parseInt(params.id, 10);
    if (parsedTeacherIds.length === 0 || isNaN(parsedExamId)) return fail(400, { error: "Data tidak valid" });
    const exam = await db.prepare("SELECT id FROM exams WHERE id = ? AND school_id = ?").bind(parsedExamId, locals.user.school_id).first();
    if (!exam) return fail(403, { error: "Ujian tidak ditemukan atau bukan milik sekolah Anda." });
    const placeholders = parsedTeacherIds.map(() => "?").join(",");
    const validTeachers = await db.prepare(`SELECT id FROM users WHERE id IN (${placeholders}) AND school_id = ? AND role = "guru"`).bind(...parsedTeacherIds, locals.user.school_id).all();
    if (validTeachers.results.length === 0) {
      return fail(400, { error: "Guru tidak valid." });
    }
    const insertStmts = validTeachers.results.map(
      (t) => db.prepare("INSERT OR IGNORE INTO exam_teachers (exam_id, teacher_id) VALUES (?, ?)").bind(parsedExamId, t.id)
    );
    await db.batch(insertStmts);
    return { success: `Berhasil menambahkan ${validTeachers.results.length} guru pengajar ujian.` };
  },
  removeTeacher: async ({ request, platform, params, locals }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });
    const db = getDB(platform);
    const form = await request.formData();
    const examTeacherIdStr = form.get("exam_teacher_id")?.toString();
    const parsedExamTeacherId = parseInt(examTeacherIdStr || "", 10);
    const parsedExamId = parseInt(params.id, 10);
    if (isNaN(parsedExamTeacherId) || isNaN(parsedExamId)) return fail(400, { error: "ID pengajar tidak valid" });
    await db.prepare(`
			DELETE FROM exam_teachers 
			WHERE id = ? AND exam_id = ? AND exam_id IN (SELECT id FROM exams WHERE school_id = ?)
		`).bind(parsedExamTeacherId, parsedExamId, locals.user.school_id).run();
    return { success: "Pengajar berhasil dihapus." };
  },
  addProctor: async ({ request, platform, params, locals }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });
    const db = getDB(platform);
    const form = await request.formData();
    const proctorIdsStr = form.getAll("proctor_ids").map((id) => id.toString());
    const parsedProctorIds = proctorIdsStr.map((id) => parseInt(id, 10)).filter((id) => !isNaN(id));
    const parsedExamId = parseInt(params.id, 10);
    if (parsedProctorIds.length === 0 || isNaN(parsedExamId)) return fail(400, { error: "Data tidak valid" });
    const exam = await db.prepare("SELECT id FROM exams WHERE id = ? AND school_id = ?").bind(parsedExamId, locals.user.school_id).first();
    if (!exam) return fail(403, { error: "Ujian tidak ditemukan atau bukan milik sekolah Anda." });
    const placeholders = parsedProctorIds.map(() => "?").join(",");
    const validProctors = await db.prepare(`SELECT id FROM users WHERE id IN (${placeholders}) AND school_id = ? AND role = "pengawas"`).bind(...parsedProctorIds, locals.user.school_id).all();
    if (validProctors.results.length === 0) {
      return fail(400, { error: "Pengawas tidak valid." });
    }
    const insertStmts = validProctors.results.map(
      (p) => db.prepare("INSERT OR IGNORE INTO exam_proctors (exam_id, proctor_id) VALUES (?, ?)").bind(parsedExamId, p.id)
    );
    await db.batch(insertStmts);
    return { success: `Berhasil menambahkan ${validProctors.results.length} pengawas ujian.` };
  },
  removeProctor: async ({ request, platform, params, locals }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });
    const db = getDB(platform);
    const form = await request.formData();
    const examProctorIdStr = form.get("exam_proctor_id")?.toString();
    const parsedExamProctorId = parseInt(examProctorIdStr || "", 10);
    const parsedExamId = parseInt(params.id, 10);
    if (isNaN(parsedExamProctorId) || isNaN(parsedExamId)) return fail(400, { error: "ID pengawas tidak valid" });
    await db.prepare(`
			DELETE FROM exam_proctors 
			WHERE id = ? AND exam_id = ? AND exam_id IN (SELECT id FROM exams WHERE school_id = ?)
		`).bind(parsedExamProctorId, parsedExamId, locals.user.school_id).run();
    return { success: "Pengawas berhasil dihapus." };
  },
  toggleScoreRelease: async ({ request, platform, params, locals }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });
    const db = getDB(platform);
    const parsedId = parseInt(params.id, 10);
    if (isNaN(parsedId)) return fail(400, { error: "ID tidak valid" });
    await db.prepare(`
			UPDATE exams 
			SET is_score_released = CASE WHEN is_score_released = 1 THEN 0 ELSE 1 END, updated_at = datetime('now') 
			WHERE id = ? AND school_id = ?
		`).bind(parsedId, locals.user.school_id).run();
    return { success: "Status rilis nilai berhasil diperbarui." };
  }
};
export {
  actions,
  load
};
