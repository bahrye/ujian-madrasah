import { fail } from "@sveltejs/kit";
import { g as getDB } from "../../../../chunks/db.js";
import { d as deleteFromCloudinary } from "../../../../chunks/cloudinary.js";
import { b as private_env } from "../../../../chunks/shared-server.js";
const load = async ({ platform, locals }) => {
  const db = getDB(platform);
  try {
    await db.prepare(`
			INSERT INTO uploaded_media (url, media_type, school_id)
			SELECT media_url, media_type, ? FROM questions 
			WHERE media_url LIKE '%res.cloudinary.com%' 
			AND media_url NOT IN (SELECT url FROM uploaded_media)
			GROUP BY media_url
		`).bind(locals.user?.school_id || -1).run();
  } catch (e) {
    console.error("Sync uploaded_media error:", e);
  }
  const query = `
		SELECT 
			u.id as log_id,
			u.url as media_url,
			u.name,
			u.media_type,
			u.is_public,
			u.uploaded_by,
			usr.name as uploader_name,
			q.id as question_id,
			q.question_number,
			e.title as exam_title,
			s.name as subject_name
		FROM uploaded_media u
		LEFT JOIN questions q ON (u.url = q.media_url OR instr(q.question_text, u.url) > 0 OR instr(q.options_json, u.url) > 0)
		LEFT JOIN exams e ON q.exam_id = e.id
		LEFT JOIN subjects s ON e.subject_id = s.id
		LEFT JOIN users usr ON u.uploaded_by = usr.id
		WHERE u.school_id = ? AND (u.uploaded_by = ? OR u.is_public = 1)
		ORDER BY q.id IS NULL DESC, s.name ASC, e.title ASC, q.question_number ASC
	`;
  try {
    const result = await db.prepare(query).bind(locals.user?.school_id || -1, locals.user?.id || -1).all();
    return { mediaItems: result.results };
  } catch (e) {
    console.error("Fetch uploaded_media error:", e);
    return { mediaItems: [] };
  }
};
const actions = {
  deleteMedia: async ({ request, platform, locals }) => {
    const schoolId = locals.user?.school_id || -1;
    const db = getDB(platform);
    const form = await request.formData();
    const mediaUrl = form.get("media_url")?.toString();
    if (!mediaUrl || !mediaUrl.includes("res.cloudinary.com")) {
      return fail(400, { error: "URL Media tidak valid." });
    }
    const row = await db.prepare("SELECT uploaded_by, school_id FROM uploaded_media WHERE url = ? AND school_id = ?").bind(mediaUrl, schoolId).first();
    if (!row) {
      return fail(404, { error: "Media tidak ditemukan di sekolah Anda." });
    }
    if (row.uploaded_by !== locals.user?.id && locals.user?.role !== "admin" && locals.user?.role !== "superadmin") {
      return fail(403, { error: "Anda tidak berhak menghapus media ini." });
    }
    const deleteResult = await deleteFromCloudinary(mediaUrl, private_env);
    if (!deleteResult.success) {
      return fail(500, { error: `Gagal menghapus dari Cloudinary. Pesan: ${deleteResult.error}` });
    }
    await db.prepare("DELETE FROM uploaded_media WHERE url = ? AND school_id = ?").bind(mediaUrl, schoolId).run();
    await db.prepare("UPDATE questions SET media_url = NULL, media_type = NULL WHERE media_url = ?").bind(mediaUrl).run();
    return { success: "Media berhasil dihapus dari Cloudinary dan Database." };
  },
  toggleVisibility: async ({ request, platform, locals }) => {
    const schoolId = locals.user?.school_id || -1;
    const db = getDB(platform);
    const form = await request.formData();
    const mediaUrl = form.get("media_url")?.toString();
    const isPublic = form.get("is_public")?.toString() === "1" ? 1 : 0;
    if (!mediaUrl) return fail(400, { error: "URL Media tidak valid." });
    await db.prepare("UPDATE uploaded_media SET is_public = ? WHERE url = ? AND uploaded_by = ? AND school_id = ?").bind(isPublic, mediaUrl, locals.user?.id, schoolId).run();
    return { success: isPublic ? "Media berhasil ditampilkan untuk semua guru." : "Media berhasil disembunyikan (Privat)." };
  },
  updateName: async ({ request, platform, locals }) => {
    const schoolId = locals.user?.school_id || -1;
    const db = getDB(platform);
    const form = await request.formData();
    const mediaUrl = form.get("media_url")?.toString();
    const name = form.get("name")?.toString() || null;
    if (!mediaUrl) return fail(400, { error: "URL Media tidak valid." });
    const media = await db.prepare("SELECT uploaded_by FROM uploaded_media WHERE url = ? AND school_id = ?").bind(mediaUrl, schoolId).first();
    if (!media || media.uploaded_by !== locals.user?.id) {
      return fail(403, { error: "Anda tidak berhak mengubah berkas ini." });
    }
    await db.prepare("UPDATE uploaded_media SET name = ? WHERE url = ? AND school_id = ?").bind(name, mediaUrl, schoolId).run();
    return { success: "Nama berkas berhasil diperbarui." };
  },
  deleteBulk: async ({ request, platform, locals }) => {
    const schoolId = locals.user?.school_id || -1;
    const db = getDB(platform);
    const form = await request.formData();
    const urlsStr = form.get("urls")?.toString();
    if (!urlsStr) return fail(400, { error: "Data tidak valid." });
    let urls = [];
    try {
      urls = JSON.parse(urlsStr);
    } catch {
      return fail(400, { error: "Format data tidak valid." });
    }
    if (!Array.isArray(urls) || urls.length === 0) {
      return fail(400, { error: "Tidak ada media yang dipilih." });
    }
    let successCount = 0;
    for (const url of urls) {
      if (url.includes("res.cloudinary.com")) {
        const row = await db.prepare("SELECT uploaded_by, school_id FROM uploaded_media WHERE url = ? AND school_id = ?").bind(url, schoolId).first();
        if (!row || row.uploaded_by !== locals.user?.id && locals.user?.role !== "admin" && locals.user?.role !== "superadmin") {
          continue;
        }
        const deleteResult = await deleteFromCloudinary(url, private_env);
        if (deleteResult.success) {
          await db.prepare("DELETE FROM uploaded_media WHERE url = ? AND school_id = ?").bind(url, schoolId).run();
          await db.prepare("UPDATE questions SET media_url = NULL, media_type = NULL WHERE media_url = ?").bind(url).run();
          successCount++;
        }
      }
    }
    return { success: `${successCount} media berhasil dihapus secara massal.` };
  }
};
export {
  actions,
  load
};
