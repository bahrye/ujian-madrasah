const fs = require('fs');
let text = fs.readFileSync('schema.sql', 'utf8');

// split the file by the last known unique index
let parts = text.split('CREATE INDEX IF NOT EXISTS idx_exam_type_classes_class ON exam_type_classes(class_id);');

// get the first part and re-append the split token
let sql = parts[0] + 'CREATE INDEX IF NOT EXISTS idx_exam_type_classes_class ON exam_type_classes(class_id);\n';

// Add the exam_rooms
const roomsSql = `
-- Tabel Ruang Ujian
CREATE TABLE IF NOT EXISTS exam_rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exam_id INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_exam_rooms_exam ON exam_rooms(exam_id);

`;

sql = sql.replace('-- Tabel Peserta Ujian', roomsSql + '-- Tabel Peserta Ujian');

sql = sql.replace('student_id INTEGER NOT NULL,\r\n\tcreated_at DATETIME', 'student_id INTEGER NOT NULL,\r\n\troom_id INTEGER REFERENCES exam_rooms(id) ON DELETE SET NULL,\r\n\tcreated_at DATETIME');
sql = sql.replace('student_id INTEGER NOT NULL,\n\tcreated_at DATETIME', 'student_id INTEGER NOT NULL,\n\troom_id INTEGER REFERENCES exam_rooms(id) ON DELETE SET NULL,\n\tcreated_at DATETIME');

sql = sql.replace('teacher_id INTEGER NOT NULL,\r\n\tcreated_at DATETIME', 'teacher_id INTEGER NOT NULL,\r\n\troom_id INTEGER REFERENCES exam_rooms(id) ON DELETE SET NULL,\r\n\tcreated_at DATETIME');
sql = sql.replace('teacher_id INTEGER NOT NULL,\n\tcreated_at DATETIME', 'teacher_id INTEGER NOT NULL,\n\troom_id INTEGER REFERENCES exam_rooms(id) ON DELETE SET NULL,\n\tcreated_at DATETIME');

sql = sql.replace('proctor_id INTEGER NOT NULL,\r\n\tcreated_at DATETIME', 'proctor_id INTEGER NOT NULL,\r\n\troom_id INTEGER REFERENCES exam_rooms(id) ON DELETE SET NULL,\r\n\tcreated_at DATETIME');
sql = sql.replace('proctor_id INTEGER NOT NULL,\n\tcreated_at DATETIME', 'proctor_id INTEGER NOT NULL,\n\troom_id INTEGER REFERENCES exam_rooms(id) ON DELETE SET NULL,\n\tcreated_at DATETIME');

fs.writeFileSync('schema.sql', sql);
