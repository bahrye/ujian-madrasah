import { fail } from "@sveltejs/kit";
import { g as getDB } from "../../../../chunks/db.js";
import { d as deleteFromCloudinary } from "../../../../chunks/cloudinary.js";
import { b as private_env } from "../../../../chunks/shared-server.js";
const load = async ({ platform }) => {
  const db = getDB(platform);
  try {
    await db.prepare(`
			INSERT INTO uploaded_media (url, media_type)
			SELECT media_url, media_type FROM questions 
			WHERE media_url LIKE '%res.cloudinary.com%' 
			AND media_url NOT IN (SELECT url FROM uploaded_media)
			GROUP BY media_url
		`).run();
  } catch (e) {
    console.error("Sync uploaded_media error:", e);
  }
  const query = `
		SELECT 
			u.id as log_id,
			u.url as media_url,
			u.media_type,
			q.id as question_id,
			q.question_number,
			e.title as exam_title,
			s.name as subject_name
		FROM uploaded_media u
		LEFT JOIN questions q ON u.url = q.media_url
		LEFT JOIN exams e ON q.exam_id = e.id
		LEFT JOIN subjects s ON e.subject_id = s.id
		ORDER BY q.id IS NULL DESC, s.name ASC, e.title ASC, q.question_number ASC
	`;
  try {
    const result = await db.prepare(query).all();
    return { mediaItems: result.results };
  } catch (e) {
    console.error("Fetch uploaded_media error:", e);
    return { mediaItems: [] };
  }
};
const actions = {
  deleteMedia: async ({ request, platform }) => {
    const db = getDB(platform);
    const form = await request.formData();
    const mediaUrl = form.get("media_url")?.toString();
    if (!mediaUrl || !mediaUrl.includes("res.cloudinary.com")) {
      return fail(400, { error: "URL Media tidak valid." });
    }
    const deleteResult = await deleteFromCloudinary(mediaUrl, private_env);
    if (!deleteResult.success) {
      return fail(500, { error: `Gagal menghapus dari Cloudinary. Pesan: ${deleteResult.error}` });
    }
    await db.prepare("DELETE FROM uploaded_media WHERE url = ?").bind(mediaUrl).run();
    await db.prepare("UPDATE questions SET media_url = NULL, media_type = NULL WHERE media_url = ?").bind(mediaUrl).run();
    return { success: "Media berhasil dihapus dari Cloudinary dan Database." };
  }
};
export {
  actions,
  load
};
