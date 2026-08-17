import { redirect } from "@sveltejs/kit";
import { g as getDB } from "../../../../../chunks/db.js";
import { f as formatExamTitle } from "../../../../../chunks/exam.js";
const load = async ({ locals, platform }) => {
  if (!locals.user) {
    throw redirect(302, "/login");
  }
  const db = getDB(platform);
  const { results: rawSchedules } = await db.prepare(`
		SELECT e.*, s.name as subject_name, et.code as exam_type_code, et.name as exam_type_name, c.name as class_name
		FROM exams e
		LEFT JOIN subjects s ON e.subject_id = s.id
		LEFT JOIN exam_types et ON e.exam_type_id = et.id
		LEFT JOIN classes c ON e.class_id = c.id
		JOIN exam_proctors ep ON e.id = ep.exam_id
		WHERE ep.proctor_id = ? AND e.school_id = ? AND e.is_active = 1
		ORDER BY e.start_time ASC
	`).bind(locals.user.id, locals.user.school_id).all();
  const schedules = (rawSchedules || []).map((s) => ({
    ...s,
    title: formatExamTitle({
      title: s.title,
      examTypeCode: s.exam_type_code,
      subjectName: s.subject_name,
      className: s.class_name
    })
  }));
  return {
    schedules
  };
};
export {
  load
};
