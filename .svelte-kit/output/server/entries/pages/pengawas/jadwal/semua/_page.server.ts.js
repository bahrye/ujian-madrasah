import { redirect } from "@sveltejs/kit";
import { g as getDB } from "../../../../../chunks/db.js";
const load = async ({ locals, platform }) => {
  if (!locals.user || locals.user.role !== "pengawas") {
    throw redirect(302, "/login");
  }
  const db = getDB(platform);
  const { results: schedules } = await db.prepare(`
		SELECT 
			e.*, 
			s.name as subject_name, 
			et.name as exam_type_name,
			(
				SELECT GROUP_CONCAT(u2.name, ', ')
				FROM exam_proctors ep2
				JOIN users u2 ON ep2.proctor_id = u2.id
				WHERE ep2.exam_id = e.id
			) as proctor_names,
			(
				SELECT GROUP_CONCAT(DISTINCT c.name)
				FROM exam_participants ep
				JOIN users u3 ON ep.student_id = u3.id
				JOIN classes c ON u3.class_id = c.id
				WHERE ep.exam_id = e.id
			) as class_names
		FROM exams e
		LEFT JOIN subjects s ON e.subject_id = s.id
		LEFT JOIN exam_types et ON e.exam_type_id = et.id
		WHERE e.school_id = ? AND e.is_active = 1
		ORDER BY e.start_time ASC
	`).bind(locals.user.school_id).all();
  const { results: classes } = await db.prepare(`
		SELECT id, name FROM classes WHERE school_id = ? ORDER BY name ASC
	`).bind(locals.user.school_id).all();
  return {
    schedules,
    classes
  };
};
export {
  load
};
