import { g as getDB } from "../../../../chunks/db.js";
import { redirect } from "@sveltejs/kit";
const load = async ({ platform, locals }) => {
  if (locals.user?.role !== "guru") throw redirect(302, "/");
  const db = getDB(platform);
  const schoolId = locals.user.school_id;
  const userId = locals.user.id;
  const examsQuery = await db.prepare(`
		SELECT 
			e.id,
			e.title,
			s.name as subject,
			et.name as type_name,
			e.exam_type_id
		FROM exams e
		LEFT JOIN subjects s ON e.subject_id = s.id
		LEFT JOIN exam_types et ON e.exam_type_id = et.id
		WHERE e.school_id = ? AND e.is_active = 1
		AND (e.created_by = ? OR EXISTS (SELECT 1 FROM exam_teachers teacher_join WHERE teacher_join.exam_id = e.id AND teacher_join.teacher_id = ?))
		ORDER BY e.created_at DESC
	`).bind(schoolId, userId, userId).all();
  const examTypesQuery = await db.prepare(`
		SELECT DISTINCT
			et.id,
			et.name as type_name,
			et.code
		FROM exam_types et
		JOIN exams e ON et.id = e.exam_type_id
		WHERE et.school_id = ? AND et.is_active = 1
		AND (e.created_by = ? OR EXISTS (SELECT 1 FROM exam_teachers teacher_join WHERE teacher_join.exam_id = e.id AND teacher_join.teacher_id = ?))
		ORDER BY et.name ASC
	`).bind(schoolId, userId, userId).all();
  return {
    exams: examsQuery.results || [],
    examTypes: examTypesQuery.results || []
  };
};
export {
  load
};
