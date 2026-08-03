import { json } from "@sveltejs/kit";
import { g as getDB } from "../../../../chunks/db.js";
const GET = async ({ platform, locals }) => {
  try {
    const db = getDB(platform);
    let query = "SELECT url, name, media_type FROM uploaded_media ORDER BY id DESC";
    let result;
    if (locals.user?.role === "admin" || locals.user?.role === "superadmin") {
      result = await db.prepare(query).all();
    } else {
      query = "SELECT url, name, media_type FROM uploaded_media WHERE uploaded_by = ? OR is_public = 1 ORDER BY id DESC";
      result = await db.prepare(query).bind(locals.user?.id || -1).all();
    }
    return json({ success: true, media: result.results || [] });
  } catch (error) {
    console.error("API /media error:", error);
    return json({ success: false, error: "Internal server error", media: [] }, { status: 500 });
  }
};
export {
  GET
};
