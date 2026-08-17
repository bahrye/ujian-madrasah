import { g as getDB } from "../../../../chunks/db.js";
import { redirect } from "@sveltejs/kit";
import { f as formatExamTitle } from "../../../../chunks/exam.js";
const load = async ({ platform, locals }) => {
  if (locals.user?.role !== "admin" && locals.user?.role !== "panitia") throw redirect(302, "/");
  const db = getDB(platform);
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
		LEFT JOIN subjects s ON e.subject_id = s.id
		LEFT JOIN classes c ON e.class_id = c.id
		LEFT JOIN exam_types et ON e.exam_type_id = et.id
		WHERE e.school_id = ? AND e.is_active = 1
		ORDER BY e.created_at DESC
	`).bind(schoolId).all();
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
		SELECT id, name as type_name, code
		FROM exam_types
		WHERE school_id = ? AND is_active = 1
		ORDER BY name ASC
	`).bind(schoolId).all();
  return {
    exams,
    examTypes: examTypesQuery.results || []
  };
};
export {
  load
};
