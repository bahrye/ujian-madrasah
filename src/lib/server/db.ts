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

// Flag untuk memastikan schema check tidak dijalankan berulang kali
let isSchemaVerified = false;

export async function ensureTokenSessionColumn(db?: D1Database) {
	// No-op: Session number column is already included in schema
	return;
}

export async function ensureProctorRoleColumn(db?: D1Database) {
	// No-op: Proctor role column is already included in schema
	return;
}

export async function ensureExamTypeProctorsTable(db?: D1Database) {
	// No-op: Exam type proctors table is already included in schema
	return;
}

export async function ensureStudentAttemptsGradedColumn(db?: D1Database) {
	// No-op: Graded column is already included in schema
	return;
}

export async function ensureStudentAttemptsScoreReleasedColumn(db?: D1Database) {
	// No-op: Score released column is already included in schema
	return;
}

export async function ensureUserLoginColumns(db?: D1Database) {
	// No-op: User login session columns are already included in schema
	return;
}

export async function ensureStudentAnswersUniqueIndex(db?: D1Database) {
	// No-op: Unique index is already included in schema
	return;
}

