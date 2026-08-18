function getDB(platform) {
  if (!platform?.env?.DB) {
    throw new Error(
      "Database D1 tidak ditemukan. Pastikan binding DB sudah dikonfigurasi di wrangler.toml dan Anda menjalankan dengan --local flag atau sudah deploy ke Cloudflare."
    );
  }
  return platform.env.DB;
}
async function dbRun(db, query, ...params) {
  try {
    return await db.prepare(query).bind(...params).run();
  } catch (err) {
    console.error("DB Error:", err);
    throw err;
  }
}
async function ensureUserLoginPinColumn(db) {
  if (!db) return;
  try {
    await db.prepare("ALTER TABLE users ADD COLUMN login_pin TEXT").run();
  } catch {
  }
}
export {
  dbRun as d,
  ensureUserLoginPinColumn as e,
  getDB as g
};
