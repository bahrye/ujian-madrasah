import { fail } from "@sveltejs/kit";
import { g as getDB } from "../../../../chunks/db.js";
const load = async ({ locals, platform }) => {
  const db = getDB(platform);
  const school = await db.prepare("SELECT * FROM schools WHERE id = ?").bind(locals.user.school_id).first();
  return { school };
};
const actions = {
  update: async ({ request, locals, platform }) => {
    const db = getDB(platform);
    const data = await request.formData();
    const name = data.get("name")?.toString().trim();
    const principal_name = data.get("principal_name")?.toString().trim() || null;
    const npsn = data.get("npsn")?.toString().trim() || null;
    const phone = data.get("phone")?.toString().trim() || null;
    const email = data.get("email")?.toString().trim() || null;
    const address = data.get("address")?.toString().trim() || null;
    const accreditation = data.get("accreditation")?.toString().trim() || null;
    const website = data.get("website")?.toString().trim() || null;
    const logo_url = data.get("logo_url")?.toString().trim() || null;
    if (!name) {
      return fail(400, { error: "Nama sekolah wajib diisi." });
    }
    try {
      await db.prepare(
        `UPDATE schools SET
						name = ?, principal_name = ?, npsn = ?, phone = ?, email = ?,
						address = ?, accreditation = ?, website = ?, logo_url = ?,
						updated_at = datetime('now')
					WHERE id = ?`
      ).bind(
        name,
        principal_name,
        npsn,
        phone,
        email,
        address,
        accreditation,
        website,
        logo_url,
        locals.user.school_id
      ).run();
      return { success: true, message: "Profil sekolah berhasil disimpan." };
    } catch (e) {
      console.error(e);
      return fail(500, { error: "Gagal menyimpan profil sekolah." });
    }
  }
};
export {
  actions,
  load
};
