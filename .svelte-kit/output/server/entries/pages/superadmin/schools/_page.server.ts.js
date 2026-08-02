import { fail } from "@sveltejs/kit";
import { g as getDB } from "../../../../chunks/db.js";
const load = async ({ platform }) => {
  const db = getDB(platform);
  const { results: schools } = await db.prepare("SELECT * FROM schools ORDER BY name ASC").all();
  return { schools };
};
const actions = {
  add: async ({ request, platform }) => {
    const db = getDB(platform);
    const data = await request.formData();
    const name = data.get("name")?.toString().trim();
    const address = data.get("address")?.toString().trim() || null;
    if (!name) {
      return fail(400, { error: "Nama sekolah wajib diisi", name, address });
    }
    try {
      await db.prepare("INSERT INTO schools (name, address) VALUES (?, ?)").bind(name, address).run();
      return { success: true };
    } catch (e) {
      return fail(500, { error: "Gagal menambahkan sekolah", name, address });
    }
  },
  toggleStatus: async ({ request, platform }) => {
    const db = getDB(platform);
    const data = await request.formData();
    const id = data.get("id")?.toString();
    const currentStatus = data.get("is_active")?.toString();
    if (!id || !currentStatus) return fail(400, { error: "Data tidak valid" });
    const newStatus = currentStatus === "1" ? 0 : 1;
    try {
      await db.prepare('UPDATE schools SET is_active = ?, updated_at = datetime("now") WHERE id = ?').bind(newStatus, id).run();
      return { success: true };
    } catch (e) {
      return fail(500, { error: "Gagal merubah status sekolah" });
    }
  }
};
export {
  actions,
  load
};
