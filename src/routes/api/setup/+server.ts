import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDB } from '$lib/server/db';
import { hashPassword } from '$lib/server/auth';

export const GET: RequestHandler = async ({ platform }) => {
	try {
		const db = getDB(platform);

		// Cek apakah sudah ada superadmin
		const existingSuperadmin = await db.prepare("SELECT id FROM users WHERE role = 'superadmin' LIMIT 1").first();
		if (existingSuperadmin) {
			return json({
				success: false,
				message: 'Database sudah diinisialisasi. Superadmin sudah ada.'
			}, { status: 400 });
		}

		// Buat Sekolah Dummy
		await db.batch([
			db.prepare("INSERT INTO schools (name, address) VALUES (?, ?)").bind('Madrasah Aliyah Negeri 1', 'Jl. Pendidikan No. 1'),
			db.prepare("INSERT INTO schools (name, address) VALUES (?, ?)").bind('Madrasah Tsanawiyah Negeri 2', 'Jl. Kebangsaan No. 2'),
		]);

		// Buat Kelas dan Mata Pelajaran
		await db.batch([
			db.prepare("INSERT INTO classes (school_id, name, level) VALUES (?, ?, ?)").bind(1, 'X IPA 1', 'X'),
			db.prepare("INSERT INTO classes (school_id, name, level) VALUES (?, ?, ?)").bind(1, 'XI IPS 2', 'XI'),
			db.prepare("INSERT INTO classes (school_id, name, level) VALUES (?, ?, ?)").bind(2, 'VII A', 'VII'),
			db.prepare("INSERT INTO classes (school_id, name, level) VALUES (?, ?, ?)").bind(2, 'VIII B', 'VIII'),

			db.prepare("INSERT INTO subjects (school_id, name, code) VALUES (?, ?, ?)").bind(1, 'Matematika', 'MTK'),
			db.prepare("INSERT INTO subjects (school_id, name, code) VALUES (?, ?, ?)").bind(1, 'Biologi', 'BIO'),
			db.prepare("INSERT INTO subjects (school_id, name, code) VALUES (?, ?, ?)").bind(2, 'Bahasa Arab', 'ARB'),
			db.prepare("INSERT INTO subjects (school_id, name, code) VALUES (?, ?, ?)").bind(2, 'Fiqih', 'FIQ'),
		]);

		// Hash password untuk semua user default
		const passHash = await hashPassword('password123');

		// Buat user default
		await db.batch([
			// Superadmin (tanpa school_id)
			db.prepare("INSERT INTO users (school_id, class_id, username, password_hash, name, role) VALUES (NULL, NULL, ?, ?, ?, ?)").bind('superadmin', passHash, 'Sistem Superadmin', 'superadmin'),
			
			// Sekolah 1 (MAN 1)
			db.prepare("INSERT INTO users (school_id, class_id, username, password_hash, name, role) VALUES (?, NULL, ?, ?, ?, ?)").bind(1, 'admin1', passHash, 'Admin MAN 1', 'admin'),
			db.prepare("INSERT INTO users (school_id, class_id, username, password_hash, name, role) VALUES (?, NULL, ?, ?, ?, ?)").bind(1, 'guru1', passHash, 'Bapak Ahmad', 'guru'),
			db.prepare("INSERT INTO users (school_id, class_id, username, password_hash, name, role) VALUES (?, NULL, ?, ?, ?, ?)").bind(1, 'pengawas1', passHash, 'Bapak Umar', 'pengawas'),
			db.prepare("INSERT INTO users (school_id, class_id, username, password_hash, name, role) VALUES (?, ?, ?, ?, ?, ?)").bind(1, 1, 'siswa1', passHash, 'Ahmad Rizki', 'siswa'),
			
			// Sekolah 2 (MTsN 2)
			db.prepare("INSERT INTO users (school_id, class_id, username, password_hash, name, role) VALUES (?, NULL, ?, ?, ?, ?)").bind(2, 'admin2', passHash, 'Admin MTsN 2', 'admin'),
			db.prepare("INSERT INTO users (school_id, class_id, username, password_hash, name, role) VALUES (?, NULL, ?, ?, ?, ?)").bind(2, 'guru2', passHash, 'Ibu Fatimah', 'guru'),
			db.prepare("INSERT INTO users (school_id, class_id, username, password_hash, name, role) VALUES (?, NULL, ?, ?, ?, ?)").bind(2, 'pengawas2', passHash, 'Ibu Aisyah', 'pengawas'),
			db.prepare("INSERT INTO users (school_id, class_id, username, password_hash, name, role) VALUES (?, ?, ?, ?, ?, ?)").bind(2, 3, 'siswa2', passHash, 'Siti Aisyah', 'siswa'),
		]);

		// Buat contoh ujian
		await db.batch([
			// Ujian untuk Sekolah 1 (Matematika = subject_id 1)
			db.prepare(`INSERT INTO exams (school_id, subject_id, title, description, duration_minutes, start_time, end_time, is_active, created_by)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
				.bind(1, 1, 'Ujian Tengah Semester - Matematika', 'UTS Matematika Kelas 9 Semester Ganjil', 90,
					'2024-12-01T08:00:00Z', '2024-12-31T17:00:00Z', 1, 2), // created_by = 2 (admin1)
			
			// Ujian untuk Sekolah 2 (Bahasa Arab = subject_id 3)
			db.prepare(`INSERT INTO exams (school_id, subject_id, title, description, duration_minutes, start_time, end_time, is_active, created_by)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
				.bind(2, 3, 'Ujian Akhir Semester - Bahasa Arab', 'UAS Bahasa Arab Kelas 9 Semester Ganjil', 60,
					'2024-12-15T08:00:00Z', '2024-12-31T17:00:00Z', 1, 6), // created_by = 6 (admin2)
		]);

		// Buat contoh soal untuk Ujian Matematika (exam_id = 1, school = 1)
		await db.batch([
			// Pilihan Ganda
			db.prepare(`INSERT INTO questions (exam_id, type, question_text, question_number, points, options_json, correct_answer_json)
				VALUES (?, ?, ?, ?, ?, ?, ?)`)
				.bind(1, 'pilihan_ganda', 'Hasil dari 15 × 8 + 32 adalah...', 1, 2,
					JSON.stringify(['132', '142', '152', '162']),
					'"C"'),
			// Benar / Salah
			db.prepare(`INSERT INTO questions (exam_id, type, question_text, question_number, points, options_json, correct_answer_json)
				VALUES (?, ?, ?, ?, ?, ?, ?)`)
				.bind(1, 'benar_salah', 'Hasil dari 7² adalah 48.', 2, 1,
					JSON.stringify(['Benar', 'Salah']),
					'"Salah"'),
			// Isian Singkat
			db.prepare(`INSERT INTO questions (exam_id, type, question_text, question_number, points, options_json, correct_answer_json)
				VALUES (?, ?, ?, ?, ?, ?, ?)`)
				.bind(1, 'isian_singkat', 'Berapakah hasil dari √144?', 3, 2, null, '"12"'),
		]);

		// Buat contoh soal untuk Ujian Bahasa Arab (exam_id = 2, school = 2)
		await db.batch([
			db.prepare(`INSERT INTO questions (exam_id, type, question_text, question_number, points, options_json, correct_answer_json)
				VALUES (?, ?, ?, ?, ?, ?, ?)`)
				.bind(2, 'pilihan_ganda', 'Apa bahasa Arab dari "buku"?', 1, 2,
					JSON.stringify(['قلم', 'كتاب', 'كرسي', 'باب']),
					'"B"'),
		]);

		// Buat contoh token (pengawas_id untuk MAN 1 = 4, MTsN 2 = 8)
		await db.prepare(`INSERT INTO tokens (school_id, exam_id, token_code, is_released, created_by, expires_at)
			VALUES (?, ?, ?, ?, ?, ?)`)
			.bind(1, 1, 'MTK2024', 1, 4, '2025-12-31T23:59:59Z')
			.run();

		await db.prepare(`INSERT INTO tokens (school_id, exam_id, token_code, is_released, created_by, expires_at)
			VALUES (?, ?, ?, ?, ?, ?)`)
			.bind(2, 2, 'ARB2024', 0, 8, '2025-12-31T23:59:59Z')
			.run();

		return json({
			success: true,
			message: 'Database berhasil diinisialisasi!',
			credentials: {
				superadmin: { username: 'superadmin', password: 'password123' },
				sekolah_1: {
					admin: 'admin1', guru: 'guru1', pengawas: 'pengawas1', siswa: 'siswa1', password: 'password123'
				},
				sekolah_2: {
					admin: 'admin2', guru: 'guru2', pengawas: 'pengawas2', siswa: 'siswa2', password: 'password123'
				}
			}
		});
	} catch (e) {
		console.error('Setup error:', e);
		return json({
			success: false,
			message: `Gagal inisialisasi: ${e instanceof Error ? e.message : 'Unknown error'}`
		}, { status: 500 });
	}
};
