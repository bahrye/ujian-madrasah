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
async function ensureStudentAttemptsGradedColumn(db) {
  try {
    await db.prepare("ALTER TABLE student_attempts ADD COLUMN is_graded INTEGER DEFAULT 0").run();
  } catch (e) {
  }
}
async function ensureStudentAttemptsScoreReleasedColumn(db) {
  try {
    await db.prepare("ALTER TABLE student_attempts ADD COLUMN is_score_released INTEGER DEFAULT 0").run();
  } catch (e) {
  }
}
async function ensureUserLoginColumns(db) {
  try {
    await db.prepare("ALTER TABLE users ADD COLUMN is_logged_in INTEGER DEFAULT 0").run();
  } catch (e) {
  }
  try {
    await db.prepare("ALTER TABLE users ADD COLUMN session_token TEXT").run();
  } catch (e) {
  }
  try {
    await db.prepare("ALTER TABLE users ADD COLUMN last_active_at TEXT").run();
  } catch (e) {
  }
  try {
    await db.prepare("ALTER TABLE users ADD COLUMN login_device TEXT").run();
  } catch (e) {
  }
}
async function ensureStudentAnswersUniqueIndex(db) {
  try {
    await db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_answers_attempt_question ON student_answers(attempt_id, question_id)").run();
  } catch (e) {
  }
}
export {
  ensureExamTypeProctorsTable as a,
  ensureProctorRoleColumn as b,
  ensureStudentAttemptsScoreReleasedColumn as c,
  ensureTokenSessionColumn as d,
  ensureUserLoginColumns as e,
  dbRun as f,
  getDB as g,
  ensureStudentAttemptsGradedColumn as h,
  ensureStudentAnswersUniqueIndex as i
};
