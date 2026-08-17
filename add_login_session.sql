-- Migration: Add user login session tracking columns
ALTER TABLE users ADD COLUMN is_logged_in INTEGER NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN session_token TEXT;
ALTER TABLE users ADD COLUMN last_active_at TEXT;
ALTER TABLE users ADD COLUMN login_device TEXT;
