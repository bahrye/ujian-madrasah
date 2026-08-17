/**
 * Helper untuk mendapatkan D1 Database instance dari platform binding
 */
export function getDB(platform: App.Platform | undefined): D1Database {
	if (!platform?.env?.DB) {
		throw new Error(
			'Database D1 tidak ditemukan. Pastikan binding DB sudah dikonfigurasi di wrangler.toml ' +
			'dan Anda menjalankan dengan --local flag atau sudah deploy ke Cloudflare.'
		);
	}
	return platform.env.DB;
}

/**
 * Helper untuk menjalankan query dengan error handling
 */
export async function dbRun(db: D1Database, query: string, ...params: unknown[]) {
	try {
		return await db.prepare(query).bind(...params).run();
	} catch (err) {
		console.error('DB Error:', err);
		throw err;
	}
}

export async function dbGet<T = Record<string, unknown>>(db: D1Database, query: string, ...params: unknown[]): Promise<T | null> {
	try {
		return await db.prepare(query).bind(...params).first<T>();
	} catch (err) {
		console.error('DB Error:', err);
		throw err;
	}
}

export async function dbAll<T = Record<string, unknown>>(db: D1Database, query: string, ...params: unknown[]): Promise<T[]> {
	try {
		const result = await db.prepare(query).bind(...params).all<T>();
		return result.results;
	} catch (err) {
		console.error('DB Error:', err);
		throw err;
	}
}

export async function ensureTokenSessionColumn(db: D1Database) {
	try {
		await db.prepare('ALTER TABLE tokens ADD COLUMN session_number INTEGER DEFAULT 1').run();
	} catch (e: any) {
		// Ignore error if column already exists
	}
}

export async function ensureProctorRoleColumn(db: D1Database) {
	try {
		await db.prepare("ALTER TABLE exam_proctors ADD COLUMN proctor_role TEXT DEFAULT 'p1'").run();
	} catch (e: any) {
		// Ignore error if column already exists
	}
}

export async function ensureExamTypeProctorsTable(db: D1Database) {
	try {
		await db.prepare(`
			CREATE TABLE IF NOT EXISTS exam_type_proctors (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				exam_type_id INTEGER NOT NULL,
				proctor_id INTEGER NOT NULL,
				proctor_role TEXT DEFAULT 'pt',
				UNIQUE(exam_type_id, proctor_id)
			)
		`).run();
	} catch (e: any) {
		// Ignore error
	}
}

export async function ensureStudentAttemptsGradedColumn(db: D1Database) {
	try {
		await db.prepare('ALTER TABLE student_attempts ADD COLUMN is_graded INTEGER DEFAULT 0').run();
	} catch (e: any) {
		// Ignore error if column already exists
	}
}

export async function ensureStudentAttemptsScoreReleasedColumn(db: D1Database) {
	try {
		await db.prepare('ALTER TABLE student_attempts ADD COLUMN is_score_released INTEGER DEFAULT 0').run();
	} catch (e: any) {
		// Ignore error if column already exists
	}
}

export async function ensureUserLoginColumns(db: D1Database) {
	try {
		await db.prepare('ALTER TABLE users ADD COLUMN is_logged_in INTEGER DEFAULT 0').run();
	} catch (e: any) {}
	try {
		await db.prepare('ALTER TABLE users ADD COLUMN session_token TEXT').run();
	} catch (e: any) {}
	try {
		await db.prepare('ALTER TABLE users ADD COLUMN last_active_at TEXT').run();
	} catch (e: any) {}
	try {
		await db.prepare('ALTER TABLE users ADD COLUMN login_device TEXT').run();
	} catch (e: any) {}
}

export async function ensureStudentAnswersUniqueIndex(db: D1Database) {
	try {
		await db.prepare('CREATE UNIQUE INDEX IF NOT EXISTS idx_answers_attempt_question ON student_answers(attempt_id, question_id)').run();
	} catch (e: any) {}
}
