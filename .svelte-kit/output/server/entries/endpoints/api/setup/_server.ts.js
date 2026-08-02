import { json } from "@sveltejs/kit";
import { g as getDB } from "../../../../chunks/db.js";
import { h as hashPassword } from "../../../../chunks/auth.js";
const GET = async ({ platform }) => {
  try {
    const db = getDB(platform);
    const existingAdmin = await db.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").first();
    if (existingAdmin) {
      return json({
        success: false,
        message: "Database sudah diinisialisasi. Admin sudah ada."
      }, { status: 400 });
    }
    const adminHash = await hashPassword("admin123");
    const guruHash = await hashPassword("guru123");
    const pengawasHash = await hashPassword("pengawas123");
    const siswaHash = await hashPassword("siswa123");
    const siswa2Hash = await hashPassword("siswa123");
    await db.batch([
      db.prepare("INSERT INTO users (username, password_hash, name, role) VALUES (?, ?, ?, ?)").bind("admin", adminHash, "Administrator", "admin"),
      db.prepare("INSERT INTO users (username, password_hash, name, role) VALUES (?, ?, ?, ?)").bind("guru1", guruHash, "Bapak Ahmad", "guru"),
      db.prepare("INSERT INTO users (username, password_hash, name, role) VALUES (?, ?, ?, ?)").bind("guru2", guruHash, "Ibu Fatimah", "guru"),
      db.prepare("INSERT INTO users (username, password_hash, name, role) VALUES (?, ?, ?, ?)").bind("pengawas1", pengawasHash, "Bapak Umar", "pengawas"),
      db.prepare("INSERT INTO users (username, password_hash, name, role) VALUES (?, ?, ?, ?)").bind("siswa1", siswaHash, "Ahmad Rizki", "siswa"),
      db.prepare("INSERT INTO users (username, password_hash, name, role) VALUES (?, ?, ?, ?)").bind("siswa2", siswa2Hash, "Siti Aisyah", "siswa"),
      db.prepare("INSERT INTO users (username, password_hash, name, role) VALUES (?, ?, ?, ?)").bind("siswa3", siswa2Hash, "Muhammad Fajar", "siswa")
    ]);
    await db.batch([
      db.prepare(`INSERT INTO exams (title, description, subject, duration_minutes, start_time, end_time, is_active, created_by)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).bind(
        "Ujian Tengah Semester - Matematika",
        "UTS Matematika Kelas 9 Semester Ganjil",
        "Matematika",
        90,
        "2024-12-01T08:00:00Z",
        "2024-12-31T17:00:00Z",
        1,
        1
      ),
      db.prepare(`INSERT INTO exams (title, description, subject, duration_minutes, start_time, end_time, is_active, created_by)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).bind(
        "Ujian Akhir Semester - Bahasa Arab",
        "UAS Bahasa Arab Kelas 9 Semester Ganjil",
        "Bahasa Arab",
        60,
        "2024-12-15T08:00:00Z",
        "2024-12-31T17:00:00Z",
        1,
        1
      ),
      db.prepare(`INSERT INTO exams (title, description, subject, duration_minutes, start_time, end_time, is_active, created_by)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).bind(
        "Latihan Soal - IPA",
        "Latihan soal IPA untuk persiapan ujian",
        "IPA",
        45,
        "2024-11-01T08:00:00Z",
        "2025-12-31T17:00:00Z",
        0,
        1
      )
    ]);
    await db.batch([
      // Pilihan Ganda
      db.prepare(`INSERT INTO questions (exam_id, type, question_text, question_number, points, options_json, correct_answer_json)
				VALUES (?, ?, ?, ?, ?, ?, ?)`).bind(
        1,
        "pilihan_ganda",
        "Hasil dari 15 × 8 + 32 adalah...",
        1,
        2,
        JSON.stringify(["132", "142", "152", "162"]),
        '"C"'
      ),
      db.prepare(`INSERT INTO questions (exam_id, type, question_text, question_number, points, options_json, correct_answer_json)
				VALUES (?, ?, ?, ?, ?, ?, ?)`).bind(
        1,
        "pilihan_ganda",
        "Jika x + 5 = 12, maka nilai x adalah...",
        2,
        2,
        JSON.stringify(["5", "6", "7", "8"]),
        '"C"'
      ),
      db.prepare(`INSERT INTO questions (exam_id, type, question_text, question_number, points, options_json, correct_answer_json)
				VALUES (?, ?, ?, ?, ?, ?, ?)`).bind(
        1,
        "pilihan_ganda",
        "Luas segitiga dengan alas 10 cm dan tinggi 6 cm adalah...",
        3,
        2,
        JSON.stringify(["30 cm²", "60 cm²", "15 cm²", "45 cm²"]),
        '"A"'
      ),
      // Benar / Salah
      db.prepare(`INSERT INTO questions (exam_id, type, question_text, question_number, points, options_json, correct_answer_json)
				VALUES (?, ?, ?, ?, ?, ?, ?)`).bind(
        1,
        "benar_salah",
        "Bilangan prima adalah bilangan yang hanya bisa dibagi 1 dan dirinya sendiri.",
        4,
        1,
        JSON.stringify(["Benar", "Salah"]),
        '"Benar"'
      ),
      db.prepare(`INSERT INTO questions (exam_id, type, question_text, question_number, points, options_json, correct_answer_json)
				VALUES (?, ?, ?, ?, ?, ?, ?)`).bind(
        1,
        "benar_salah",
        "Hasil dari 7² adalah 48.",
        5,
        1,
        JSON.stringify(["Benar", "Salah"]),
        '"Salah"'
      ),
      // Isian Singkat
      db.prepare(`INSERT INTO questions (exam_id, type, question_text, question_number, points, options_json, correct_answer_json)
				VALUES (?, ?, ?, ?, ?, ?, ?)`).bind(1, "isian_singkat", "Berapakah hasil dari √144?", 6, 2, null, '"12"'),
      db.prepare(`INSERT INTO questions (exam_id, type, question_text, question_number, points, options_json, correct_answer_json)
				VALUES (?, ?, ?, ?, ?, ?, ?)`).bind(1, "isian_singkat", "Nilai π (pi) dibulatkan menjadi 2 angka desimal adalah...", 7, 2, null, '"3.14"'),
      // Menjodohkan
      db.prepare(`INSERT INTO questions (exam_id, type, question_text, question_number, points, options_json, correct_answer_json)
				VALUES (?, ?, ?, ?, ?, ?, ?)`).bind(
        1,
        "menjodohkan",
        "Jodohkan bangun datar berikut dengan rumus luasnya:",
        8,
        3,
        JSON.stringify({
          left: ["Persegi", "Segitiga", "Lingkaran"],
          right: ["s × s", "½ × a × t", "π × r²"]
        }),
        JSON.stringify({ "0": "0", "1": "1", "2": "2" })
      ),
      // Essay
      db.prepare(`INSERT INTO questions (exam_id, type, question_text, question_number, points, options_json, correct_answer_json)
				VALUES (?, ?, ?, ?, ?, ?, ?)`).bind(1, "essay", "Jelaskan perbedaan antara bilangan rasional dan bilangan irasional. Berikan masing-masing 2 contoh!", 9, 5, null, null),
      db.prepare(`INSERT INTO questions (exam_id, type, question_text, question_number, points, options_json, correct_answer_json)
				VALUES (?, ?, ?, ?, ?, ?, ?)`).bind(1, "essay", "Sebuah taman berbentuk persegi panjang dengan panjang 20 m dan lebar 15 m. Di dalam taman terdapat kolam berbentuk lingkaran dengan jari-jari 5 m. Hitunglah luas taman yang tidak tertutup kolam!", 10, 5, null, null)
    ]);
    await db.batch([
      db.prepare(`INSERT INTO questions (exam_id, type, question_text, question_number, points, options_json, correct_answer_json)
				VALUES (?, ?, ?, ?, ?, ?, ?)`).bind(
        2,
        "pilihan_ganda",
        'Apa bahasa Arab dari "buku"?',
        1,
        2,
        JSON.stringify(["قلم", "كتاب", "كرسي", "باب"]),
        '"B"'
      ),
      db.prepare(`INSERT INTO questions (exam_id, type, question_text, question_number, points, options_json, correct_answer_json)
				VALUES (?, ?, ?, ?, ?, ?, ?)`).bind(
        2,
        "pilihan_ganda",
        "Isim yang menunjukkan tempat disebut...",
        2,
        2,
        JSON.stringify(["Isim Fa'il", "Isim Maf'ul", "Isim Makan", "Isim Zaman"]),
        '"C"'
      ),
      db.prepare(`INSERT INTO questions (exam_id, type, question_text, question_number, points, options_json, correct_answer_json)
				VALUES (?, ?, ?, ?, ?, ?, ?)`).bind(
        2,
        "benar_salah",
        "Fi'il Madhi adalah kata kerja bentuk lampau.",
        3,
        1,
        JSON.stringify(["Benar", "Salah"]),
        '"Benar"'
      ),
      db.prepare(`INSERT INTO questions (exam_id, type, question_text, question_number, points, options_json, correct_answer_json)
				VALUES (?, ?, ?, ?, ?, ?, ?)`).bind(2, "isian_singkat", 'Tuliskan arti dari "مدرسة" dalam Bahasa Indonesia.', 4, 2, null, '"sekolah"'),
      db.prepare(`INSERT INTO questions (exam_id, type, question_text, question_number, points, options_json, correct_answer_json)
				VALUES (?, ?, ?, ?, ?, ?, ?)`).bind(2, "essay", "Buatlah 3 kalimat sederhana dalam Bahasa Arab menggunakan Mubtada dan Khobar!", 5, 5, null, null)
    ]);
    await db.prepare(`INSERT INTO tokens (exam_id, token_code, is_released, created_by, expires_at)
			VALUES (?, ?, ?, ?, ?)`).bind(1, "MTK2024", 1, 4, "2025-12-31T23:59:59Z").run();
    await db.prepare(`INSERT INTO tokens (exam_id, token_code, is_released, created_by, expires_at)
			VALUES (?, ?, ?, ?, ?)`).bind(2, "ARB2024", 0, 4, "2025-12-31T23:59:59Z").run();
    return json({
      success: true,
      message: "Database berhasil diinisialisasi!",
      credentials: {
        admin: { username: "admin", password: "admin123" },
        guru: { username: "guru1", password: "guru123" },
        pengawas: { username: "pengawas1", password: "pengawas123" },
        siswa: [
          { username: "siswa1", password: "siswa123" },
          { username: "siswa2", password: "siswa123" },
          { username: "siswa3", password: "siswa123" }
        ]
      }
    });
  } catch (e) {
    console.error("Setup error:", e);
    return json({
      success: false,
      message: `Gagal inisialisasi: ${e instanceof Error ? e.message : "Unknown error"}`
    }, { status: 500 });
  }
};
export {
  GET
};
