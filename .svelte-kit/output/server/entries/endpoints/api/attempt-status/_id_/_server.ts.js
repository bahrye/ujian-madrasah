import { json } from "@sveltejs/kit";
import { g as getDB } from "../../../../../chunks/db.js";
const GET = async ({ params, platform, locals }) => {
  if (!locals.user) return json({ error: "Unauthorized" }, { status: 401 });
  const db = getDB(platform);
  const attemptId = params.id;
  if (!attemptId) return json({ error: "ID tidak valid" }, { status: 400 });
  const attempt = await db.prepare(`
		SELECT is_paused, status, end_time FROM student_attempts 
		WHERE id = ? AND student_id = ?
	`).bind(attemptId, locals.user.id).first();
  if (!attempt) return json({ error: "Not found" }, { status: 404 });
  return json({
    is_paused: attempt.is_paused === 1,
    status: attempt.status,
    end_time: attempt.end_time
  });
};
export {
  GET
};
