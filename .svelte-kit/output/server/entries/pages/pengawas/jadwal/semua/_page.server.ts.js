import { redirect } from "@sveltejs/kit";
import { g as getDB } from "../../../../../chunks/db.js";
import { f as formatExamTitle } from "../../../../../chunks/exam.js";
const load = async ({ locals, platform }) => {
  if (!locals.user) {
    throw redirect(302, "/login");
  }
  const db = getDB(platform);
  const { results: rawSchedules } = await db.prepare(`
		SELECT 
			e.*, 
			s.name as subject_name, 
			et.code as exam_type_code,
			et.name as exam_type_name,
			c.name as class_name,
			(
				SELECT GROUP_CONCAT(u2.name, ', ')
				FROM exam_proctors ep2
				JOIN users u2 ON ep2.proctor_id = u2.id
				WHERE ep2.exam_id = e.id
			) as proctor_names,
			(
				SELECT COUNT(*)
				FROM exam_participants ep
				WHERE ep.exam_id = e.id
			) as participant_count,
			(
				SELECT GROUP_CONCAT(DISTINCT c2.name)
				FROM exam_participants ep
				JOIN users u3 ON ep.student_id = u3.id
				JOIN classes c2 ON u3.class_id = c2.id
				WHERE ep.exam_id = e.id
			) as class_names
		FROM exams e
		LEFT JOIN subjects s ON e.subject_id = s.id
		LEFT JOIN exam_types et ON e.exam_type_id = et.id
		LEFT JOIN classes c ON e.class_id = c.id
		WHERE e.school_id = ? AND e.is_active = 1
		ORDER BY e.start_time ASC
	`).bind(locals.user.school_id).all();
  const schedules = (rawSchedules || []).map((s) => ({
    ...s,
    title: formatExamTitle({
      title: s.title,
      examTypeCode: s.exam_type_code,
      subjectName: s.subject_name,
      className: s.class_name
    })
  }));
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
