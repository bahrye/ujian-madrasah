import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_cH3eDR5VhETs@ep-soft-wildflower-az092xod-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function fixAllColumns() {
	console.log('Connecting to Neon PostgreSQL...');
	const sql = neon(databaseUrl);

	console.log('Ensuring all tables and columns exist in Neon PostgreSQL...');

	const statements = [
		// schools
		'ALTER TABLE schools ADD COLUMN IF NOT EXISTS require_exambro INTEGER NOT NULL DEFAULT 0',
		'ALTER TABLE schools ADD COLUMN IF NOT EXISTS master_exit_pin TEXT',
		'ALTER TABLE schools ADD COLUMN IF NOT EXISTS principal_nip TEXT',
		'ALTER TABLE schools ADD COLUMN IF NOT EXISTS province TEXT',
		'ALTER TABLE schools ADD COLUMN IF NOT EXISTS city TEXT',
		'ALTER TABLE schools ADD COLUMN IF NOT EXISTS district TEXT',
		'ALTER TABLE schools ADD COLUMN IF NOT EXISTS village TEXT',
		'ALTER TABLE schools ADD COLUMN IF NOT EXISTS postal_code TEXT',

		// users
		'ALTER TABLE users ADD COLUMN IF NOT EXISTS nip TEXT',
		'ALTER TABLE users ADD COLUMN IF NOT EXISTS session_number INTEGER DEFAULT 1',
		'ALTER TABLE users ADD COLUMN IF NOT EXISTS login_pin TEXT',
		'ALTER TABLE users ADD COLUMN IF NOT EXISTS login_device TEXT',
		'ALTER TABLE users ADD COLUMN IF NOT EXISTS last_active_at TEXT',
		'ALTER TABLE users ADD COLUMN IF NOT EXISTS session_token TEXT',
		'ALTER TABLE users ADD COLUMN IF NOT EXISTS is_logged_in INTEGER DEFAULT 0',

		// exams
		'ALTER TABLE exams ADD COLUMN IF NOT EXISTS exit_pin TEXT',
		'ALTER TABLE exams ADD COLUMN IF NOT EXISTS class_id INTEGER REFERENCES classes(id) ON DELETE SET NULL',
		'ALTER TABLE exams ADD COLUMN IF NOT EXISTS exam_type_id INTEGER REFERENCES exam_types(id) ON DELETE SET NULL',
		'ALTER TABLE exams ADD COLUMN IF NOT EXISTS max_attempts INTEGER DEFAULT 1',

		// exam_rooms
		'ALTER TABLE exam_rooms ADD COLUMN IF NOT EXISTS exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE',
		'ALTER TABLE exam_rooms ADD COLUMN IF NOT EXISTS school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE',
		'ALTER TABLE exam_rooms ALTER COLUMN school_id DROP NOT NULL',
		'ALTER TABLE exam_rooms ADD COLUMN IF NOT EXISTS capacity INTEGER DEFAULT 30',

		// exam_teachers
		'ALTER TABLE exam_teachers ADD COLUMN IF NOT EXISTS room_id INTEGER REFERENCES exam_rooms(id) ON DELETE SET NULL',

		// exam_proctors
		'ALTER TABLE exam_proctors ADD COLUMN IF NOT EXISTS room_id INTEGER REFERENCES exam_rooms(id) ON DELETE SET NULL',
		'ALTER TABLE exam_proctors ADD COLUMN IF NOT EXISTS sessions TEXT',
		"ALTER TABLE exam_proctors ADD COLUMN IF NOT EXISTS proctor_role TEXT DEFAULT 'p1'",

		// exam_participants
		'ALTER TABLE exam_participants ADD COLUMN IF NOT EXISTS room_id INTEGER REFERENCES exam_rooms(id) ON DELETE SET NULL',

		// questions
		'ALTER TABLE questions ADD COLUMN IF NOT EXISTS audio_max_plays INTEGER DEFAULT 0',

		// student_attempts
		'ALTER TABLE student_attempts ADD COLUMN IF NOT EXISTS token_id INTEGER REFERENCES tokens(id) ON DELETE SET NULL',
		'ALTER TABLE student_attempts ADD COLUMN IF NOT EXISTS is_paused INTEGER DEFAULT 0',
		'ALTER TABLE student_attempts ADD COLUMN IF NOT EXISTS paused_at TEXT',
		'ALTER TABLE student_attempts ADD COLUMN IF NOT EXISTS total_paused_seconds INTEGER DEFAULT 0',
		'ALTER TABLE student_attempts ADD COLUMN IF NOT EXISTS violation_count INTEGER DEFAULT 0',
		'ALTER TABLE student_attempts ADD COLUMN IF NOT EXISTS violation_logs TEXT',
		'ALTER TABLE student_attempts ADD COLUMN IF NOT EXISTS signature TEXT',
		'ALTER TABLE student_attempts ADD COLUMN IF NOT EXISTS updated_at TEXT',

		// student_answers
		'ALTER TABLE student_answers ADD COLUMN IF NOT EXISTS is_doubted INTEGER DEFAULT 0',
		'ALTER TABLE student_answers ADD COLUMN IF NOT EXISTS answered_at TEXT',

		// exam_type_proctors
		`CREATE TABLE IF NOT EXISTS exam_type_proctors (
			id SERIAL PRIMARY KEY,
			exam_type_id INTEGER NOT NULL REFERENCES exam_types(id) ON DELETE CASCADE,
			proctor_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
			proctor_role TEXT NOT NULL DEFAULT 'p1',
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`
	];

	let count = 0;
	for (const stmt of statements) {
		try {
			if (sql.query) {
				await sql.query(stmt);
			} else {
				await sql(stmt);
			}
			count++;
		} catch (err) {
			console.warn(`Statement warning [${stmt}]:`, err.message);
		}
	}

	console.log(`✓ ${count}/${statements.length} table columns verified and synced successfully in Neon DB!`);

	// Verify master_exit_pin column specifically
	try {
		const verifyRes = await (sql.query ? sql.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'schools' AND column_name = 'master_exit_pin'") : sql("SELECT column_name FROM information_schema.columns WHERE table_name = 'schools' AND column_name = 'master_exit_pin'"));
		console.log('Verification check for schools.master_exit_pin:', verifyRes);
	} catch (vErr) {
		console.error('Verification error:', vErr);
	}
}

fixAllColumns();
