CREATE TABLE IF NOT EXISTS exam_rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exam_id INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_exam_rooms_exam ON exam_rooms(exam_id);

ALTER TABLE exam_participants ADD COLUMN room_id INTEGER REFERENCES exam_rooms(id) ON DELETE SET NULL;
ALTER TABLE exam_proctors ADD COLUMN room_id INTEGER REFERENCES exam_rooms(id) ON DELETE SET NULL;
ALTER TABLE exam_teachers ADD COLUMN room_id INTEGER REFERENCES exam_rooms(id) ON DELETE SET NULL;
