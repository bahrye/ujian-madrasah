import "@sveltejs/kit";
import { g as getDB } from "../../../../../../chunks/db.js";
const load = async ({ params, platform, locals }) => {
  const db = getDB(platform);
  const typeIdStr = params.typeId;
  const typeId = parseInt(typeIdStr, 10);
  if (isNaN(typeId)) throw new Error("ID Tipe Ujian tidak valid");
  const examType = await db.prepare("SELECT * FROM exam_types WHERE id = ? AND school_id = ?").bind(typeId, locals.user.school_id).first();
  if (!examType) {
    throw new Error("Tipe Ujian tidak ditemukan");
  }
  const classes = await db.prepare(`
		SELECT c.id, c.name,
			(SELECT COUNT(*) FROM users WHERE class_id = c.id AND role = 'siswa' AND is_active = 1) as student_count,
			(SELECT COUNT(*) FROM exams WHERE exam_type_id = ? AND class_id = c.id AND school_id = ?) as exam_count
		FROM classes c
		INNER JOIN exam_type_classes etc ON etc.class_id = c.id
		WHERE etc.exam_type_id = ? AND c.school_id = ?
		ORDER BY c.name
	`).bind(typeId, locals.user.school_id, typeId, locals.user.school_id).all();
  return { examType, classes: classes.results };
};
export {
  load
};
