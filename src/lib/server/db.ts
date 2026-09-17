import { neon } from '@neondatabase/serverless';
import { env as privateEnv } from '$env/dynamic/private';

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

	// Convert all SQLite double-quoted string literals ("value" -> 'value')
	result = result.replace(/"([^"]*)"/g, "'$1'");

	// SQLite GROUP_CONCAT -> PostgreSQL STRING_AGG
	result = result.replace(
		/\bGROUP_CONCAT\s*\(\s*DISTINCT\s+([^,\)]+)\s*(?:,\s*('[^']*'|"[^"]*"))?\s*\)/gi,
		(_, col, sep) => `STRING_AGG(DISTINCT (${col})::text, ${sep ? sep.replace(/"/g, "'") : "', '"})`
	);
	result = result.replace(
		/\bGROUP_CONCAT\s*\(\s*([^,\)]+)\s*(?:,\s*('[^']*'|"[^"]*"))?\s*\)/gi,
		(_, col, sep) => `STRING_AGG((${col})::text, ${sep ? sep.replace(/"/g, "'") : "', '"})`
	);

	// SQLite JSON functions -> PostgreSQL JSON functions
	result = result.replace(/\bjson_group_array\s*\(/gi, 'json_agg(');
	result = result.replace(/\bjson_object\s*\(/gi, 'json_build_object(');
	result = result.replace(
		/\bSELECT\s+value\s+FROM\s+json_each\s*\(\s*([^)]+)\s*\)/gi,
		"SELECT json_array_elements_text(($1)::json)::int"
	);

	// SQLite julianday -> PostgreSQL epoch
	result = result.replace(
		/\bjulianday\s*\(\s*([^)]+)\s*\)/gi,
		"(EXTRACT(EPOCH FROM (NULLIF(($1)::text, '')::timestamp)) / 86400.0 + 2440587.5)"
	);

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

function sanitizeRow<T = Record<string, unknown>>(row: T): T {
	if (!row || typeof row !== 'object' || Array.isArray(row)) return row;
	const res: Record<string, unknown> = {};
	const stringOnlyColumns = [
		'password_hash',
		'token_code',
		'phone',
		'nisn',
		'nomor_peserta',
		'login_pin',
		'code',
		'session_token',
		'nip',
		'options_json',
		'correct_answer_json',
		'violation_logs',
		'signature',
		'answer_given',
		'start_time',
		'end_time',
		'created_at',
		'updated_at',
		'paused_at',
		'released_at',
		'expires_at',
		'answered_at',
		'last_active_at',
		'date_of_birth',
		'level',
		'class_level',
		'school_level',
		'jenjang',
		'school_jenjang'
	];

	for (const [key, val] of Object.entries(row as Record<string, unknown>)) {
		if (
			typeof val === 'string' &&
			/^-?\d+$/.test(val) &&
			val.length < 16 &&
			!stringOnlyColumns.includes(key.toLowerCase())
		) {
			const num = Number(val);
			if (Number.isSafeInteger(num)) {
				res[key] = num;
				continue;
			}
		}
		res[key] = val;
	}
	return res as T;
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
		const stmtObj: any = {
			_query: query,
			_boundParams: boundParams,
			bind(...values: unknown[]) {
				const flatValues = values.length === 1 && Array.isArray(values[0]) ? values[0] : values;
				return createPreparedStatement(query, flatValues);
			},

			async all<T = Record<string, unknown>>() {
				const { pgSql } = transformQuery(query);
				const rawRows = (await executeQuery(pgSql, boundParams)) as unknown as T[];
				const rows = Array.isArray(rawRows) ? rawRows.map((r) => sanitizeRow(r)) : [];
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
				const rawRows = (await executeQuery(pgSql, boundParams)) as unknown as Record<string, unknown>[];
				if (!rawRows || rawRows.length === 0) return null;
				const firstRow = sanitizeRow(rawRows[0]);
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

			async raw<T = unknown[]>(options?: { columnNames?: boolean }): Promise<any> {
				const { pgSql } = transformQuery(query);
				const rows = (await executeQuery(pgSql, boundParams)) as unknown as Record<string, unknown>[];
				if (!rows || rows.length === 0) return [];
				const values = rows.map((r) => Object.values(r));
				if (options?.columnNames && rows[0]) {
					return [Object.keys(rows[0]), ...values];
				}
				return values as T[];
			}
		};

		return stmtObj as unknown as D1PreparedStatement;
	}

	const adapter: D1Database = {
		prepare(query: string) {
			return createPreparedStatement(query);
		},

		async batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]> {
			if (!statements || statements.length === 0) return [];

			// Use Neon's single HTTP roundtrip transaction when available for massive speedup
			if (typeof sql.transaction === 'function' && typeof sql.query === 'function') {
				try {
					const queries = statements.map((stmt: any) => {
						const query = stmt._query || '';
						const boundParams = stmt._boundParams || [];
						const { pgSql, pgSqlWithReturning, isInsert, hasReturning } = transformQuery(query);
						const queryToRun = isInsert && !hasReturning ? pgSqlWithReturning : pgSql;
						const cleanParams = boundParams.map((p: any) => (p === undefined ? null : p));
						return sql.query(queryToRun, cleanParams, { fullResults: true });
					});

					const txResults = (await (sql as any).transaction(queries as any)) as any[];
					return txResults.map((res: any) => {
						let lastRowId: number | null = null;
						let rowCount = 0;
						if (Array.isArray(res)) {
							rowCount = res.length;
						} else if (res && typeof res === 'object') {
							rowCount = res.rowCount ?? (res.rows ? res.rows.length : 0);
							if (res.rows && res.rows.length > 0 && res.rows[0]?.id !== undefined) {
								lastRowId = Number(res.rows[0].id);
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
					});
				} catch (err) {
					console.warn('Batch transaction failed, falling back to sequential execution:', err);
				}
			}

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

		withSession(_token?: string): any {
			return adapter;
		},

		dump(): Promise<ArrayBuffer> {
			throw new Error('dump() is not supported on Neon PostgreSQL adapter.');
		}
	} as unknown as D1Database;

	return adapter;
}

/**
 * Helper untuk mendapatkan D1 Database instance (powered by Neon PostgreSQL)
 */
export function getDB(platform?: App.Platform): D1Database {
	// 1. Cek DATABASE_URL dari Cloudflare Platform env, SvelteKit dynamic private env, atau process.env
	const dbUrl =
		platform?.env?.DATABASE_URL ||
		privateEnv?.DATABASE_URL ||
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
