import { g as getDB } from "../../../../chunks/db.js";
import { json } from "@sveltejs/kit";
const GET = async ({ url, platform, locals }) => {
  if (locals.user?.role !== "admin") {
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  const examTypeId = url.searchParams.get("exam_type_id");
  if (!examTypeId) return json({ participants: [] });
  const db = getDB(platform);
  const examType = await db.prepare("SELECT id FROM exam_types WHERE id = ? AND school_id = ?").bind(examTypeId, locals.user.school_id).first();
  if (!examType) return json({ participants: [] });
  const participants = await db.prepare(`
		SELECT etp.id, u.name as student_name, u.username as nisn, c.name as class_name
		FROM exam_type_participants etp
		JOIN users u ON etp.student_id = u.id
		LEFT JOIN classes c ON u.class_id = c.id
		WHERE etp.exam_type_id = ?
		ORDER BY c.name, u.name
	`).bind(examTypeId).all();
  return json({ participants: participants.results || [] });
};
export {
  GET
};
