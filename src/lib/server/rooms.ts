export interface RoomItem {
	id: number;
	school_id: number;
	name: string;
	location: string | null;
	capacity: number;
	is_active: number;
	created_at: string;
	updated_at: string;
}

let isRoomsTableChecked = false;

/**
 * Ensures the master rooms table exists in the database.
 * Supports both SQLite (Cloudflare D1) and PostgreSQL (Neon).
 */
export async function ensureRoomsTable(db: any): Promise<void> {
	if (isRoomsTableChecked || !db) return;

	try {
		await db.prepare(`
			CREATE TABLE IF NOT EXISTS rooms (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
				name TEXT NOT NULL,
				location TEXT,
				capacity INTEGER DEFAULT 30,
				is_active INTEGER NOT NULL DEFAULT 1,
				created_at TEXT NOT NULL DEFAULT (datetime('now')),
				updated_at TEXT NOT NULL DEFAULT (datetime('now'))
			)
		`).run();

		try {
			await db.prepare(`CREATE INDEX IF NOT EXISTS idx_rooms_school ON rooms(school_id)`).run();
		} catch {}

		isRoomsTableChecked = true;
	} catch (e: any) {
		// Postgres SERIAL fallback
		try {
			await db.prepare(`
				CREATE TABLE IF NOT EXISTS rooms (
					id SERIAL PRIMARY KEY,
					school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
					name TEXT NOT NULL,
					location TEXT,
					capacity INTEGER DEFAULT 30,
					is_active INTEGER NOT NULL DEFAULT 1,
					created_at TEXT NOT NULL DEFAULT (to_char(NOW(), 'YYYY-MM-DD HH24:MI:SS')),
					updated_at TEXT NOT NULL DEFAULT (to_char(NOW(), 'YYYY-MM-DD HH24:MI:SS'))
				)
			`).run();
			isRoomsTableChecked = true;
		} catch (innerErr) {
			console.warn('ensureRoomsTable fallback error:', innerErr);
		}
	}
}
