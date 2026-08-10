CREATE TABLE IF NOT EXISTS exam_type_classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exam_type_id INTEGER NOT NULL REFERENCES exam_types(id) ON DELETE CASCADE,
    class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(exam_type_id, class_id)
);
CREATE INDEX IF NOT EXISTS idx_exam_type_classes_type ON exam_type_classes(exam_type_id);
CREATE INDEX IF NOT EXISTS idx_exam_type_classes_class ON exam_type_classes(class_id);

INSERT INTO exam_type_classes (exam_type_id, class_id)
SELECT DISTINCT etp.exam_type_id, u.class_id
FROM exam_type_participants etp
JOIN users u ON etp.student_id = u.id
WHERE u.class_id IS NOT NULL
ON CONFLICT DO NOTHING;

DROP TABLE IF EXISTS exam_type_participants;
