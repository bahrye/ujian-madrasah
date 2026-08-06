-- 1. Disable foreign key constraints temporarily
PRAGMA foreign_keys=off;

-- 3. Rename existing table
ALTER TABLE questions RENAME TO questions_old;

-- 4. Create new table with updated CHECK constraint
CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exam_id INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK(type IN ('pilihan_ganda', 'pilihan_ganda_kompleks', 'isian_singkat', 'essay', 'benar_salah', 'menjodohkan')),
    question_text TEXT NOT NULL,
    question_number INTEGER NOT NULL DEFAULT 0,
    points INTEGER NOT NULL DEFAULT 1,
    media_type TEXT CHECK(media_type IN ('image', 'audio') OR media_type IS NULL),
    media_url TEXT,
    audio_max_plays INTEGER DEFAULT 3,
    options_json TEXT,
    correct_answer_json TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 5. Copy data from old table to new table
INSERT INTO questions (id, exam_id, type, question_text, question_number, points, media_type, media_url, audio_max_plays, options_json, correct_answer_json, created_at)
SELECT id, exam_id, type, question_text, question_number, points, media_type, media_url, audio_max_plays, options_json, correct_answer_json, created_at
FROM questions_old;

-- 6. Recreate indexes
CREATE INDEX IF NOT EXISTS idx_questions_exam ON questions(exam_id);
CREATE INDEX IF NOT EXISTS idx_questions_type ON questions(type);

-- 7. Drop the old table
DROP TABLE questions_old;

-- 9. Re-enable foreign key constraints
PRAGMA foreign_keys=on;
