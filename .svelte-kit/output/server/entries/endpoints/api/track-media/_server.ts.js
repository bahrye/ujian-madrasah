import { json } from "@sveltejs/kit";
import { g as getDB, d as dbRun } from "../../../../chunks/db.js";
const POST = async ({ request, platform, locals }) => {
  try {
    const db = getDB(platform);
    const { url, media_type } = await request.json();
    if (!url || !media_type) {
      return json({ success: false, error: "URL dan media_type wajib diisi" }, { status: 400 });
    }
    if (!["image", "audio"].includes(media_type)) {
      return json({ success: false, error: "media_type tidak valid" }, { status: 400 });
    }
    const query = `
			INSERT INTO uploaded_media (url, media_type, uploaded_by, is_public)
			VALUES (?, ?, ?, ?)
			ON CONFLICT(url) DO NOTHING
		`;
    await dbRun(db, query, url, media_type, locals.user?.id || null, 0);
    return json({ success: true });
  } catch (error) {
    console.error("API /track-media error:", error);
    return json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
};
export {
  POST
};
