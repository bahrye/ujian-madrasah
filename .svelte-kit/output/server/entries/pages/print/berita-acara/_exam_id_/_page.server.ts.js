import { g as getDB } from "../../../../../chunks/db.js";
import { error } from "@sveltejs/kit";
const load = async ({ platform, params, locals }) => {
  const db = getDB(platform);
  const examIdStr = params.exam_id;
  const examId = parseInt(examIdStr, 10);
  if (isNaN(examId)) throw error(400, "ID Ujian tidak valid");
  const school = await db.prepare("SELECT * FROM schools WHERE id = ?").bind(locals.user.school_id).first();
  const exam = await db.prepare("SELECT e.*, s.name as subject_name, et.name as exam_type_name FROM exams e LEFT JOIN subjects s ON e.subject_id = s.id LEFT JOIN exam_types et ON e.exam_type_id = et.id WHERE e.id = ? AND e.school_id = ?").bind(examId, locals.user.school_id).first();
  if (!exam) throw error(404, "Ujian tidak ditemukan");
  const participantCount = await db.prepare("SELECT COUNT(*) as count FROM exam_participants WHERE exam_id = ?").bind(examId).first();
  return {
    school,
    exam,
    totalParticipants: participantCount?.count || 0
  };
};
export {
  load
};
