import type { D1Database } from '@cloudflare/workers-types';

export interface ActivityLogEntry {
	schoolId?: number | null;
	userId?: number | null;
	userName?: string | null;
	userRole?: string | null;
	action: string;
	detail?: string | null;
	ipAddress?: string | null;
}

let isTableChecked = false;

/**
 * Ensures the activity_logs table exists in the database.
 * Supports both SQLite (Cloudflare D1) and PostgreSQL (Neon).
 */
export async function ensureActivityLogTable(db: any): Promise<void> {
	if (isTableChecked || !db) return;

	try {
		await db.prepare(`
			CREATE TABLE IF NOT EXISTS activity_logs (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				school_id INTEGER,
				user_id INTEGER,
				user_name TEXT,
				user_role TEXT,
				action TEXT NOT NULL,
				detail TEXT,
				ip_address TEXT,
				created_at TEXT NOT NULL DEFAULT (datetime('now'))
			)
		`).run();

		try {
			await db.prepare(`CREATE INDEX IF NOT EXISTS idx_activity_logs_school ON activity_logs(school_id)`).run();
		} catch {}

		try {
			await db.prepare(`CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs(created_at DESC)`).run();
		} catch {}

		isTableChecked = true;
	} catch (e: any) {
		// If SQLite AUTOINCREMENT translation fails on Postgres, fallback to Postgres SERIAL
		try {
			await db.prepare(`
				CREATE TABLE IF NOT EXISTS activity_logs (
					id SERIAL PRIMARY KEY,
					school_id INTEGER,
					user_id INTEGER,
					user_name TEXT,
					user_role TEXT,
					action TEXT NOT NULL,
					detail TEXT,
					ip_address TEXT,
					created_at TEXT NOT NULL DEFAULT (to_char(NOW(), 'YYYY-MM-DD HH24:MI:SS'))
				)
			`).run();
			isTableChecked = true;
		} catch (innerErr) {
			console.warn('ensureActivityLogTable fallback error:', innerErr);
		}
	}
}

/**
 * Records an activity log entry safely without throwing errors.
 */
export async function recordActivityLog(db: any, entry: ActivityLogEntry): Promise<void> {
	if (!db || !entry.action) return;

	try {
		await ensureActivityLogTable(db);

		await db.prepare(`
			INSERT INTO activity_logs (school_id, user_id, user_name, user_role, action, detail, ip_address, created_at)
			VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
		`).bind(
			entry.schoolId ?? null,
			entry.userId ?? null,
			entry.userName ?? null,
			entry.userRole ?? null,
			entry.action,
			entry.detail ?? null,
			entry.ipAddress ?? null
		).run();

		// Auto-pruning ringan (1 dari 50 kesempatan agar sangat hemat D1)
		if (Math.random() < 0.02 && entry.schoolId) {
			try {
				await db.prepare(`
					DELETE FROM activity_logs 
					WHERE school_id = ? AND id NOT IN (
						SELECT id FROM activity_logs 
						WHERE school_id = ? 
						ORDER BY id DESC 
						LIMIT 1000
					)
				`).bind(entry.schoolId, entry.schoolId).run();
			} catch {}
		}
	} catch (err) {
		console.warn('Failed to record activity log:', err);
	}
}

/**
 * Helper to extract client IP address from SvelteKit request or Cloudflare headers
 */
export function getClientIp(request: Request, getClientAddress?: () => string): string {
	const cfIp = request.headers.get('cf-connecting-ip');
	if (cfIp) return cfIp.trim();

	const xForwarded = request.headers.get('x-forwarded-for');
	if (xForwarded) {
		const first = xForwarded.split(',')[0].trim();
		if (first) return first;
	}

	const xRealIp = request.headers.get('x-real-ip');
	if (xRealIp) return xRealIp.trim();

	if (getClientAddress) {
		try {
			return getClientAddress() || '127.0.0.1';
		} catch {}
	}

	return '127.0.0.1';
}
