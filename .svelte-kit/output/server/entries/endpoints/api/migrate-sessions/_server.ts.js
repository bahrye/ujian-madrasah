import { json } from "@sveltejs/kit";
import { g as getDB, f as dbRun } from "../../../../chunks/db.js";
const GET = async ({ platform }) => {
  try {
    const db2 = getDB(platform);
    await dbRun(db2, "ALTER TABLE users ADD COLUMN session_number INTEGER DEFAULT 1");
    await dbRun(db2, `
            CREATE TABLE IF NOT EXISTS exam_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                exam_id INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
                session_number INTEGER NOT NULL,
                start_time TEXT,
                end_time TEXT,
                UNIQUE(exam_id, session_number)
            )
        `);
    return json({ success: true, message: "Migration applied successfully" });
  } catch (e) {
    if (e.message.includes("duplicate column name")) {
      await dbRun(db, `
                CREATE TABLE IF NOT EXISTS exam_sessions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    exam_id INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
                    session_number INTEGER NOT NULL,
                    start_time TEXT,
                    end_time TEXT,
                    UNIQUE(exam_id, session_number)
                )
            `);
      return json({ success: true, message: "Migration partially applied (column existed)" });
    }
    return json({ success: false, error: e.message });
  }
};
export {
  GET
};
