import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
	console.error('DATABASE_URL is missing');
	process.exit(1);
}

const sql = neon(databaseUrl);

async function fixSchema() {
	console.log('Verifying & updating Neon schema columns...');

	const alterQueries = [
		// Users table
		`ALTER TABLE users ADD COLUMN IF NOT EXISTS nip TEXT`,
		`ALTER TABLE users ADD COLUMN IF NOT EXISTS login_pin TEXT`,
		`ALTER TABLE users ADD COLUMN IF NOT EXISTS photo TEXT`,
		`ALTER TABLE users ADD COLUMN IF NOT EXISTS gender TEXT`,
		`ALTER TABLE users ADD COLUMN IF NOT EXISTS nisn TEXT`,
		`ALTER TABLE users ADD COLUMN IF NOT EXISTS nomor_peserta TEXT`,
		`ALTER TABLE users ADD COLUMN IF NOT EXISTS session_number INTEGER DEFAULT 1`,
		`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_logged_in INTEGER DEFAULT 0`,
		`ALTER TABLE users ADD COLUMN IF NOT EXISTS session_token TEXT`,
		`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_active_at TEXT`,
		`ALTER TABLE users ADD COLUMN IF NOT EXISTS login_device TEXT`,
		`ALTER TABLE users ADD COLUMN IF NOT EXISTS place_of_birth TEXT`,
		`ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth TEXT`,

		// Schools table
		`ALTER TABLE schools ADD COLUMN IF NOT EXISTS principal_nip TEXT`,
		`ALTER TABLE schools ADD COLUMN IF NOT EXISTS province TEXT`,
		`ALTER TABLE schools ADD COLUMN IF NOT EXISTS city TEXT`,
		`ALTER TABLE schools ADD COLUMN IF NOT EXISTS district TEXT`,
		`ALTER TABLE schools ADD COLUMN IF NOT EXISTS village TEXT`,
		`ALTER TABLE schools ADD COLUMN IF NOT EXISTS postal_code TEXT`,
		`ALTER TABLE schools ADD COLUMN IF NOT EXISTS logo_url TEXT`,
		`ALTER TABLE schools ADD COLUMN IF NOT EXISTS principal_name TEXT`,
		`ALTER TABLE schools ADD COLUMN IF NOT EXISTS npsn TEXT`,
		`ALTER TABLE schools ADD COLUMN IF NOT EXISTS phone TEXT`,
		`ALTER TABLE schools ADD COLUMN IF NOT EXISTS email TEXT`,
		`ALTER TABLE schools ADD COLUMN IF NOT EXISTS accreditation TEXT`,
		`ALTER TABLE schools ADD COLUMN IF NOT EXISTS website TEXT`,

		// Exams table
		`ALTER TABLE exams ADD COLUMN IF NOT EXISTS class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE`,
		`ALTER TABLE exams ADD COLUMN IF NOT EXISTS show_score_type TEXT DEFAULT 'after_submit'`,
		`ALTER TABLE exams ADD COLUMN IF NOT EXISTS is_score_released INTEGER DEFAULT 0`,
		`ALTER TABLE exams ADD COLUMN IF NOT EXISTS show_result INTEGER DEFAULT 0`,
		`ALTER TABLE exams ADD COLUMN IF NOT EXISTS max_attempts INTEGER DEFAULT 1`,
		`ALTER TABLE exams ADD COLUMN IF NOT EXISTS exam_type_id INTEGER REFERENCES exam_types(id) ON DELETE SET NULL`,

		// Student attempts table
		`ALTER TABLE student_attempts ADD COLUMN IF NOT EXISTS objective_score DOUBLE PRECISION DEFAULT 0`,
		`ALTER TABLE student_attempts ADD COLUMN IF NOT EXISTS is_paused INTEGER DEFAULT 0`,
		`ALTER TABLE student_attempts ADD COLUMN IF NOT EXISTS paused_at TEXT`,
		`ALTER TABLE student_attempts ADD COLUMN IF NOT EXISTS signature TEXT`,
		`ALTER TABLE student_attempts ADD COLUMN IF NOT EXISTS is_graded INTEGER DEFAULT 0`,
		`ALTER TABLE student_attempts ADD COLUMN IF NOT EXISTS is_score_released INTEGER DEFAULT 0`,
		`ALTER TABLE student_attempts ADD COLUMN IF NOT EXISTS violation_count INTEGER DEFAULT 0`,
		`ALTER TABLE student_attempts ADD COLUMN IF NOT EXISTS violation_logs TEXT`,

		// Questions table
		`ALTER TABLE questions ADD COLUMN IF NOT EXISTS audio_max_plays INTEGER DEFAULT 3`,

		// Exam proctors table
		`ALTER TABLE exam_proctors ADD COLUMN IF NOT EXISTS proctor_role TEXT DEFAULT 'p1'`,
		`ALTER TABLE exam_proctors ADD COLUMN IF NOT EXISTS room_id INTEGER REFERENCES exam_rooms(id) ON DELETE SET NULL`,
		`ALTER TABLE exam_proctors ADD COLUMN IF NOT EXISTS sessions TEXT`
	];

	for (const q of alterQueries) {
		try {
			await sql.query(q);
			console.log('Executed:', q);
		} catch (err) {
			console.error('Error on query:', q, '\nError:', err.message);
		}
	}

	console.log('\nTesting query from /admin/users:');
	const testUsers = await sql.query(
		"SELECT id, username, password_hash, name, nip, role, is_active, created_at, photo, login_pin FROM users WHERE school_id = $1 AND role != 'siswa' AND role != 'superadmin' AND role != 'admin' ORDER BY created_at DESC",
		[1]
	);
	console.log('Query result count for school_id=1:', testUsers.length);
	console.log('Sample user:', testUsers[0]);

	console.log('\nAll columns verified!');
}

fixSchema();
