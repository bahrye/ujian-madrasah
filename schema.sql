-- ============================================
-- Aplikasi Ujian Online Madrasah
-- Database Schema untuk Cloudflare D1 (SQLite)
-- ============================================

-- Tabel Sekolah (Tenant)
CREATE TABLE IF NOT EXISTS schools (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Tabel Kelas
CREATE TABLE IF NOT EXISTS classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    level TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Tabel Mata Pelajaran
CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Tabel Pengguna
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
    class_id INTEGER REFERENCES classes(id) ON DELETE SET NULL,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('superadmin', 'admin', 'guru', 'pengawas', 'siswa')),
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Tabel Ujian
CREATE TABLE IF NOT EXISTS exams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    start_time TEXT,
    end_time TEXT,
    is_active INTEGER NOT NULL DEFAULT 0,
    shuffle_questions INTEGER NOT NULL DEFAULT 0,
    show_result INTEGER NOT NULL DEFAULT 0,
    created_by INTEGER REFERENCES users(id),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Tabel Token Ujian
CREATE TABLE IF NOT EXISTS tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    exam_id INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    token_code TEXT NOT NULL UNIQUE,
    is_released INTEGER NOT NULL DEFAULT 0,
    released_at TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    expires_at TEXT NOT NULL
);

-- Tabel Soal (Bank Soal)
CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exam_id INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK(type IN ('pilihan_ganda', 'isian_singkat', 'essay', 'benar_salah', 'menjodohkan')),
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

-- Tabel Percobaan Ujian Siswa
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
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Tabel Jawaban Siswa
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

-- ============================================
-- Indexes untuk performa query
-- ============================================
CREATE INDEX IF NOT EXISTS idx_users_school ON users(school_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_exams_school ON exams(school_id);
CREATE INDEX IF NOT EXISTS idx_exams_active ON exams(is_active);
CREATE INDEX IF NOT EXISTS idx_tokens_exam ON tokens(exam_id);
CREATE INDEX IF NOT EXISTS idx_tokens_code ON tokens(token_code);
CREATE INDEX IF NOT EXISTS idx_questions_exam ON questions(exam_id);
CREATE INDEX IF NOT EXISTS idx_questions_type ON questions(type);
CREATE INDEX IF NOT EXISTS idx_attempts_student ON student_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_attempts_exam ON student_attempts(exam_id);
CREATE INDEX IF NOT EXISTS idx_attempts_status ON student_attempts(status);
CREATE INDEX IF NOT EXISTS idx_answers_attempt ON student_answers(attempt_id);
CREATE INDEX IF NOT EXISTS idx_answers_question ON student_answers(question_id);

-- Tabel Peserta Ujian (baru)
CREATE TABLE IF NOT EXISTS exam_participants (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	exam_id INTEGER NOT NULL,
	student_id INTEGER NOT NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
	FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
	UNIQUE(exam_id, student_id)
);
CREATE INDEX IF NOT EXISTS idx_exam_participants_exam ON exam_participants(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_participants_student ON exam_participants(student_id);

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

CREATE TABLE IF NOT EXISTS exam_proctors (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	exam_id INTEGER NOT NULL,
	proctor_id INTEGER NOT NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
	FOREIGN KEY (proctor_id) REFERENCES users(id) ON DELETE CASCADE,
	UNIQUE(exam_id, proctor_id)
);
CREATE INDEX IF NOT EXISTS idx_exam_proctors_exam ON exam_proctors(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_proctors_proctor ON exam_proctors(proctor_id);
