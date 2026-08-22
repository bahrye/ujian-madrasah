-- Migration 0003: Add updated_at tracking to student_attempts
ALTER TABLE student_attempts ADD COLUMN updated_at TEXT;
UPDATE student_attempts SET updated_at = COALESCE(created_at, datetime('now')) WHERE updated_at IS NULL;
