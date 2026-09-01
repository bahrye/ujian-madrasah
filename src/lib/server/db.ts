import { neon } from '@neondatabase/serverless';

// Default fallback connection string from configuration
const DEFAULT_DATABASE_URL =
	'postgresql://neondb_owner:npg_cH3eDR5VhETs@ep-soft-wildflower-az092xod-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

// Neon client cache
const clientCache = new Map<string, ReturnType<typeof neon>>();

function getNeonClient(connectionString: string) {
	let client = clientCache.get(connectionString);
	if (!client) {
		client = neon(connectionString);
		clientCache.set(connectionString, client);
	}
	return client;
}

/**
 * Transforms an SQLite-style query into PostgreSQL format:
 * 1. Replaces '?' placeholders with '$1', '$2', ... (ignoring quotes)
 * 2. Replaces SQLite datetime('now') / datetime("now")
 * 3. Handles INSERT OR IGNORE -> ON CONFLICT DO NOTHING
 */
function transformQuery(sql: string): {
	pgSql: string;
	pgSqlWithReturning: string;
	isInsert: boolean;
	hasReturning: boolean;
} {
	let inSingleQuote = false;
	let inDoubleQuote = false;
	let paramIndex = 1;
	let result = '';

	for (let i = 0; i < sql.length; i++) {
		const char = sql[i];
		const prevChar = i > 0 ? sql[i - 1] : '';

		if (char === "'" && prevChar !== '\\') {
			inSingleQuote = !inSingleQuote;
			result += char;
		} else if (char === '"' && prevChar !== '\\') {
			inDoubleQuote = !inDoubleQuote;
			result += char;
		} else if (char === '?' && !inSingleQuote && !inDoubleQuote) {
			result += `$${paramIndex++}`;
		} else {
			result += char;
		}
	}

	// SQLite datetime('now') / datetime("now") compatibility
	result = result.replace(/datetime\s*\(\s*['"]now['"]\s*\)/gi, "to_char(NOW(), 'YYYY-MM-DD HH24:MI:SS')");

	// Convert SQLite double-quoted string literals in comparisons (e.g. role != "siswa" -> role != 'siswa')
	result = result.replace(/(=|!=|<>|LIKE|NOT LIKE)\s*"([^"]+)"/gi, "$1 '$2'");

	// SQLite INSERT OR IGNORE -> ON CONFLICT DO NOTHING
	if (/^\s*INSERT\s+OR\s+IGNORE\s+INTO/i.test(result)) {
		result = result.replace(/^\s*INSERT\s+OR\s+IGNORE\s+INTO/i, 'INSERT INTO');
		if (!/ON\s+CONFLICT/i.test(result)) {
			result = result.replace(/;?\s*$/, ' ON CONFLICT DO NOTHING');
		}
	}

	const trimmed = result.trim();
	const isInsert = /^\s*INSERT\s+INTO/i.test(trimmed);
	const hasReturning = /\bRETURNING\b/i.test(trimmed);

	let pgSqlWithReturning = result;
	if (isInsert && !hasReturning && !/ON\s+CONFLICT\s+DO\s+NOTHING/i.test(trimmed)) {
		pgSqlWithReturning = result.replace(/;?\s*$/, ' RETURNING id');
	}

	return {
		pgSql: result,
		pgSqlWithReturning,
		isInsert,
		hasReturning
	};
}

/**
 * Creates a D1-compatible Database instance wrapping Neon PostgreSQL
 */
export function createNeonD1Adapter(connectionString: string): D1Database {
	const sql = getNeonClient(connectionString);

	const executeQuery = async (queryText: string, params: unknown[] = [], withFullResult = false) => {
		const cleanParams = params.map((p) => (p === undefined ? null : p));
		try {
			if (sql.query) {
				return await sql.query(queryText, cleanParams, { fullResults: withFullResult });
			}
			return await (sql as any)(queryText, cleanParams);
		} catch (err) {
			console.error('Neon DB Error:', err, '\nQuery:', queryText, '\nParams:', cleanParams);
			throw err;
		}
	};

	function createPreparedStatement(query: string, boundParams: unknown[] = []): D1PreparedStatement {
		const stmtObj: D1PreparedStatement = {
			bind(...values: unknown[]) {
				const flatValues = values.length === 1 && Array.isArray(values[0]) ? values[0] : values;
				return createPreparedStatement(query, flatValues);
			},

			async all<T = Record<string, unknown>>() {
				const { pgSql } = transformQuery(query);
				const rows = (await executeQuery(pgSql, boundParams)) as unknown as T[];
				return {
					results: rows || [],
					success: true,
					meta: {
						changes: 0,
						last_row_id: null,
						duration: 0,
						rows_read: rows?.length || 0,
						rows_written: 0
					} as any
				};
			},

			async first<T = Record<string, unknown>>(colName?: string) {
				const { pgSql } = transformQuery(query);
				const rows = (await executeQuery(pgSql, boundParams)) as unknown as Record<string, unknown>[];
				if (!rows || rows.length === 0) return null;
				const firstRow = rows[0];
				if (colName) {
					return (firstRow[colName] as T) ?? null;
				}
				return firstRow as T;
			},

			async run<T = Record<string, unknown>>() {
				const { pgSql, pgSqlWithReturning, isInsert, hasReturning } = transformQuery(query);
				const queryToRun = isInsert && !hasReturning ? pgSqlWithReturning : pgSql;

				const res = (await executeQuery(queryToRun, boundParams, true)) as any;

				let lastRowId: number | null = null;
				let rowCount = 0;

				if (Array.isArray(res)) {
					if (isInsert && res.length > 0 && res[0]?.id !== undefined) {
						lastRowId = Number(res[0].id);
					}
					rowCount = res.length;
				} else if (res && typeof res === 'object') {
					if (res.rows && Array.isArray(res.rows)) {
						if (isInsert && res.rows.length > 0 && res.rows[0]?.id !== undefined) {
							lastRowId = Number(res.rows[0].id);
						}
						rowCount = res.rowCount ?? res.rows.length;
					} else {
						rowCount = res.rowCount ?? 0;
					}
				}

				return {
					success: true,
					meta: {
						changes: rowCount,
						last_row_id: lastRowId,
						duration: 0,
						rows_read: 0,
						rows_written: rowCount
					} as any,
					results: []
				};
			},

			async raw<T = unknown[]>() {
				const { pgSql } = transformQuery(query);
				const rows = (await executeQuery(pgSql, boundParams)) as unknown as Record<string, unknown>[];
				if (!rows) return [];
				return rows.map((r) => Object.values(r)) as T[];
			}
		};

		return stmtObj;
	}

	const adapter: D1Database = {
		prepare(query: string) {
			return createPreparedStatement(query);
		},

		async batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]> {
			const results: D1Result<T>[] = [];
			for (const stmt of statements) {
				const res = await stmt.run<T>();
				results.push(res);
			}
			return results;
		},

		async exec(query: string): Promise<D1ExecResult> {
			const statements = query
				.split(';')
				.map((s) => s.trim())
				.filter(Boolean);

			for (const stmt of statements) {
				await executeQuery(stmt);
			}
			return {
				count: statements.length,
				duration: 0
			};
		},

		dump(): Promise<ArrayBuffer> {
			throw new Error('dump() is not supported on Neon PostgreSQL adapter.');
		}
	};

	return adapter;
}

/**
 * Helper untuk mendapatkan D1 Database instance (powered by Neon PostgreSQL)
 */
export function getDB(platform?: App.Platform): D1Database {
	// 1. Cek DATABASE_URL dari Cloudflare Platform env atau process.env
	const dbUrl =
		platform?.env?.DATABASE_URL ||
		(typeof process !== 'undefined' ? process.env?.DATABASE_URL : undefined) ||
		DEFAULT_DATABASE_URL;

	if (dbUrl) {
		return createNeonD1Adapter(dbUrl);
	}

	// 2. Fallback jika ada D1 Database binding asli di Cloudflare
	if (platform?.env?.DB) {
		return platform.env.DB;
	}

	// 3. Gunakan DEFAULT_DATABASE_URL sebagai fallback aman
	return createNeonD1Adapter(DEFAULT_DATABASE_URL);
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

export async function dbGet<T = Record<string, unknown>>(
	db: D1Database,
	query: string,
	...params: unknown[]
): Promise<T | null> {
	try {
		return await db.prepare(query).bind(...params).first<T>();
	} catch (err) {
		console.error('DB Error:', err);
		throw err;
	}
}

export async function dbAll<T = Record<string, unknown>>(
	db: D1Database,
	query: string,
	...params: unknown[]
): Promise<T[]> {
	try {
		const result = await db.prepare(query).bind(...params).all<T>();
		return result.results;
	} catch (err) {
		console.error('DB Error:', err);
		throw err;
	}
}

// Schema verify no-ops
export async function ensureTokenSessionColumn(db?: D1Database) {
	return;
}
export async function ensureProctorRoleColumn(db?: D1Database) {
	return;
}
export async function ensureExamTypeProctorsTable(db?: D1Database) {
	return;
}
export async function ensureStudentAttemptsGradedColumn(db?: D1Database) {
	return;
}
export async function ensureStudentAttemptsScoreReleasedColumn(db?: D1Database) {
	return;
}
export async function ensureUserLoginColumns(db?: D1Database) {
	return;
}
export async function ensureStudentAnswersUniqueIndex(db?: D1Database) {
	return;
}
export async function ensureUserLoginPinColumn(db?: D1Database) {
	return;
}
