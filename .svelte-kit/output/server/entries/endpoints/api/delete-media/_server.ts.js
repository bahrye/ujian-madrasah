import { json } from "@sveltejs/kit";
import { d as deleteFromCloudinary } from "../../../../chunks/cloudinary.js";
import { b as private_env } from "../../../../chunks/shared-server.js";
const POST = async ({ request }) => {
  try {
    const { url } = await request.json();
    if (!url) {
      return json({ success: false, error: "URL is required" }, { status: 400 });
    }
    if (!url.includes("res.cloudinary.com")) {
      return json({ success: true, message: "Not a Cloudinary URL, skipped." });
    }
    const deleted = await deleteFromCloudinary(url, private_env);
    if (deleted) {
      return json({ success: true });
    } else {
      return json({ success: false, error: "Failed to delete or credentials missing" }, { status: 500 });
    }
  } catch (error) {
    console.error("API /delete-media error:", error);
    return json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
};
export {
  POST
};
