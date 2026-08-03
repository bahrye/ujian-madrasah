import { json } from "@sveltejs/kit";
import { g as getDB } from "../../../../chunks/db.js";
const GET = async ({ platform }) => {
  try {
    const db = getDB(platform);
    const result = await db.prepare("SELECT url, media_type FROM uploaded_media ORDER BY id DESC").all();
    return json({ success: true, media: result.results || [] });
  } catch (error) {
    console.error("API /media error:", error);
    return json({ success: false, error: "Internal server error", media: [] }, { status: 500 });
  }
};
export {
  GET
};
