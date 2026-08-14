-- Schema Database Ujian Madrasah / CBT
-- Single Source of Truth for D1 Database Structure

-- 1. Tabel Sekolah (Tenant)
CREATE TABLE IF NOT EXISTS schools (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT,
    logo_url TEXT,
    principal_name TEXT,
    npsn TEXT,
    phone TEXT,
    email TEXT,
    accreditation TEXT,
    website TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 2. Tabel Kelas
CREATE TABLE IF NOT EXISTS classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    level TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_classes_school ON classes(school_id);

-- 3. Tabel Mata Pelajaran
CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_subjects_school ON subjects(school_id);

-- 4. Tabel Pengguna (Admin, Guru, Pengawas, Siswa)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    class_id INTEGER REFERENCES classes(id) ON DELETE SET NULL,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('superadmin', 'admin', 'guru', 'pengawas', 'siswa', 'panitia')),
    place_of_birth TEXT,
    date_of_birth TEXT,
    photo TEXT,
    gender TEXT,
    nisn TEXT,
    nomor_peserta TEXT,
    session_number INTEGER DEFAULT 1,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_users_school ON users(school_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- 5. Tabel Tipe Ujian
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

-- 6. Tabel Kelas Default per Tipe Ujian
CREATE TABLE IF NOT EXISTS exam_type_classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exam_type_id INTEGER NOT NULL REFERENCES exam_types(id) ON DELETE CASCADE,
    class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(exam_type_id, class_id)
);
CREATE INDEX IF NOT EXISTS idx_exam_type_classes_type ON exam_type_classes(exam_type_id);
CREATE INDEX IF NOT EXISTS idx_exam_type_classes_class ON exam_type_classes(class_id);

-- 7. Tabel Ujian
CREATE TABLE IF NOT EXISTS exams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    exam_type_id INTEGER REFERENCES exam_types(id) ON DELETE SET NULL,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    start_time TEXT,
    end_time TEXT,
    is_active INTEGER NOT NULL DEFAULT 0,
    shuffle_questions INTEGER NOT NULL DEFAULT 0,
    show_score_type TEXT DEFAULT 'after_submit',
    is_score_released INTEGER NOT NULL DEFAULT 0,
    show_result INTEGER NOT NULL DEFAULT 0,
    max_attempts INTEGER NOT NULL DEFAULT 1,
    created_by INTEGER REFERENCES users(id),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_exams_school ON exams(school_id);
CREATE INDEX IF NOT EXISTS idx_exams_active ON exams(is_active);

-- 8. Tabel Jadwal Sesi Ujian
CREATE TABLE IF NOT EXISTS exam_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exam_id INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    session_number INTEGER NOT NULL,
    start_time TEXT,
    end_time TEXT,
    UNIQUE(exam_id, session_number)
);

-- 9. Tabel Ruang Ujian
CREATE TABLE IF NOT EXISTS exam_rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    capacity INTEGER DEFAULT 30,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 10. Tabel Token Ujian
CREATE TABLE IF NOT EXISTS tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    exam_id INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    session_number INTEGER DEFAULT 1,
    token_code TEXT NOT NULL UNIQUE,
    is_released INTEGER NOT NULL DEFAULT 0,
    released_at TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    expires_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_tokens_exam ON tokens(exam_id);
CREATE INDEX IF NOT EXISTS idx_tokens_code ON tokens(token_code);
CREATE INDEX IF NOT EXISTS idx_tokens_exam_school ON tokens(exam_id, school_id);

-- 11. Tabel Soal (Bank Soal)
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
CREATE INDEX IF NOT EXISTS idx_questions_exam ON questions(exam_id);
CREATE INDEX IF NOT EXISTS idx_questions_type ON questions(type);

-- 12. Tabel Percobaan Ujian Siswa
CREATE TABLE IF NOT EXISTS student_attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL REFERENCES users(id),
    exam_id INTEGER NOT NULL REFERENCES exams(id),
    token_id INTEGER REFERENCES tokens(id),
    start_time TEXT NOT NULL DEFAULT (datetime('now')),
    end_time TEXT,
    submit_time TEXT,
    score REAL,
    total_points INTEGER,
    status TEXT NOT NULL DEFAULT 'mengerjakan' CHECK(status IN ('mengerjakan', 'selesai', 'waktu_habis')),
    violation_count INTEGER DEFAULT 0,
    violation_logs TEXT,
    is_paused INTEGER NOT NULL DEFAULT 0,
    paused_at TEXT,
    signature TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_attempts_student ON student_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_attempts_exam ON student_attempts(exam_id);
CREATE INDEX IF NOT EXISTS idx_attempts_exam_student ON student_attempts(exam_id, student_id);
CREATE INDEX IF NOT EXISTS idx_attempts_status ON student_attempts(status);

-- 13. Tabel Jawaban Siswa
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
CREATE INDEX IF NOT EXISTS idx_answers_attempt ON student_answers(attempt_id);
CREATE INDEX IF NOT EXISTS idx_answers_question ON student_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_answers_attempt_question ON student_answers(attempt_id, question_id);

-- 14. Tabel Peserta Ujian
CREATE TABLE IF NOT EXISTS exam_participants (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	exam_id INTEGER NOT NULL,
	student_id INTEGER NOT NULL,
	room_id INTEGER REFERENCES exam_rooms(id) ON DELETE SET NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
	FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
	UNIQUE(exam_id, student_id)
);
CREATE INDEX IF NOT EXISTS idx_exam_participants_exam ON exam_participants(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_participants_student ON exam_participants(student_id);

-- 15. Tabel Guru Ujian
CREATE TABLE IF NOT EXISTS exam_teachers (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	exam_id INTEGER NOT NULL,
	teacher_id INTEGER NOT NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
	FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
	UNIQUE(exam_id, teacher_id)
);
CREATE INDEX IF NOT EXISTS idx_exam_teachers_exam ON exam_teachers(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_teachers_teacher ON exam_teachers(teacher_id);

-- 16. Tabel Pengawas Ujian
CREATE TABLE IF NOT EXISTS exam_proctors (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	exam_id INTEGER NOT NULL,
	proctor_id INTEGER NOT NULL,
	room_id INTEGER REFERENCES exam_rooms(id) ON DELETE SET NULL,
	sessions TEXT,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
	FOREIGN KEY (proctor_id) REFERENCES users(id) ON DELETE CASCADE,
	UNIQUE(exam_id, proctor_id)
);
CREATE INDEX IF NOT EXISTS idx_exam_proctors_exam ON exam_proctors(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_proctors_proctor ON exam_proctors(proctor_id);

-- 17. Tabel Pelacak Media (Media Logs / Orphan Tracker)
CREATE TABLE IF NOT EXISTS uploaded_media (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
    name TEXT,
    url TEXT NOT NULL UNIQUE,
    media_type TEXT NOT NULL CHECK(media_type IN ('image', 'audio')),
    uploaded_by INTEGER REFERENCES users(id),
    is_public INTEGER NOT NULL DEFAULT 0,
    uploaded_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_uploaded_media_url ON uploaded_media(url);
CREATE INDEX IF NOT EXISTS idx_uploaded_media_school ON uploaded_media(school_id);
CREATE INDEX IF NOT EXISTS idx_uploaded_media_school_public ON uploaded_media(school_id, is_public);
