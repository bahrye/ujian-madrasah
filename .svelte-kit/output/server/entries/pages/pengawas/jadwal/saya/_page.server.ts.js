import { redirect } from "@sveltejs/kit";
import { g as getDB } from "../../../../../chunks/db.js";
const load = async ({ locals, platform }) => {
  if (!locals.user || locals.user.role !== "pengawas") {
    throw redirect(302, "/login");
  }
  const db = getDB(platform);
  const { results: schedules } = await db.prepare(`
		SELECT e.*, s.name as subject_name, et.name as exam_type_name
		FROM exams e
		LEFT JOIN subjects s ON e.subject_id = s.id
		LEFT JOIN exam_types et ON e.exam_type_id = et.id
		JOIN exam_proctors ep ON e.id = ep.exam_id
		WHERE ep.proctor_id = ? AND e.school_id = ?
		ORDER BY e.start_time ASC
	`).bind(locals.user.id, locals.user.school_id).all();
  return {
    schedules
  };
};
export {
  load
};
