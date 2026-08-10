import { g as getDB } from "../../../../chunks/db.js";
import { json } from "@sveltejs/kit";
const GET = async ({ url, platform, locals }) => {
  if (locals.user?.role !== "admin" && locals.user?.role !== "panitia") {
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  const examTypeId = url.searchParams.get("exam_type_id");
  if (!examTypeId) return json({ classes: [] });
  const db = getDB(platform);
  const examType = await db.prepare("SELECT id FROM exam_types WHERE id = ? AND school_id = ?").bind(examTypeId, locals.user.school_id).first();
  if (!examType) return json({ classes: [] });
  const classesQuery = await db.prepare(`
		SELECT etc.id as relation_id, c.id, c.name,
			(SELECT COUNT(*) FROM users u WHERE u.class_id = c.id AND u.role = 'siswa' AND u.is_active = 1) as student_count
		FROM exam_type_classes etc
		JOIN classes c ON etc.class_id = c.id
		WHERE etc.exam_type_id = ? AND c.school_id = ?
		ORDER BY c.name
	`).bind(examTypeId, locals.user.school_id).all();
  const classIds = classesQuery.results.map((c) => c.id);
  let students = [];
  if (classIds.length > 0) {
    const placeholders = classIds.map(() => "?").join(",");
    const studentsQuery = await db.prepare(`
			SELECT id, name, username as nisn, class_id 
			FROM users 
			WHERE class_id IN (${placeholders}) AND role = 'siswa' AND is_active = 1
			ORDER BY name
		`).bind(...classIds).all();
    students = studentsQuery.results;
  }
  const formattedClasses = classesQuery.results.map((c) => {
    return {
      ...c,
      students: students.filter((s) => s.class_id === c.id)
    };
  });
  return json({ classes: formattedClasses });
};
export {
  GET
};
