import { json } from "@sveltejs/kit";
import { g as getDB, e as ensureExamTypeProctorsTable } from "../../../../chunks/db.js";
const GET = async ({ url, platform, locals }) => {
  if (!locals.user) return json({ error: "Unauthorized" }, { status: 401 });
  const db = getDB(platform);
  await ensureExamTypeProctorsTable(db);
  const examTypeIdStr = url.searchParams.get("exam_type_id");
  const examTypeId = parseInt(examTypeIdStr || "", 10);
  if (isNaN(examTypeId)) return json({ error: "Invalid ID" }, { status: 400 });
  const proctors = await db.prepare(`
		SELECT etp.id, etp.exam_type_id, etp.proctor_id, COALESCE(etp.proctor_role, 'pt') as proctor_role, u.name, u.nip, u.role as user_role
		FROM exam_type_proctors etp
		JOIN users u ON etp.proctor_id = u.id
		WHERE etp.exam_type_id = ?
		ORDER BY etp.id ASC
	`).bind(examTypeId).all();
  return json({ proctors: proctors.results || [] });
};
export {
  GET
};
