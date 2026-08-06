PRAGMA foreign_keys=off;

ALTER TABLE student_answers RENAME TO student_answers_old;

CREATE TABLE IF NOT EXISTS student_answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    attempt_id INTEGER NOT NULL REFERENCES student_attempts(id) ON DELETE CASCADE,
    question_id INTEGER NOT NULL REFERENCES questions(id),
    answer_given TEXT,
    score_given REAL,
    is_correct INTEGER,
    is_doubted INTEGER NOT NULL DEFAULT 0,
    answered_at TEXT DEFAULT (datetime('now'))
);

INSERT INTO student_answers SELECT * FROM student_answers_old;

CREATE INDEX IF NOT EXISTS idx_answers_attempt ON student_answers(attempt_id);
CREATE INDEX IF NOT EXISTS idx_answers_question ON student_answers(question_id);

DROP TABLE student_answers_old;

PRAGMA foreign_keys=on;
