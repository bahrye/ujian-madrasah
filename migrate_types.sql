-- 1. Create table exam_types
CREATE TABLE IF NOT EXISTS exam_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    start_time TEXT,
    end_time TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_exam_types_school ON exam_types(school_id);
CREATE INDEX IF NOT EXISTS idx_exam_types_active ON exam_types(is_active);

-- 2. Insert a default 'UMUM' exam type for the first school (assuming school_id = 1 exists, but let's do it for all existing schools just in case)
INSERT INTO exam_types (school_id, code, name, description, start_time, end_time, is_active)
SELECT id, 'UMUM', 'Ujian Umum', 'Tipe ujian default untuk sistem', datetime('now'), datetime('now', '+1 year'), 1
FROM schools
WHERE NOT EXISTS (SELECT 1 FROM exam_types WHERE exam_types.school_id = schools.id);

-- 3. Add exam_type_id to exams table
-- In SQLite, we can add a column.
ALTER TABLE exams ADD COLUMN exam_type_id INTEGER REFERENCES exam_types(id) ON DELETE SET NULL;

-- 4. Update existing exams to point to the UMUM exam type for their respective schools
UPDATE exams 
SET exam_type_id = (
    SELECT id FROM exam_types 
    WHERE exam_types.school_id = exams.school_id 
    LIMIT 1
)
WHERE exam_type_id IS NULL;
