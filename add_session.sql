ALTER TABLE users ADD COLUMN session_number INTEGER DEFAULT 1;

CREATE TABLE IF NOT EXISTS exam_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exam_id INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    session_number INTEGER NOT NULL,
    start_time TEXT,
    end_time TEXT,
    UNIQUE(exam_id, session_number)
);
