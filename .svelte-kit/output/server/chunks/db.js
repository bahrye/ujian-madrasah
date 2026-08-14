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
async function ensureTokenSessionColumn(db) {
  try {
    await db.prepare("ALTER TABLE tokens ADD COLUMN session_number INTEGER DEFAULT 1").run();
  } catch (e) {
  }
}
async function ensureProctorRoleColumn(db) {
  try {
    await db.prepare("ALTER TABLE exam_proctors ADD COLUMN proctor_role TEXT DEFAULT 'p1'").run();
  } catch (e) {
  }
}
async function ensureExamTypeProctorsTable(db) {
  try {
    await db.prepare(`
			CREATE TABLE IF NOT EXISTS exam_type_proctors (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				exam_type_id INTEGER NOT NULL,
				proctor_id INTEGER NOT NULL,
				proctor_role TEXT DEFAULT 'pt',
				UNIQUE(exam_type_id, proctor_id)
			)
		`).run();
  } catch (e) {
  }
}
export {
  ensureProctorRoleColumn as a,
  ensureTokenSessionColumn as b,
  dbRun as d,
  ensureExamTypeProctorsTable as e,
  getDB as g
};
