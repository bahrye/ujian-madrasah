import { g as getDB } from "../../../../chunks/db.js";
import { redirect } from "@sveltejs/kit";
import { f as formatExamTitle } from "../../../../chunks/exam.js";
const load = async ({ platform, locals }) => {
  if (locals.user?.role !== "siswa") throw redirect(302, "/");
  const db = getDB(platform);
  const userId = locals.user.id;
  const schoolId = locals.user.school_id;
  const examsQuery = await db.prepare(`
		SELECT 
			e.id,
			e.title,
			s.name as subject,
			s.name as subject_name,
			et.name as type_name,
			et.code as exam_type_code,
			c.name as class_name,
			e.exam_type_id
		FROM exams e
		JOIN exam_participants ep ON e.id = ep.exam_id
		LEFT JOIN subjects s ON e.subject_id = s.id
		LEFT JOIN classes c ON e.class_id = c.id
		JOIN exam_types et ON e.exam_type_id = et.id
		WHERE ep.student_id = ? AND e.school_id = ? AND e.is_active = 1
		ORDER BY e.created_at DESC
	`).bind(userId, schoolId).all();
  const exams = (examsQuery.results || []).map((e) => ({
    ...e,
    title: formatExamTitle({
      title: e.title,
      examTypeCode: e.exam_type_code,
      subjectName: e.subject_name,
      className: e.class_name
    })
  }));
  const examTypesQuery = await db.prepare(`
		SELECT DISTINCT 
			et.id,
			et.name as type_name,
			et.code
		FROM exam_types et
		JOIN exams e ON et.id = e.exam_type_id
		JOIN exam_participants ep ON e.id = ep.exam_id
		WHERE ep.student_id = ? AND e.school_id = ? AND et.is_active = 1
		ORDER BY et.name ASC
	`).bind(userId, schoolId).all();
  return {
    exams,
    examTypes: examTypesQuery.results || []
  };
};
export {
  load
};
