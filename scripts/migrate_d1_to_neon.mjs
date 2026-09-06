import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
	console.error('ERROR: DATABASE_URL tidak ditemukan di .env');
	process.exit(1);
}

console.log('Connecting to Neon Database...');
const sql = neon(databaseUrl);

async function executeQuery(queryText, params = []) {
	return await sql.query(queryText, params);
}

const tablesOrder = [
	'schools',
	'classes',
	'subjects',
	'users',
	'exam_types',
	'exam_type_classes',
	'exams',
	'exam_sessions',
	'exam_rooms',
	'questions',
	'tokens',
	'exam_participants',
	'exam_type_participants',
	'exam_teachers',
	'exam_proctors',
	'exam_type_proctors',
	'student_attempts',
	'student_answers',
	'uploaded_media'
];

async function migrate() {
	try {
		console.log('1. Membaca dan menerapkan schema.postgres.sql...');
		const schemaSql = fs.readFileSync(path.join(rootDir, 'schema.postgres.sql'), 'utf-8');

		const statements = [];
		let currentStmt = '';
		let inDollarQuote = false;

		for (const line of schemaSql.split('\n')) {
			const trimmed = line.trim();
			if (!trimmed || trimmed.startsWith('--')) continue;
			if (line.includes('$$')) {
				inDollarQuote = !inDollarQuote;
			}
			currentStmt += line + '\n';
			if (!inDollarQuote && trimmed.endsWith(';')) {
				statements.push(currentStmt.trim());
				currentStmt = '';
			}
		}
		if (currentStmt.trim()) {
			statements.push(currentStmt.trim());
		}

		console.log(`Memastikan struktur tabel di Neon (${statements.length} DDL statements)...`);
		for (const stmt of statements) {
			if (!stmt) continue;
			await executeQuery(stmt);
		}

		// Ensure columns added in migrations exist
		await executeQuery(`ALTER TABLE exam_participants ADD COLUMN IF NOT EXISTS session_number INTEGER DEFAULT 1;`);

		console.log('✓ Struktur tabel PostgreSQL siap.');

		console.log('\n2. Mengosongkan data lama di Neon dengan TRUNCATE CASCADE...');
		for (const t of [...tablesOrder].reverse()) {
			try {
				await executeQuery(`TRUNCATE TABLE "${t}" CASCADE;`);
			} catch (e) {
				// Table might not exist or already truncated
			}
		}
		console.log('✓ Semua tabel berhasil dikosongkan.');

		console.log('\n3. Membaca data dari d1_remote_latest.sql...');
		const d1Sql = fs.readFileSync(path.join(rootDir, 'd1_remote_latest.sql'), 'utf-8');

		const insertsByTable = {};
		for (const t of tablesOrder) {
			insertsByTable[t] = [];
		}

		const lines = d1Sql.split('\n');
		let currentInsert = '';
		let currentTable = null;

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			const trimmed = line.trim();

			if (!currentInsert) {
				const match = trimmed.match(/^INSERT INTO ["']?([a-zA-Z0-9_]+)["']?/i);
				if (match) {
					currentTable = match[1];
					currentInsert = line;
				}
			} else {
				currentInsert += '\n' + line;
			}

			if (currentInsert && trimmed.endsWith(';')) {
				if (currentTable && insertsByTable[currentTable]) {
					// Convert SQLite char(10) to PostgreSQL chr(10)
					let clean = currentInsert.trim().replace(/\bchar\((\d+)\)/gi, 'chr($1)');
					insertsByTable[currentTable].push(clean);
				}
				currentInsert = '';
				currentTable = null;
			}
		}

		console.log('\n4. Mengimpor data ke Neon Database per tabel (Topological Order):');
		for (const table of tablesOrder) {
			const inserts = insertsByTable[table] || [];
			if (inserts.length === 0) {
				console.log(`- ${table}: 0 data`);
				continue;
			}

			let success = 0;
			for (const ins of inserts) {
				try {
					await executeQuery(ins);
					success++;
				} catch (err) {
					console.warn(`[Gagal insert di ${table}]:`, err.message.substring(0, 100));
					console.warn('Query gagal:', ins.substring(0, 120));
				}
			}
			console.log(`- ${table}: ${success}/${inserts.length} data berhasil diimpor`);
		}

		console.log('\n5. Mereset auto-increment sequence (setval) untuk semua tabel...');
		for (const table of tablesOrder) {
			try {
				await executeQuery(`
					SELECT setval(
						pg_get_serial_sequence('${table}', 'id'),
						COALESCE((SELECT MAX(id) FROM "${table}"), 0) + 1,
						false
					);
				`);
			} catch (e) {
				// Table might not have serial id
			}
		}
		console.log('✓ Auto-increment sequence berhasil di-reset!');

		console.log('\n--- VERIFIKASI AKHIR DATA DI NEON DATABASE ---');
		let totalRows = 0;
		for (const table of tablesOrder) {
			try {
				const res = await executeQuery(`SELECT COUNT(*) as count FROM "${table}"`);
				const count = parseInt(res[0].count, 10);
				totalRows += count;
				console.log(`- ${table.padEnd(24)}: ${count} baris`);
			} catch (e) {
				console.log(`- ${table.padEnd(24)}: error (${e.message})`);
			}
		}
		console.log('----------------------------------------------');
		console.log(`Total data di Neon: ${totalRows} baris`);
		console.log('🎉 SEMUA DATA BERHASIL DIMIGRASIKAN DARI D1 KE NEON DATABASE!');

	} catch (error) {
		console.error('Migration failed:', error);
		process.exit(1);
	}
}

migrate();
