ALTER TABLE student_attempts ADD COLUMN is_paused INTEGER NOT NULL DEFAULT 0;
ALTER TABLE student_attempts ADD COLUMN paused_at TEXT;
