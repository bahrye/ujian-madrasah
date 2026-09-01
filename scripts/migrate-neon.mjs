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
	if (sql.query) {
		return await sql.query(queryText, params);
	} else if (typeof sql === 'function') {
		return await sql.query(queryText, params);
	}
}

async function runMigration() {
	try {
		// 1. Jalankan Schema DDL
		console.log('Menerapkan schema PostgreSQL (schema.postgres.sql)...');
		const schemaSql = fs.readFileSync(path.join(rootDir, 'schema.postgres.sql'), 'utf-8');
		
		// Split statements by semicolon (ignoring functions body $$)
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

		for (const stmt of statements) {
			if (!stmt) continue;
			await executeQuery(stmt);
		}
		console.log('✓ Schema berhasil dibuat!');

		// 2. Cek apakah ada data di db_topo_clean.sql untuk diimpor
		const topoCleanPath = path.join(rootDir, 'db_topo_clean.sql');
		if (fs.existsSync(topoCleanPath)) {
			console.log('Memeriksa data di db_topo_clean.sql untuk diimpor...');
			const topoSql = fs.readFileSync(topoCleanPath, 'utf-8');
			const insertLines = topoSql
				.split('\n')
				.map(l => l.trim())
				.filter(l => l.startsWith('INSERT INTO') && !l.includes('"sqlite_sequence"'));

			console.log(`Ditemukan ${insertLines.length} baris data untuk diimpor.`);

			let successCount = 0;
			for (const insertLine of insertLines) {
				try {
					let cleanInsert = insertLine.replace(/;$/, '');
					cleanInsert += ' ON CONFLICT DO NOTHING;';
					await executeQuery(cleanInsert);
					successCount++;
				} catch (err) {
					console.warn('Peringatan saat insert:', err.message, '\nQuery:', insertLine.substring(0, 80));
				}
			}
			console.log(`✓ Berhasil mengimpor ${successCount}/${insertLines.length} data.`);
		}

		// 3. Reset Sequences untuk semua tabel serial
		console.log('Mereset auto-increment sequence di PostgreSQL...');
		const tables = [
			'schools', 'classes', 'subjects', 'users', 'exam_types',
			'exam_type_classes', 'exams', 'exam_sessions', 'exam_rooms',
			'tokens', 'questions', 'student_attempts', 'student_answers',
			'exam_participants', 'exam_type_participants', 'exam_teachers',
			'exam_proctors', 'exam_type_proctors', 'uploaded_media'
		];

		for (const table of tables) {
			try {
				await executeQuery(`
					SELECT setval(
						pg_get_serial_sequence('${table}', 'id'),
						COALESCE((SELECT MAX(id) FROM "${table}"), 0) + 1,
						false
					);
				`);
			} catch (e) {
				// Some tables might not have id sequence or empty
			}
		}
		console.log('✓ Sequence berhasil di-reset!');

		// 4. Verifikasi isi tabel
		console.log('\n--- Verifikasi Data di Neon Database ---');
		const schoolCount = await executeQuery('SELECT count(*) as count FROM schools');
		const userCount = await executeQuery('SELECT count(*) as count FROM users');
		const examCount = await executeQuery('SELECT count(*) as count FROM exams');
		const questionCount = await executeQuery('SELECT count(*) as count FROM questions');

		console.log(`Sekolah: ${schoolCount[0].count}`);
		console.log(`Pengguna: ${userCount[0].count}`);
		console.log(`Ujian: ${examCount[0].count}`);
		console.log(`Soal: ${questionCount[0].count}`);
		console.log('----------------------------------------');
		console.log('🎉 Migrasi ke Neon PostgreSQL SUKSES!');

	} catch (error) {
		console.error('Migration failed:', error);
		process.exit(1);
	}
}

runMigration();
