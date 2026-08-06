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
  const participants = await db.prepare(`
		SELECT p.id as participant_id, u.id as user_id, u.name as student_name, u.username as nisn, c.name as class_name
		FROM exam_participants p
		JOIN users u ON p.student_id = u.id
		LEFT JOIN classes c ON u.class_id = c.id
		WHERE p.exam_id = ?
		ORDER BY c.name, u.name
	`).bind(examId).all();
  const classes = await db.prepare("SELECT id, name FROM classes WHERE school_id = ? ORDER BY name").bind(locals.user.school_id).all();
  const allStudents = await db.prepare('SELECT id, name, username, class_id FROM users WHERE school_id = ? AND role = "siswa" ORDER BY name').bind(locals.user.school_id).all();
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
    classes: classes.results,
    allStudents: allStudents.results,
    allTeachers: allTeachers.results,
    examTeachers: examTeachers.results,
    allProctors: allProctors.results,
    examProctors: examProctors.results
  };
};
const actions = {
  addParticipantClass: async ({ request, platform, params }) => {
    const db = getDB(platform);
    const form = await request.formData();
    const classIdStr = form.get("class_id")?.toString();
    const parsedClassId = parseInt(classIdStr || "", 10);
    const parsedExamId = parseInt(params.id, 10);
    if (isNaN(parsedClassId) || isNaN(parsedExamId)) return fail(400, { error: "Data tidak valid" });
    const students = await db.prepare('SELECT id FROM users WHERE class_id = ? AND role = "siswa"').bind(parsedClassId).all();
    let added = 0;
    for (const student of students.results) {
      try {
        await db.prepare("INSERT INTO exam_participants (exam_id, student_id) VALUES (?, ?)").bind(parsedExamId, student.id).run();
        added++;
      } catch (e) {
      }
    }
    return { success: `Berhasil menambahkan ${added} siswa dari kelas ke peserta ujian.` };
  },
  addParticipantStudent: async ({ request, platform, params }) => {
    const db = getDB(platform);
    const form = await request.formData();
    const studentIdsStr = form.getAll("student_ids").map((id) => id.toString());
    const parsedStudentIds = studentIdsStr.map((id) => parseInt(id, 10)).filter((id) => !isNaN(id));
    const parsedExamId = parseInt(params.id, 10);
    if (parsedStudentIds.length === 0 || isNaN(parsedExamId)) return fail(400, { error: "Data tidak valid" });
    let added = 0;
    for (const studentId of parsedStudentIds) {
      try {
        await db.prepare("INSERT INTO exam_participants (exam_id, student_id) VALUES (?, ?)").bind(parsedExamId, studentId).run();
        added++;
      } catch (e) {
      }
    }
    return { success: `Berhasil menambahkan ${added} siswa ke peserta ujian.` };
  },
  removeParticipant: async ({ request, platform, params }) => {
    const db = getDB(platform);
    const form = await request.formData();
    const participantIdStr = form.get("participant_id")?.toString();
    const parsedParticipantId = parseInt(participantIdStr || "", 10);
    if (isNaN(parsedParticipantId)) return fail(400, { error: "ID peserta tidak valid" });
    await db.prepare("DELETE FROM exam_participants WHERE id = ?").bind(parsedParticipantId).run();
    return { success: "Peserta berhasil dihapus dari ujian." };
  },
  addTeacher: async ({ request, platform, params }) => {
    const db = getDB(platform);
    const form = await request.formData();
    const teacherIdsStr = form.getAll("teacher_ids").map((id) => id.toString());
    const parsedTeacherIds = teacherIdsStr.map((id) => parseInt(id, 10)).filter((id) => !isNaN(id));
    const parsedExamId = parseInt(params.id, 10);
    if (parsedTeacherIds.length === 0 || isNaN(parsedExamId)) return fail(400, { error: "Data tidak valid" });
    let added = 0;
    for (const teacherId of parsedTeacherIds) {
      try {
        await db.prepare("INSERT INTO exam_teachers (exam_id, teacher_id) VALUES (?, ?)").bind(parsedExamId, teacherId).run();
        added++;
      } catch (e) {
      }
    }
    return { success: `Berhasil menambahkan ${added} guru pengajar ujian.` };
  },
  removeTeacher: async ({ request, platform, params }) => {
    const db = getDB(platform);
    const form = await request.formData();
    const examTeacherIdStr = form.get("exam_teacher_id")?.toString();
    const parsedExamTeacherId = parseInt(examTeacherIdStr || "", 10);
    if (isNaN(parsedExamTeacherId)) return fail(400, { error: "ID pengajar tidak valid" });
    await db.prepare("DELETE FROM exam_teachers WHERE id = ?").bind(parsedExamTeacherId).run();
    return { success: "Pengajar berhasil dihapus." };
  },
  addProctor: async ({ request, platform, params }) => {
    const db = getDB(platform);
    const form = await request.formData();
    const proctorIdsStr = form.getAll("proctor_ids").map((id) => id.toString());
    const parsedProctorIds = proctorIdsStr.map((id) => parseInt(id, 10)).filter((id) => !isNaN(id));
    const parsedExamId = parseInt(params.id, 10);
    if (parsedProctorIds.length === 0 || isNaN(parsedExamId)) return fail(400, { error: "Data tidak valid" });
    let added = 0;
    for (const proctorId of parsedProctorIds) {
      try {
        await db.prepare("INSERT INTO exam_proctors (exam_id, proctor_id) VALUES (?, ?)").bind(parsedExamId, proctorId).run();
        added++;
      } catch (e) {
      }
    }
    return { success: `Berhasil menambahkan ${added} pengawas ujian.` };
  },
  removeProctor: async ({ request, platform, params }) => {
    const db = getDB(platform);
    const form = await request.formData();
    const examProctorIdStr = form.get("exam_proctor_id")?.toString();
    const parsedExamProctorId = parseInt(examProctorIdStr || "", 10);
    if (isNaN(parsedExamProctorId)) return fail(400, { error: "ID pengawas tidak valid" });
    await db.prepare("DELETE FROM exam_proctors WHERE id = ?").bind(parsedExamProctorId).run();
    return { success: "Pengawas berhasil dihapus." };
  },
  toggleScoreRelease: async ({ request, platform, params }) => {
    const db = getDB(platform);
    const parsedId = parseInt(params.id, 10);
    if (isNaN(parsedId)) return fail(400, { error: "ID tidak valid" });
    await db.prepare(`UPDATE exams SET is_score_released = CASE WHEN is_score_released = 1 THEN 0 ELSE 1 END, updated_at = datetime('now') WHERE id = ?`).bind(parsedId).run();
    return { success: "Status rilis nilai berhasil diperbarui." };
  }
};
export {
  actions,
  load
};
