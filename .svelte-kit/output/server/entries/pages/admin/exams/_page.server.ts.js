import { fail } from "@sveltejs/kit";
import { g as getDB } from "../../../../chunks/db.js";
const load = async ({ platform, locals }) => {
  const db = getDB(platform);
  try {
    await db.prepare(`
			CREATE TABLE IF NOT EXISTS exam_type_participants (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				exam_type_id INTEGER NOT NULL REFERENCES exam_types(id) ON DELETE CASCADE,
				student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				UNIQUE(exam_type_id, student_id)
			)
		`).run();
  } catch {
  }
  const examTypes = await db.prepare(`
		SELECT et.*, 
			(SELECT COUNT(*) FROM exams WHERE exam_type_id = et.id) as exam_count,
			(SELECT COUNT(*) FROM exam_type_participants WHERE exam_type_id = et.id) as participant_count
		FROM exam_types et
		WHERE et.school_id = ?
		ORDER BY et.created_at DESC
	`).bind(locals.user.school_id).all();
  const classes = await db.prepare("SELECT id, name FROM classes WHERE school_id = ? ORDER BY name ASC").bind(locals.user.school_id).all();
  const students = await db.prepare(
    'SELECT id, name, username, class_id FROM users WHERE school_id = ? AND role = "siswa" ORDER BY name ASC'
  ).bind(locals.user.school_id).all();
  return {
    examTypes: examTypes.results,
    classes: classes.results,
    students: students.results
  };
};
const actions = {
  create: async ({ request, platform, locals }) => {
    const db = getDB(platform);
    const form = await request.formData();
    const code = form.get("code")?.toString().trim();
    const name = form.get("name")?.toString().trim();
    const description = form.get("description")?.toString().trim() || "";
    const startTime = form.get("start_time")?.toString() || null;
    const endTime = form.get("end_time")?.toString() || null;
    const isActive = 1;
    if (!code || !name) return fail(400, { error: "Kode dan Nama Tipe Ujian wajib diisi." });
    try {
      await db.prepare(`INSERT INTO exam_types (school_id, code, name, description, start_time, end_time, is_active)
				VALUES (?, ?, ?, ?, ?, ?, ?)`).bind(locals.user.school_id, code, name, description, startTime, endTime, isActive).run();
      return { success: "Tipe Ujian berhasil dibuat." };
    } catch (e) {
      console.error(e);
      return fail(500, { error: e.message || "Gagal membuat tipe ujian. Mungkin kode sudah digunakan." });
    }
  },
  update: async ({ request, platform, locals }) => {
    const db = getDB(platform);
    const form = await request.formData();
    const idStr = form.get("id")?.toString();
    const code = form.get("code")?.toString().trim();
    const name = form.get("name")?.toString().trim();
    const description = form.get("description")?.toString().trim() || "";
    const startTime = form.get("start_time")?.toString() || null;
    const endTime = form.get("end_time")?.toString() || null;
    const isActive = 1;
    const parsedId = parseInt(idStr || "", 10);
    if (isNaN(parsedId) || !code || !name) return fail(400, { error: "Data tidak lengkap." });
    try {
      const oldType = await db.prepare("SELECT code FROM exam_types WHERE id = ? AND school_id = ?").bind(parsedId, locals.user.school_id).first();
      await db.prepare(`UPDATE exam_types SET code=?, name=?, description=?, start_time=?, end_time=?, is_active=? WHERE id=? AND school_id=?`).bind(code, name, description, startTime, endTime, isActive, parsedId, locals.user.school_id).run();
      if (oldType && oldType.code !== code) {
        const linkedExams = await db.prepare(`
					SELECT e.id, s.name as subject_name
					FROM exams e
					LEFT JOIN subjects s ON e.subject_id = s.id
					WHERE e.exam_type_id = ?
				`).bind(parsedId).all();
        if (linkedExams.results.length > 0) {
          const updateBatch = linkedExams.results.map(
            (exam) => db.prepare(`UPDATE exams SET title = ?, updated_at = datetime('now') WHERE id = ?`).bind(`${code} - ${exam.subject_name || "Ujian"}`, exam.id)
          );
          await db.batch(updateBatch);
        }
      }
      if (startTime && endTime) {
        await db.prepare(`
					UPDATE exams 
					SET is_active = 0 
					WHERE exam_type_id = ? 
					AND (
						(start_time IS NOT NULL AND start_time < ?) OR 
						(end_time IS NOT NULL AND end_time > ?)
					)
				`).bind(parsedId, startTime, endTime).run();
      }
      return { success: "Tipe Ujian berhasil diperbarui. Nama ujian yang terhubung telah diperbarui otomatis." };
    } catch (e) {
      console.error(e);
      return fail(500, { error: e.message || "Gagal memperbarui tipe ujian." });
    }
  },
  delete: async ({ request, platform, locals }) => {
    const db = getDB(platform);
    const form = await request.formData();
    const idStr = form.get("id")?.toString();
    const parsedId = parseInt(idStr || "", 10);
    if (isNaN(parsedId)) return fail(400, { error: "ID tidak valid." });
    try {
      const exams = await db.prepare("SELECT COUNT(*) as count FROM exams WHERE exam_type_id = ?").bind(parsedId).first();
      if (exams && exams.count > 0) {
        return fail(400, { error: "Gagal dihapus: Masih ada ujian yang terikat pada tipe ini." });
      }
      await db.prepare("DELETE FROM exam_types WHERE id = ? AND school_id = ?").bind(parsedId, locals.user.school_id).run();
      return { success: "Tipe Ujian berhasil dihapus." };
    } catch (e) {
      console.error(e);
      return fail(500, { error: e.message || "Gagal menghapus tipe ujian." });
    }
  },
  // ── Peserta Default Tipe Ujian ──────────────────────────────────────────
  addTypeParticipantClass: async ({ request, platform, locals }) => {
    const db = getDB(platform);
    const form = await request.formData();
    const examTypeIdStr = form.get("exam_type_id")?.toString();
    const classIdStr = form.get("class_id")?.toString();
    const parsedExamTypeId = parseInt(examTypeIdStr || "", 10);
    const parsedClassId = parseInt(classIdStr || "", 10);
    if (isNaN(parsedExamTypeId) || isNaN(parsedClassId)) return fail(400, { error: "Data tidak lengkap." });
    const examType = await db.prepare("SELECT id FROM exam_types WHERE id = ? AND school_id = ?").bind(parsedExamTypeId, locals.user.school_id).first();
    if (!examType) return fail(404, { error: "Tipe ujian tidak ditemukan." });
    const students = await db.prepare('SELECT id FROM users WHERE class_id = ? AND role = "siswa"').bind(parsedClassId).all();
    let added = 0;
    for (const student of students.results) {
      try {
        await db.prepare("INSERT INTO exam_type_participants (exam_type_id, student_id) VALUES (?, ?)").bind(parsedExamTypeId, student.id).run();
        added++;
      } catch {
      }
    }
    return { success: `Berhasil menambahkan ${added} siswa dari kelas sebagai peserta default.` };
  },
  addTypeParticipantStudent: async ({ request, platform, locals }) => {
    const db = getDB(platform);
    const form = await request.formData();
    const examTypeIdStr = form.get("exam_type_id")?.toString();
    const studentIdsStr = form.getAll("student_ids").map((id) => id.toString());
    const parsedExamTypeId = parseInt(examTypeIdStr || "", 10);
    const parsedStudentIds = studentIdsStr.map((id) => parseInt(id, 10)).filter((id) => !isNaN(id));
    if (isNaN(parsedExamTypeId) || parsedStudentIds.length === 0) return fail(400, { error: "Data tidak lengkap." });
    const examType = await db.prepare("SELECT id FROM exam_types WHERE id = ? AND school_id = ?").bind(parsedExamTypeId, locals.user.school_id).first();
    if (!examType) return fail(404, { error: "Tipe ujian tidak ditemukan." });
    let added = 0;
    for (const studentId of parsedStudentIds) {
      try {
        await db.prepare("INSERT INTO exam_type_participants (exam_type_id, student_id) VALUES (?, ?)").bind(parsedExamTypeId, studentId).run();
        added++;
      } catch {
      }
    }
    return { success: `Berhasil menambahkan ${added} siswa sebagai peserta default.` };
  },
  removeTypeParticipant: async ({ request, platform }) => {
    const db = getDB(platform);
    const form = await request.formData();
    const idStr = form.get("id")?.toString();
    const parsedId = parseInt(idStr || "", 10);
    if (isNaN(parsedId)) return fail(400, { error: "ID tidak valid." });
    await db.prepare("DELETE FROM exam_type_participants WHERE id = ?").bind(parsedId).run();
    return { success: "Peserta default berhasil dihapus." };
  },
  clearTypeParticipants: async ({ request, platform, locals }) => {
    const db = getDB(platform);
    const form = await request.formData();
    const examTypeIdStr = form.get("exam_type_id")?.toString();
    const parsedExamTypeId = parseInt(examTypeIdStr || "", 10);
    if (isNaN(parsedExamTypeId)) return fail(400, { error: "ID tidak valid." });
    const examType = await db.prepare("SELECT id FROM exam_types WHERE id = ? AND school_id = ?").bind(parsedExamTypeId, locals.user.school_id).first();
    if (!examType) return fail(404, { error: "Tipe ujian tidak ditemukan." });
    await db.prepare("DELETE FROM exam_type_participants WHERE exam_type_id = ?").bind(parsedExamTypeId).run();
    return { success: "Semua peserta default berhasil dihapus." };
  },
  getTypeParticipants: async ({ request, platform, locals }) => {
    const db = getDB(platform);
    const form = await request.formData();
    const examTypeIdStr = form.get("exam_type_id")?.toString();
    const parsedExamTypeId = parseInt(examTypeIdStr || "", 10);
    if (isNaN(parsedExamTypeId)) return fail(400, { error: "ID tidak valid." });
    const participants = await db.prepare(`
			SELECT etp.id, u.name as student_name, u.username as nisn, c.name as class_name
			FROM exam_type_participants etp
			JOIN users u ON etp.student_id = u.id
			LEFT JOIN classes c ON u.class_id = c.id
			WHERE etp.exam_type_id = ?
			ORDER BY c.name, u.name
		`).bind(parsedExamTypeId).all();
    return { participants: participants.results };
  }
};
export {
  actions,
  load
};
