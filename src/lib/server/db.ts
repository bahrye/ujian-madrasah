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

