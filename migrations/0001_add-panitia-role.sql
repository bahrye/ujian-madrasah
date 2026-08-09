PRAGMA foreign_keys=OFF;

BEGIN TRANSACTION;

CREATE TABLE new_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
    class_id INTEGER REFERENCES classes(id) ON DELETE SET NULL,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('superadmin', 'admin', 'guru', 'pengawas', 'siswa', 'panitia')),
    place_of_birth TEXT,
    date_of_birth TEXT,
    photo TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT INTO new_users (id, school_id, username, password_hash, name, role, is_active, created_at, updated_at, place_of_birth, date_of_birth)
SELECT id, school_id, username, password_hash, name, role, is_active, created_at, updated_at, place_of_birth, date_of_birth FROM users;

DROP TABLE users;
ALTER TABLE new_users RENAME TO users;

CREATE INDEX idx_users_school ON users(school_id);
CREATE INDEX idx_users_class ON users(class_id);

COMMIT;

PRAGMA foreign_keys=ON;
