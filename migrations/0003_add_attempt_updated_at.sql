-- Migration 0003: Add updated_at tracking to student_attempts
ALTER TABLE student_attempts ADD COLUMN updated_at TEXT DEFAULT (datetime('now'));
