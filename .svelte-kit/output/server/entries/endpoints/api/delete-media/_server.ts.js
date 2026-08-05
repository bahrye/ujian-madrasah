import { json } from "@sveltejs/kit";
import { d as deleteFromCloudinary } from "../../../../chunks/cloudinary.js";
import { b as private_env } from "../../../../chunks/shared-server.js";
const POST = async ({ request, locals }) => {
  if (!locals.user || !["superadmin", "admin", "guru"].includes(locals.user.role)) {
    return json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { url } = await request.json();
    if (!url) {
      return json({ success: false, error: "URL is required" }, { status: 400 });
    }
    if (!url.includes("res.cloudinary.com")) {
      return json({ success: true, message: "Not a Cloudinary URL, skipped." });
    }
    const deleteResult = await deleteFromCloudinary(url, private_env);
    if (deleteResult.success) {
      return json({ success: true });
    } else {
      return json({ success: false, error: deleteResult.error || "Failed to delete" }, { status: 500 });
    }
  } catch (error) {
    console.error("API /delete-media error:", error);
    return json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
};
export {
  POST
};
