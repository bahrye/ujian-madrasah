export interface SimulationQuestion {
	id: number;
	type: 'pilihan_ganda' | 'pilihan_ganda_kompleks' | 'benar_salah' | 'menjodohkan' | 'isian_singkat' | 'essay';
	subject: string;
	jenjang: 'MI' | 'MTS' | 'MA';
	grade: number;
	question_text: string;
	question_number: number;
	media_type: string | null;
	media_url: string | null;
	audio_max_plays: number;
	options_json: string | null;
	correct_answer: string;
	points: number;
	explanation?: string;
}

// ==========================================
// 1. BANK SOAL SIMULASI MI (15 NOMOR)
// Meliputi: Bahasa Arab, Matematika, IPA, IPS, Bahasa Indonesia, Akidah Akhlak, SKI, Fikih, Al-Qur'an Hadis
// ==========================================
export const MI_QUESTIONS_UPPER: SimulationQuestion[] = [
	{
		id: 101,
		type: 'pilihan_ganda',
		subject: "Al-Qur'an Hadis",
		jenjang: 'MI',
		grade: 6,
		question_text: '<p>Perhatikan potongan ayat berikut: <strong>مِن شَرِّ مَا خَلَقَ</strong>. Hukum bacaan nun sukun (نْ) bertemu huruf syin (ش) adalah...</p>',
		question_number: 1,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Idzhar Halqi' },
			{ key: 'B', text: 'Ikhfa Haqiqi' },
			{ key: 'C', text: 'Idgham Bighunnah' },
			{ key: 'D', text: 'Iqlab' }
		]),
		correct_answer: 'B',
		points: 7,
		explanation: 'Nun sukun bertemu huruf syin (ش) dibaca samar dengan dengung (Ikhfa Haqiqi).'
	},
	{
		id: 102,
		type: 'pilihan_ganda',
		subject: 'Akidah Akhlak',
		jenjang: 'MI',
		grade: 6,
		question_text: '<p>Allah SWT memiliki Asmaul Husna <strong>Al-Ghaffar</strong>, yang memiliki arti Maha...</p>',
		question_number: 2,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Pengampun segala dosa hamba-Nya yang bertaubat' },
			{ key: 'B', text: 'Pemberi Rezeki tanpa batas' },
			{ key: 'C', text: 'Mendengar segala bisikan hati' },
			{ key: 'D', text: 'Merajai seluruh alam semesta' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'Al-Ghaffar bermakna Allah Maha Pengampun terhadap dosa hamba-Nya yang sungguh-sungguh bertaubat.'
	},
	{
		id: 103,
		type: 'pilihan_ganda',
		subject: 'Fikih',
		jenjang: 'MI',
		grade: 6,
		question_text: '<p>Zakat yang wajib dikeluarkan oleh setiap muslim pada bulan Ramadhan hingga sebelum pelaksanaan shalat Idul Fitri disebut zakat...</p>',
		question_number: 3,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Mal (Harta)' },
			{ key: 'B', text: 'Fitrah' },
			{ key: 'C', text: 'Perniagaan' },
			{ key: 'D', text: 'Pertanian' }
		]),
		correct_answer: 'B',
		points: 7,
		explanation: 'Zakat Fitrah bertujuan menyucikan diri bagi orang yang berpuasa dan ditunaikan di bulan Ramadhan menjelang Idul Fitri.'
	},
	{
		id: 104,
		type: 'pilihan_ganda',
		subject: 'SKI',
		jenjang: 'MI',
		grade: 6,
		question_text: '<p>Salah satu anggota Walisongo yang berdakwah di tanah Jawa dengan pendekatan seni wayang kulit dan tembang gending Ilir-Ilir adalah Sunan...</p>',
		question_number: 4,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Ampel' },
			{ key: 'B', text: 'Giri' },
			{ key: 'C', text: 'Kalijaga' },
			{ key: 'D', text: 'Gunung Jati' }
		]),
		correct_answer: 'C',
		points: 7,
		explanation: 'Sunan Kalijaga memanfaatkan media kesenian daerah seperti wayang kulit dan tembang gending untuk menyiarkan agama Islam.'
	},
	{
		id: 105,
		type: 'pilihan_ganda',
		subject: 'Bahasa Arab',
		jenjang: 'MI',
		grade: 6,
		question_text: '<p>Perhatikan kalimat berikut: <strong>أَنَا أَقْرَأُ الْكِتَابَ فِي الْمَكْتَبَةِ</strong>. Arti kata yang bergaris bawah (الْمَكْتَبَةِ) adalah...</p>',
		question_number: 5,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Kelas' },
			{ key: 'B', text: 'Perpustakaan' },
			{ key: 'C', text: 'Laboratorium' },
			{ key: 'D', text: 'Halaman sekolah' }
		]),
		correct_answer: 'B',
		points: 7,
		explanation: 'الْمَكْتَبَةِ berarti Perpustakaan.'
	},
	{
		id: 106,
		type: 'pilihan_ganda',
		subject: 'Bahasa Indonesia',
		jenjang: 'MI',
		grade: 6,
		question_text: '<p><em>"Hutan bakau memiliki peranan yang sangat penting bagi ekosistem pesisir. Akar bakau mampu menahan abrasi gelombang laut dan menjadi habitat tempat berkembang biak ikan-ikan kecil."</em><br/>Gagasan utama paragraf tersebut adalah...</p>',
		question_number: 6,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Gelombang laut sering menimbulkan abrasi di pantai' },
			{ key: 'B', text: 'Manfaat penting hutan bakau bagi ekosistem pesisir' },
			{ key: 'C', text: 'Ikan kecil hanya hidup di sekitar pohon bakau' },
			{ key: 'D', text: 'Kerusakan alam di kawasan pesisir pantai' }
		]),
		correct_answer: 'B',
		points: 7,
		explanation: 'Gagasan pokok terdapat di awal kalimat: pentingnya peranan hutan bakau bagi ekosistem pesisir.'
	},
	{
		id: 107,
		type: 'pilihan_ganda',
		subject: 'Matematika',
		jenjang: 'MI',
		grade: 6,
		question_text: '<p>Hasil dari perhitungan <strong>(2/3) + (1/4) - (1/6)</strong> adalah...</p>',
		question_number: 7,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: '3/4' },
			{ key: 'B', text: '5/6' },
			{ key: 'C', text: '7/12' },
			{ key: 'D', text: '9/12' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'KPK dari 3, 4, 6 adalah 12. Maka (8/12) + (3/12) - (2/12) = 9/12 = 3/4.'
	},
	{
		id: 108,
		type: 'pilihan_ganda',
		subject: 'IPA',
		jenjang: 'MI',
		grade: 6,
		question_text: '<p>Proses perpindahan serbuk sari dari kepala sari menuju kepala putik pada bunga disebut...</p>',
		question_number: 8,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Penyerbukan' },
			{ key: 'B', text: 'Pembuahan' },
			{ key: 'C', text: 'Fotosintesis' },
			{ key: 'D', text: 'Respirasi' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'Jatuhnya serbuk sari ke kepala putik dinamakan proses penyerbukan (polinasi).'
	},
	{
		id: 109,
		type: 'pilihan_ganda',
		subject: 'IPS',
		jenjang: 'MI',
		grade: 6,
		question_text: '<p>Indonesia merupakan negara maritim karena memiliki perairan yang sangat luas. Salah satu komoditas ekspor andalan perikanan Indonesia adalah...</p>',
		question_number: 9,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Udang dan Ikan Tuna' },
			{ key: 'B', text: 'Ikan Mas dan Nila' },
			{ key: 'C', text: 'Gandum dan Kedelai' },
			{ key: 'D', text: 'Kelapa Sawit dan Karet' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'Udang dan Ikan Tuna merupakan komoditas ekspor perikanan unggulan Indonesia.'
	},
	{
		id: 110,
		type: 'pilihan_ganda_kompleks',
		subject: "Al-Qur'an Hadis",
		jenjang: 'MI',
		grade: 6,
		question_text: '<p>Pilihlah <strong>dua (2)</strong> perilaku mulia yang mencerminkan pengamalan kandungan <strong>Surah Al-Ma\'un</strong> dalam kehidupan sehari-hari!</p>',
		question_number: 10,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Menyayangi, menyantuni, dan memuliakan anak yatim' },
			{ key: 'B', text: 'Melakukan ibadah shalat hanya agar dipuji orang lain (riya)' },
			{ key: 'C', text: 'Suka memberi bantuan dan pertolongan barang yang berguna kepada sesama' },
			{ key: 'D', text: 'Menghardik pengemis yang datang meminta bantuan di depan rumah' }
		]),
		correct_answer: '["A","C"]',
		points: 7,
		explanation: 'Surah Al-Ma\'un mencela orang yang menghardik anak yatim dan enggan menolong sesama.'
	},
	{
		id: 111,
		type: 'pilihan_ganda_kompleks',
		subject: 'IPA',
		jenjang: 'MI',
		grade: 6,
		question_text: '<p>Manakah dari pernyataan berikut yang merupakan contoh <strong>sumber energi terbarukan</strong> (ramah lingkungan)? <em>(Pilih 2 jawaban benar)</em></p>',
		question_number: 11,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Pembangkit Listrik Tenaga Surya (Matahari)' },
			{ key: 'B', text: 'Batu Bara' },
			{ key: 'C', text: 'Energi Kincir Angin' },
			{ key: 'D', text: 'Minyak Bumi' }
		]),
		correct_answer: '["A","C"]',
		points: 7,
		explanation: 'Matahari dan angin merupakan sumber energi terbarukan yang tidak akan habis.'
	},
	{
		id: 112,
		type: 'benar_salah',
		subject: 'Fikih',
		jenjang: 'MI',
		grade: 6,
		question_text: '<p>Tentukan status kebenaran (<strong>Benar</strong> atau <strong>Salah</strong>) pada setiap pernyataan terkait ibadah shalat dan bersuci berikut ini:</p>',
		question_number: 12,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ id: '1', statement: 'Membaca surah Al-Fatihah merupakan salah satu rukun shalat yang wajib dibaca pada setiap rakaat.' },
			{ id: '2', statement: 'Tayammum dapat dilakukan menggunakan debu yang suci meskipun air melimpah dan tidak ada halangan medis.' }
		]),
		correct_answer: '{"1":"benar","2":"salah"}',
		points: 7,
		explanation: 'Membaca Al-Fatihah adalah rukun shalat (Benar). Tayammum hanya boleh jika tidak menemukan air atau ada uzur sakit (Salah).'
	},
	{
		id: 113,
		type: 'menjodohkan',
		subject: 'Bahasa Arab',
		jenjang: 'MI',
		grade: 6,
		question_text: '<p>Jodohkan kosakata bahasa Arab berikut ini dengan arti bahasa Indonesia yang tepat!</p>',
		question_number: 13,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify({
			left: [
				{ key: '1', text: 'كِتَابٌ (Kitabun)' },
				{ key: '2', text: 'قَلَمٌ (Qalamun)' },
				{ key: '3', text: 'سَبُّوْرَةٌ (Sabburatun)' }
			],
			right: [
				{ key: 'A', text: 'Buku' },
				{ key: 'B', text: 'Pena / Pulpen' },
				{ key: 'C', text: 'Papan Tulis' }
			]
		}),
		correct_answer: '{"1":"A","2":"B","3":"C"}',
		points: 7,
		explanation: 'Kitabun = Buku, Qalamun = Pena, Sabburatun = Papan Tulis.'
	},
	{
		id: 114,
		type: 'isian_singkat',
		subject: 'Matematika',
		jenjang: 'MI',
		grade: 6,
		question_text: '<p>Sebuah kebun madrasah berbentuk persegi panjang dengan panjang 12 meter dan lebar 8 meter. Luas kebun madrasah tersebut adalah ... meter persegi. <em>(Tuliskan angka jawabannya saja)</em></p>',
		question_number: 14,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: null,
		correct_answer: '96',
		points: 7,
		explanation: 'Luas persegi panjang = panjang × lebar = 12 × 8 = 96 m².'
	},
	{
		id: 115,
		type: 'essay',
		subject: 'Akidah Akhlak',
		jenjang: 'MI',
		grade: 6,
		question_text: '<p>Sebutkan <strong>tiga (3) adab seorang muslim terhadap orang tua (Birrul Walidain)</strong> dan guru di madrasah yang dapat kamu terapkan dalam kehidupan sehari-hari!</p>',
		question_number: 15,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: null,
		correct_answer: 'Berbicara sopan dan santun, mendengarkan nasehatnya, mendoakan kebaikan bagi mereka, serta tidak membantah dengan suara keras.',
		points: 7,
		explanation: 'Jawaban mencakup ucapan sopan santun, kepatuhan dalam kebaikan, dan mendoakan orang tua serta guru.'
	}
];

// ==========================================
// 2. BANK SOAL SIMULASI MTS KELAS 7 (25 NOMOR)
// Khusus siswa MTs Kelas 7 (materi Kurikulum Kelas 7)
// ==========================================
export const MTS_QUESTIONS_GRADE_7: SimulationQuestion[] = [
	{
		id: 201,
		type: 'pilihan_ganda',
		subject: "Al-Qur'an Hadis",
		jenjang: 'MTS',
		grade: 7,
		question_text: '<p>Perhatikan potongan ayat berikut: <strong>وَالشَّمْسِ وَضُحَاهَا</strong>. Hukum bacaan Alif Lam (Al-) pada kata <strong>وَالشَّمْسِ</strong> adalah...</p>',
		question_number: 1,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Alif Lam Qamariyah' },
			{ key: 'B', text: 'Alif Lam Syamsiyah' },
			{ key: 'C', text: 'Idgham Mimi' },
			{ key: 'D', text: 'Ikhfa Syafawi' }
		]),
		correct_answer: 'B',
		points: 4,
		explanation: 'Huruf Al bertemu syin (huruf syamsiyah) dibaca lebur ke huruf syin, dinamakan Alif Lam Syamsiyah.'
	},
	{
		id: 202,
		type: 'pilihan_ganda',
		subject: 'Akidah Akhlak',
		jenjang: 'MTS',
		grade: 7,
		question_text: '<p>Allah SWT mustahil memiliki sifat <strong>Al-\'Ajzu</strong>, karena Allah memiliki sifat wajib yaitu...</p>',
		question_number: 2,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Qudrat (Maha Kuasa)' },
			{ key: 'B', text: 'Iradat (Maha Berkehendak)' },
			{ key: 'C', text: 'Ilmu (Maha Mengetahui)' },
			{ key: 'D', text: 'Hayat (Maha Hidup)' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Lawan dari sifat \'Ajzu (lemah) adalah Qudrat (Maha Kuasa).'
	},
	{
		id: 203,
		type: 'pilihan_ganda',
		subject: 'Fikih',
		jenjang: 'MTS',
		grade: 7,
		question_text: '<p>Najis yang berasal dari air kencing bayi laki-laki berusia di bawah dua tahun dan hanya mengonsumsi ASI dinamakan najis...</p>',
		question_number: 3,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Mukhaffafah (Ringan)' },
			{ key: 'B', text: 'Mutawassithah (Sedang)' },
			{ key: 'C', text: 'Mughalladhah (Berat)' },
			{ key: 'D', text: 'Ma\'fu (Dimaafkan)' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Air kencing bayi laki-laki yang belum makan selain ASI tergolong Najis Mukhaffafah dan cukup diperciki air.'
	},
	{
		id: 204,
		type: 'pilihan_ganda',
		subject: 'SKI',
		jenjang: 'MTS',
		grade: 7,
		question_text: '<p>Kondisi masyarakat Arab jahiliyah sebelum datangnya Islam sangat gemar menyembah berhala. Di antara berhala terbesar yang ditempatkan di sekitar Ka\'bah bernama...</p>',
		question_number: 4,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Hubal, Latta, Uzza, dan Manat' },
			{ key: 'B', text: 'Namrud dan Jalut' },
			{ key: 'C', text: 'Samiri dan Fir\'aun' },
			{ key: 'D', text: 'Qarun dan Haman' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Empat berhala sesembahan utama kaum jahiliyah Makkah adalah Hubal, Latta, Uzza, dan Manat.'
	},
	{
		id: 205,
		type: 'pilihan_ganda',
		subject: 'Bahasa Arab',
		jenjang: 'MTS',
		grade: 7,
		question_text: '<p>Lengkapilah kalimat perkenalan berikut: <strong>مَا اسْمُكَ؟ ... اِسْمِيْ فَرِحَان</strong></p>',
		question_number: 5,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'أَنَا' },
			{ key: 'B', text: 'أَنْتَ' },
			{ key: 'C', text: 'هُوَ' },
			{ key: 'D', text: 'هِيَ' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Jawaban atas pertanyaan "Siapa namamu?" adalah "Saya (أَنَا)... namaku Farhan".'
	},
	{
		id: 206,
		type: 'pilihan_ganda',
		subject: 'Bahasa Indonesia',
		jenjang: 'MTS',
		grade: 7,
		question_text: '<p>Ciri utama dari <strong>Teks Deskripsi</strong> adalah...</p>',
		question_number: 6,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Menggambarkan objek secara terperinci sehingga pembaca seolah-olah melihat dan merasakan sendiri' },
			{ key: 'B', text: 'Menjelaskan tahapan melakukan sesuatu dengan instruksi sistematis' },
			{ key: 'C', text: 'Memuat opini penulis disertai ajakan membujuk khalayak ramai' },
			{ key: 'D', text: 'Menyajikan alur cerita fiksi dengan konflik antar tokoh khayalan' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Teks deskripsi memerinci objek secara visual/sensorik agar pembaca merasakan langsung.'
	},
	{
		id: 207,
		type: 'pilihan_ganda',
		subject: 'Matematika',
		jenjang: 'MTS',
		grade: 7,
		question_text: '<p>Hasil dari <strong>-15 + 8 × (-3) - (-10)</strong> adalah...</p>',
		question_number: 7,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: '-29' },
			{ key: 'B', text: '-19' },
			{ key: 'C', text: '19' },
			{ key: 'D', text: '29' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Perkalian didahulukan: 8 × (-3) = -24. Lalu -15 + (-24) - (-10) = -39 + 10 = -29.'
	},
	{
		id: 208,
		type: 'pilihan_ganda',
		subject: 'IPA',
		jenjang: 'MTS',
		grade: 7,
		question_text: '<p>Satuan Standar Internasional (SI) untuk besaran <strong>Suhu</strong> adalah...</p>',
		question_number: 8,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Celcius' },
			{ key: 'B', text: 'Kelvin' },
			{ key: 'C', text: 'Fahrenheit' },
			{ key: 'D', text: 'Reamur' }
		]),
		correct_answer: 'B',
		points: 4,
		explanation: 'Satuan SI baku untuk suhu mutlak adalah Kelvin (K).'
	},
	{
		id: 209,
		type: 'pilihan_ganda',
		subject: 'IPS',
		jenjang: 'MTS',
		grade: 7,
		question_text: '<p>Secara astronomis, wilayah Indonesia terletak antara...</p>',
		question_number: 9,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: '6° LU - 11° LS dan 95° BT - 141° BT' },
			{ key: 'B', text: '11° LU - 6° LS dan 95° BT - 141° BT' },
			{ key: 'C', text: '6° LU - 11° LS dan 95° BB - 141° BB' },
			{ key: 'D', text: '10° LU - 10° LS dan 100° BT - 130° BT' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Letak astronomis Indonesia adalah 6° LU - 11° LS dan 95° BT - 141° BT.'
	},
	{
		id: 210,
		type: 'pilihan_ganda',
		subject: 'Fikih',
		jenjang: 'MTS',
		grade: 7,
		question_text: '<p>Seseorang yang sedang bepergian jauh (musafir) diperbolehkan menggabungkan shalat Dzuhur dengan Ashar pada waktu Dzuhur. Shalat ini disebut jamak...</p>',
		question_number: 10,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Taqdim' },
			{ key: 'B', text: 'Ta\'khir' },
			{ key: 'C', text: 'Qashar' },
			{ key: 'D', text: 'Munfarid' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Menggabungkan dua shalat di waktu shalat yang pertama disebut Jamak Taqdim.'
	},
	{
		id: 211,
		type: 'pilihan_ganda',
		subject: "Al-Qur'an Hadis",
		jenjang: 'MTS',
		grade: 7,
		question_text: '<p>Menurut hadis riwayat Ibnu Majah, hukum menuntut ilmu bagi setiap muslim laki-laki dan perempuan adalah...</p>',
		question_number: 11,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Wajib (Faridhah)' },
			{ key: 'B', text: 'Sunnah Muakkad' },
			{ key: 'C', text: 'Mubah' },
			{ key: 'D', text: 'Fardhu Kifayah semata' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'طَلَبُ الْعِلْمِ فَرِيْضَةٌ عَلَى كُلِّ مُسْلِمٍ (Menuntut ilmu itu wajib bagi setiap muslim).'
	},
	{
		id: 212,
		type: 'pilihan_ganda',
		subject: 'Matematika',
		jenjang: 'MTS',
		grade: 7,
		question_text: '<p>Penyelesaian dari persamaan linear satu variabel <strong>3x - 5 = 16</strong> adalah nilai x = ...</p>',
		question_number: 12,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: '7' },
			{ key: 'B', text: '8' },
			{ key: 'C', text: '9' },
			{ key: 'D', text: '11' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: '3x = 16 + 5 = 21, sehingga x = 21 / 3 = 7.'
	},
	{
		id: 213,
		type: 'pilihan_ganda',
		subject: 'IPA',
		jenjang: 'MTS',
		grade: 7,
		question_text: '<p>Organel sel yang berfungsi sebagai tempat berlangsungnya proses respirasi sel penghasil energi adalah...</p>',
		question_number: 13,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Mitokondria' },
			{ key: 'B', text: 'Ribosom' },
			{ key: 'C', text: 'Kloroplas' },
			{ key: 'D', text: 'Badan Golgi' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Mitokondria dikenal sebagai powerhouse of cell yang menghasilkan energi ATP melalui respirasi sel.'
	},
	{
		id: 214,
		type: 'pilihan_ganda',
		subject: 'Akidah Akhlak',
		jenjang: 'MTS',
		grade: 7,
		question_text: '<p>Sikap menerima segala ketentuan dan takdir Allah dengan lapang dada setelah berusaha secara maksimal disebut sikap...</p>',
		question_number: 14,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Tawakal dan Ridha' },
			{ key: 'B', text: 'Takabur' },
			{ key: 'C', text: 'Riya' },
			{ key: 'D', text: 'Hasad' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Tawakal dan ridha adalah berserah diri serta ikhlas atas ketetapan Allah setelah ikhtiar optimal.'
	},
	{
		id: 215,
		type: 'pilihan_ganda',
		subject: 'Bahasa Arab',
		jenjang: 'MTS',
		grade: 7,
		question_text: '<p>Susunan kalimat yang benar untuk mengungkapkan <em>"Ini kelasku, kelasnya bersih"</em> dalam bahasa Arab adalah...</p>',
		question_number: 15,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'هَذَا فَصْلِيْ، الْفَصْلُ نَظِيْفٌ' },
			{ key: 'B', text: 'هَذِهِ مَدْرَسَتِيْ، الْمَدْرَسَةُ كَبِيْرَةٌ' },
			{ key: 'C', text: 'تِلْكَ غُرْفَتِيْ، الْغُرْفَةُ وَاسِعَةٌ' },
			{ key: 'D', text: 'ذَلِكَ كِتَابِيْ، الْكِتَابُ جَدِيْدٌ' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'فَصْلِيْ (kelasku), نَظِيْفٌ (bersih).'
	},
	{
		id: 216,
		type: 'pilihan_ganda_kompleks',
		subject: 'Bahasa Indonesia',
		jenjang: 'MTS',
		grade: 7,
		question_text: '<p>Cermati ciri-ciri pantun berikut! Manakah yang merupakan <strong>ciri-ciri pantun yang benar</strong>? <em>(Pilih 2 jawaban)</em></p>',
		question_number: 16,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Satu bait terdiri dari 4 baris' },
			{ key: 'B', text: 'Baris pertama dan kedua merupakan isi' },
			{ key: 'C', text: 'Memiliki rima akhir bersajak a-b-a-b' },
			{ key: 'D', text: 'Setiap baris terdiri dari minimal 20 suku kata' }
		]),
		correct_answer: '["A","C"]',
		points: 4,
		explanation: 'Pantun terdiri dari 4 baris per bait, bersajak a-b-a-b, baris 1-2 sampiran, baris 3-4 isi.'
	},
	{
		id: 217,
		type: 'pilihan_ganda_kompleks',
		subject: 'IPA',
		jenjang: 'MTS',
		grade: 7,
		question_text: '<p>Di antara zat-zat berikut, manakah yang tergolong ke dalam <strong>Unsur Kimia</strong>? <em>(Pilih 2 jawaban)</em></p>',
		question_number: 17,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Oksigen (O)' },
			{ key: 'B', text: 'Air (H2O)' },
			{ key: 'C', text: 'Emas (Au)' },
			{ key: 'D', text: 'Garam Dapur (NaCl)' }
		]),
		correct_answer: '["A","C"]',
		points: 4,
		explanation: 'Oksigen dan Emas adalah unsur, sedangkan Air dan Garam adalah senyawa kimia.'
	},
	{
		id: 218,
		type: 'pilihan_ganda_kompleks',
		subject: 'SKI',
		jenjang: 'MTS',
		grade: 7,
		question_text: '<p>Siapakah di antara sahabat Rasulullah berikut yang termasuk dalam <strong>As-Sabiqunal Awwalun</strong> (orang-orang pertama masuk Islam)? <em>(Pilih 2 jawaban)</em></p>',
		question_number: 18,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Abu Bakar Ash-Shiddiq RA' },
			{ key: 'B', text: 'Khadijah binti Khuwailid RA' },
			{ key: 'C', text: 'Abu Sufyan bin Harb' },
			{ key: 'D', text: 'Khalid bin Walid' }
		]),
		correct_answer: '["A","B"]',
		points: 4,
		explanation: 'Khadijah RA dan Abu Bakar RA adalah orang-orang pertama yang menyambut dakwah Rasulullah SAW.'
	},
	{
		id: 219,
		type: 'benar_salah',
		subject: 'Fikih',
		jenjang: 'MTS',
		grade: 7,
		question_text: '<p>Tentukan status kebenaran (<strong>Benar</strong> atau <strong>Salah</strong>) mengenai ketentuan shalat Jumat berikut:</p>',
		question_number: 19,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ id: '1', statement: 'Shalat Jumat dilaksanakan dua rakaat secara berjamaah didahului dengan dua khutbah.' },
			{ id: '2', statement: 'Mendengarkan dua khutbah Jumat hukumnya makruh bagi jamaah yang hadir di masjid.' }
		]),
		correct_answer: '{"1":"benar","2":"salah"}',
		points: 4,
		explanation: 'Shalat Jumat dua rakaat setelah khutbah (Benar). Mendengarkan khutbah Jumat adalah wajib/sunnah muakkad, bukan makruh (Salah).'
	},
	{
		id: 220,
		type: 'benar_salah',
		subject: 'Matematika',
		jenjang: 'MTS',
		grade: 7,
		question_text: '<p>Tentukan apakah pernyataan matematika tentang bentuk aljabar berikut <strong>Benar</strong> atau <strong>Salah</strong>:</p>',
		question_number: 20,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ id: '1', statement: 'Pada bentuk aljabar 4x² - 3x + 7, koefisien dari variabel x adalah -3.' },
			{ id: '2', statement: 'Suku sejenis adalah suku yang memiliki variabel dan pangkat variabel yang berbeda.' }
		]),
		correct_answer: '{"1":"benar","2":"salah"}',
		points: 4,
		explanation: 'Koefisien dari x adalah -3 (Benar). Suku sejenis wajib memiliki variabel dan pangkat yang sama persis (Salah).'
	},
	{
		id: 221,
		type: 'menjodohkan',
		subject: 'IPS',
		jenjang: 'MTS',
		grade: 7,
		question_text: '<p>Jodohkan jenis interaksi antarruang berikut dengan contoh penerapannya dalam kehidupan sosial ekonomi:</p>',
		question_number: 21,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify({
			left: [
				{ key: '1', text: 'Saling melengkapi (Regional Complementarity)' },
				{ key: '2', text: 'Kesempatan antara (Intervening Opportunity)' },
				{ key: '3', text: 'Kemudahan transfer (Transferability)' }
			],
			right: [
				{ key: 'A', text: 'Wilayah pesisir penghasil ikan bertransaksi dengan wilayah pegunungan penghasil sayuran' },
				{ key: 'B', text: 'Pembeli beralih ke pasar yang lebih dekat karena ongkos perjalanan lebih hemat' },
				{ key: 'C', text: 'Ketersediaan sarana jalan dan jembatan yang memperlancar distribusi barang' }
			]
		}),
		correct_answer: '{"1":"A","2":"B","3":"C"}',
		points: 4,
		explanation: 'Konsep dasar interaksi keruangan dalam IPS Kelas 7.'
	},
	{
		id: 222,
		type: 'menjodohkan',
		subject: "Al-Qur'an Hadis",
		jenjang: 'MTS',
		grade: 7,
		question_text: '<p>Jodohkan nama surah pendek berikut dengan arti/maknanya:</p>',
		question_number: 22,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify({
			left: [
				{ key: '1', text: 'Asy-Syams' },
				{ key: '2', text: 'Al-Lail' },
				{ key: '3', text: 'Adh-Dhuha' }
			],
			right: [
				{ key: 'A', text: 'Matahari' },
				{ key: 'B', text: 'Malam' },
				{ key: 'C', text: 'Waktu Dhuha (Pagi Hari)' }
			]
		}),
		correct_answer: '{"1":"A","2":"B","3":"C"}',
		points: 4,
		explanation: 'Asy-Syams = Matahari, Al-Lail = Malam, Adh-Dhuha = Waktu Dhuha.'
	},
	{
		id: 223,
		type: 'isian_singkat',
		subject: 'Bahasa Indonesia',
		jenjang: 'MTS',
		grade: 7,
		question_text: '<p>Kalimat yang memberikan instruksi, panduan, atau perintah kepada orang lain untuk melakukan suatu pekerjaan dalam teks prosedur dinamakan kalimat...</p>',
		question_number: 23,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: null,
		correct_answer: 'imperatif',
		points: 4,
		explanation: 'Kalimat perintah atau instruksi disebut kalimat imperatif.'
	},
	{
		id: 224,
		type: 'isian_singkat',
		subject: 'Matematika',
		jenjang: 'MTS',
		grade: 7,
		question_text: '<p>Sebuah segitiga memiliki alas 10 cm dan tinggi 14 cm. Luas segitiga tersebut adalah ... cm². <em>(Tuliskan angka jawabannya saja)</em></p>',
		question_number: 24,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: null,
		correct_answer: '70',
		points: 4,
		explanation: 'Luas segitiga = 1/2 × alas × tinggi = 1/2 × 10 × 14 = 70 cm².'
	},
	{
		id: 225,
		type: 'essay',
		subject: 'Akidah Akhlak',
		jenjang: 'MTS',
		grade: 7,
		question_text: '<p>Jelaskan pengertian <strong>Ikhlas</strong> menurut ajaran Islam, serta sebutkan minimal dua (2) tanda atau ciri seseorang yang beramal secara ikhlas!</p>',
		question_number: 25,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: null,
		correct_answer: 'Ikhlas adalah memurnikan niat beribadah hanya semata-mata mengharap ridha Allah SWT tanpa pamrih. Cirinya: tidak terpengaruh pujian atau celaan orang, serta konsisten beramal baik saat sendiri maupun di depan orang banyak.',
		points: 4,
		explanation: 'Jawaban mencakup definisi pemurnian niat karena Allah, tidak riya, dan keteguhan beramal.'
	}
];

// ==========================================
// 3. BANK SOAL SIMULASI MTS KELAS 8 (25 NOMOR)
// Khusus siswa MTs Kelas 8 (materi Kurikulum Kelas 8)
// ==========================================
export const MTS_QUESTIONS_GRADE_8: SimulationQuestion[] = [
	{
		id: 301,
		type: 'pilihan_ganda',
		subject: "Al-Qur'an Hadis",
		jenjang: 'MTS',
		grade: 8,
		question_text: '<p>Hukum bacaan Mad yang terjadi apabila huruf Mad Thabi\'i bertemu dengan huruf hamzah dalam <strong>satu kata (kalimat)</strong> bersambung disebut Mad...</p>',
		question_number: 1,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Wajib Muttashil' },
			{ key: 'B', text: 'Jaiz Munfashil' },
			{ key: 'C', text: '\'Aridh Lissukun' },
			{ key: 'D', text: 'Badal' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Mad Wajib Muttashil terjadi bila Mad Thabi\'i bertemu hamzah dalam satu kata (panjang 4-5 harakat).'
	},
	{
		id: 302,
		type: 'pilihan_ganda',
		subject: 'Akidah Akhlak',
		jenjang: 'MTS',
		grade: 8,
		question_text: '<p>Kitab suci yang diturunkan oleh Allah SWT kepada Nabi Daud AS dengan menggunakan bahasa Qibthi/Suryani adalah kitab...</p>',
		question_number: 2,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Zabur' },
			{ key: 'B', text: 'Taurat' },
			{ key: 'C', text: 'Injil' },
			{ key: 'D', text: 'Al-Qur\'an' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Kitab Zabur diturunkan kepada Nabi Daud AS.'
	},
	{
		id: 303,
		type: 'pilihan_ganda',
		subject: 'Fikih',
		jenjang: 'MTS',
		grade: 8,
		question_text: '<p>Sujud yang dilakukan karena seseorang lupa kelebihan atau kekurangan rakaat atau ragu dalam jumlah rakaat shalat disebut sujud...</p>',
		question_number: 3,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Sahwi' },
			{ key: 'B', text: 'Syukur' },
			{ key: 'C', text: 'Tilawah' },
			{ key: 'D', text: 'Sajadah' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Sujud Sahwi dikerjakan sebelum atau sesudah salam karena kelupaan/keraguan dalam shalat.'
	},
	{
		id: 304,
		type: 'pilihan_ganda',
		subject: 'SKI',
		jenjang: 'MTS',
		grade: 8,
		question_text: '<p>Lembaga perpustakaan dan pusat penerjemahan ilmu pengetahuan yang didirikan oleh Khalifah Harun Ar-Rasyid pada masa Daulah Abbasiyah bernama...</p>',
		question_number: 4,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Baitul Hikmah' },
			{ key: 'B', text: 'Nidhamiyah' },
			{ key: 'C', text: 'Al-Azhar' },
			{ key: 'D', text: 'Darul Arqam' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Baitul Hikmah di Baghdad merupakan pusat keilmuan peradaban emas Islam masa Abbasiyah.'
	},
	{
		id: 305,
		type: 'pilihan_ganda',
		subject: 'Bahasa Arab',
		jenjang: 'MTS',
		grade: 8,
		question_text: '<p>Perhatikan kalimat berikut: <strong>كَمِ السَّاعَةُ الآنَ؟ ... السَّاعَةُ الآنَ السَّابِعَةُ صَبَاحًا</strong>. Jam berapa yang dimaksud?</p>',
		question_number: 5,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Pukul 07.00 pagi' },
			{ key: 'B', text: 'Pukul 06.00 pagi' },
			{ key: 'C', text: 'Pukul 08.00 pagi' },
			{ key: 'D', text: 'Pukul 07.00 malam' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'السَّابِعَةُ صَبَاحًا berarti pukul tujuh pagi.'
	},
	{
		id: 306,
		type: 'pilihan_ganda',
		subject: 'Bahasa Indonesia',
		jenjang: 'MTS',
		grade: 8,
		question_text: '<p>Unsur pokok dalam penyusunan teks berita yang lengkap dikenal dengan akronim ADIKSIMBA (5W+1H). Unsur yang menjelaskan alasan peristiwa terjadi adalah...</p>',
		question_number: 6,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Mengapa (Why)' },
			{ key: 'B', text: 'Kapan (When)' },
			{ key: 'C', text: 'Siapa (Who)' },
			{ key: 'D', text: 'Di mana (Where)' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Unsur "Mengapa" (Why) menjelaskan latar belakang atau penyebab terjadinya berita.'
	},
	{
		id: 307,
		type: 'pilihan_ganda',
		subject: 'Matematika',
		jenjang: 'MTS',
		grade: 8,
		question_text: '<p>Diketahui barisan bilangan 3, 7, 11, 15, 19, ... Suku ke-20 (U20) dari barisan aritmetika tersebut adalah...</p>',
		question_number: 7,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: '79' },
			{ key: 'B', text: '81' },
			{ key: 'C', text: '83' },
			{ key: 'D', text: '87' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'a = 3, b = 4. U20 = a + (20-1)b = 3 + 19(4) = 3 + 76 = 79.'
	},
	{
		id: 308,
		type: 'pilihan_ganda',
		subject: 'IPA',
		jenjang: 'MTS',
		grade: 8,
		question_text: '<p>Enzim pada lambung manusia yang berfungsi mengubah protein menjadi pepton adalah enzim...</p>',
		question_number: 8,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Pepsin' },
			{ key: 'B', text: 'Ptialin' },
			{ key: 'C', text: 'Amilase' },
			{ key: 'D', text: 'Tripsin' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Di lambung, enzim pepsin bekerja mencerna protein menjadi bentuk pepton.'
	},
	{
		id: 309,
		type: 'pilihan_ganda',
		subject: 'IPS',
		jenjang: 'MTS',
		grade: 8,
		question_text: '<p>Perpindahan posisi seseorang atau kelompok orang dari lapisan sosial yang satu ke lapisan sosial yang lain dinamakan...</p>',
		question_number: 9,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Mobilitas Sosial' },
			{ key: 'B', text: 'Interaksi Sosial' },
			{ key: 'C', text: 'Integrasi Sosial' },
			{ key: 'D', text: 'Diferensiasi Sosial' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Mobilitas sosial adalah gerak perubahan status sosial seseorang dalam hierarki masyarakat.'
	},
	{
		id: 310,
		type: 'pilihan_ganda',
		subject: 'Matematika',
		jenjang: 'MTS',
		grade: 8,
		question_text: '<p>Sebuah segitiga siku-siku memiliki panjang sisi siku-siku 6 cm dan 8 cm. Panjang sisi miring (hipotenusa) segitiga tersebut adalah...</p>',
		question_number: 10,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: '10 cm' },
			{ key: 'B', text: '12 cm' },
			{ key: 'C', text: '14 cm' },
			{ key: 'D', text: '15 cm' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Teorema Pythagoras: c² = 6² + 8² = 36 + 64 = 100 -> c = 10 cm.'
	},
	{
		id: 311,
		type: 'pilihan_ganda',
		subject: 'Fikih',
		jenjang: 'MTS',
		grade: 8,
		question_text: '<p>Puasa sunnah enam hari yang sangat dianjurkan dilaksanakan setelah hari raya Idul Fitri adalah puasa...</p>',
		question_number: 11,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Syawal' },
			{ key: 'B', text: 'Arafah' },
			{ key: 'C', text: 'Asyura' },
			{ key: 'D', text: 'Ayyamul Bidh' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Puasa sunnah enam hari di bulan Syawal pahalanya setara dengan berpuasa setahun penuh.'
	},
	{
		id: 312,
		type: 'pilihan_ganda',
		subject: 'Akidah Akhlak',
		jenjang: 'MTS',
		grade: 8,
		question_text: '<p>Sikap gigih berikhtiar tanpa pernah merasa berputus asa di saat menghadapi ujian dan kegagalan adalah cerminan sikap...</p>',
		question_number: 12,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Sabar dan Pantang Menyerah' },
			{ key: 'B', text: 'Ananiah' },
			{ key: 'C', text: 'Ghadhab' },
			{ key: 'D', text: 'Namimah' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Sabar dan optimis adalah akhlak terpuji yang menolak sifat putus asa (al-ya\'su).'
	},
	{
		id: 313,
		type: 'pilihan_ganda',
		subject: 'IPA',
		jenjang: 'MTS',
		grade: 8,
		question_text: '<p>Alat optik mata manusia memfokuskan bayangan benda agar jatuh tepat pada bagian...</p>',
		question_number: 13,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Retina (Selaput Jala)' },
			{ key: 'B', text: 'Kornea' },
			{ key: 'C', text: 'Pupil' },
			{ key: 'D', text: 'Iris' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Pada mata normal, bayangan benda difokuskan tepat pada bintik kuning di retina.'
	},
	{
		id: 314,
		type: 'pilihan_ganda',
		subject: 'Bahasa Arab',
		jenjang: 'MTS',
		grade: 8,
		question_text: '<p>Kata kerja <strong>يَكْتُبُ</strong> (menulis) jika digunakan untuk subjek <strong>فَاطِمَةُ</strong> (orang ketiga tunggal perempuan) berubah menjadi...</p>',
		question_number: 14,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'تَكْتُبُ' },
			{ key: 'B', text: 'أَكْتُبُ' },
			{ key: 'C', text: 'نَكْتُبُ' },
			{ key: 'D', text: 'يَكْتُبُوْنَ' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Untuk dhomir Hiya (Fatimah), fi\'il mudhari\' diawali huruf ta\' (تَكْتُبُ).'
	},
	{
		id: 315,
		type: 'pilihan_ganda',
		subject: 'SKI',
		jenjang: 'MTS',
		grade: 8,
		question_text: '<p>Ilmuwan muslim penemu angka nol dan perintis ilmu Aljabar matematika modern adalah...</p>',
		question_number: 15,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Muhammad bin Musa Al-Khawarizmi' },
			{ key: 'B', text: 'Ibnu Sina (Avicenna)' },
			{ key: 'C', text: 'Al-Biruni' },
			{ key: 'D', text: 'Jabir bin Hayyan' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Al-Khawarizmi adalah bapak aljabar dunia dan pengembang sistem angka nol.'
	},
	{
		id: 316,
		type: 'pilihan_ganda_kompleks',
		subject: "Al-Qur'an Hadis",
		jenjang: 'MTS',
		grade: 8,
		question_text: '<p>Berdasarkan hadis riwayat Bukhari dan Muslim, kedudukan orang yang mengasuh dan menyantuni anak yatim kelak di surga bersama Rasulullah SAW diibaratkan seperti apa? <em>(Pilih 2 jawaban yang tepat)</em></p>',
		question_number: 16,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Sangat dekat berdampingan bersama Rasulullah' },
			{ key: 'B', text: 'Dianalogikan seperti jarak antara jari telunjuk dan jari tengah' },
			{ key: 'C', text: 'Terpisah jauh di tingkatan surga yang berbeda' },
			{ key: 'D', text: 'Hanya mendapat ampunan tanpa memasuki surga firdaus' }
		]),
		correct_answer: '["A","B"]',
		points: 4,
		explanation: 'Hadis: أَنَا وَكَافِلُ الْيَتِيمِ فِي الْجَنَّةِ هَكَذَا (Aku dan pengasuh anak yatim di surga seperti dua jari ini).'
	},
	{
		id: 317,
		type: 'pilihan_ganda_kompleks',
		subject: 'IPA',
		jenjang: 'MTS',
		grade: 8,
		question_text: '<p>Berikut ini yang merupakan <strong>pesawat sederhana jenis tuas (pengungkit)</strong> dalam kehidupan sehari-hari adalah... <em>(Pilih 2 jawaban)</em></p>',
		question_number: 17,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Gunting kertas' },
			{ key: 'B', text: 'Sekop pemindah tanah' },
			{ key: 'C', text: 'Jalan berkelok di pegunungan (bidang miring)' },
			{ key: 'D', text: 'Baji pembelah kayu' }
		]),
		correct_answer: '["A","B"]',
		points: 4,
		explanation: 'Gunting (tuas jenis I) dan sekop (tuas jenis III) adalah contoh tuas/pengungkit.'
	},
	{
		id: 318,
		type: 'pilihan_ganda_kompleks',
		subject: 'IPS',
		jenjang: 'MTS',
		grade: 8,
		question_text: '<p>Manakah dari negara-negara berikut yang merupakan <strong>anggota pendiri organisasi ASEAN</strong> pada deklarasi Bangkok 1967? <em>(Pilih 2 jawaban)</em></p>',
		question_number: 18,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Indonesia' },
			{ key: 'B', text: 'Malaysia' },
			{ key: 'C', text: 'Vietnam' },
			{ key: 'D', text: 'Laos' }
		]),
		correct_answer: '["A","B"]',
		points: 4,
		explanation: '5 negara pendiri ASEAN: Indonesia, Malaysia, Filipina, Singapura, Thailand.'
	},
	{
		id: 319,
		type: 'benar_salah',
		subject: 'Fikih',
		jenjang: 'MTS',
		grade: 8,
		question_text: '<p>Tentukan status kebenaran (<strong>Benar</strong> atau <strong>Salah</strong>) mengenai ketentuan zakat mal:</p>',
		question_number: 19,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ id: '1', statement: 'Nisab zakat emas adalah seberat 85 gram emas murni dengan kadar zakat 2,5%.' },
			{ id: '2', statement: 'Zakat mal wajib dikeluarkan setiap bulan tanpa perlu menunggu haul (kepemilikan satu tahun).' }
		]),
		correct_answer: '{"1":"benar","2":"salah"}',
		points: 4,
		explanation: 'Nisab emas 85 gram kadar 2,5% (Benar). Zakat mal mensyaratkan haul genap satu tahun (Salah).'
	},
	{
		id: 320,
		type: 'benar_salah',
		subject: 'Bahasa Indonesia',
		jenjang: 'MTS',
		grade: 8,
		question_text: '<p>Tentukan status kebenaran pernyataan seputar <strong>Teks Eksposisi</strong> berikut:</p>',
		question_number: 20,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ id: '1', statement: 'Teks eksposisi bertujuan menambah wawasan dan pengetahuan pembaca dengan menyajikan fakta dan argumen logis.' },
			{ id: '2', statement: 'Struktur teks eksposisi terdiri dari orientasi, komplikasi, klimaks, dan resolusi cerita.' }
		]),
		correct_answer: '{"1":"benar","2":"salah"}',
		points: 4,
		explanation: 'Tujuan teks eksposisi menyajikan argumen dan fakta (Benar). Struktur orientasi-resolusi adalah struktur narasi cerpen/novel (Salah).'
	},
	{
		id: 321,
		type: 'menjodohkan',
		subject: 'Matematika',
		jenjang: 'MTS',
		grade: 8,
		question_text: '<p>Jodohkan titik koordinat Kartesius berikut dengan kuadran letaknya:</p>',
		question_number: 21,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify({
			left: [
				{ key: '1', text: 'Titik A(3, 5)' },
				{ key: '2', text: 'Titik B(-4, 6)' },
				{ key: '3', text: 'Titik C(-2, -7)' }
			],
			right: [
				{ key: 'A', text: 'Kuadran I (x > 0, y > 0)' },
				{ key: 'B', text: 'Kuadran II (x < 0, y > 0)' },
				{ key: 'C', text: 'Kuadran III (x < 0, y < 0)' }
			]
		}),
		correct_answer: '{"1":"A","2":"B","3":"C"}',
		points: 4,
		explanation: 'A(+,+) di Kuadran I, B(-,+) di Kuadran II, C(-,-) di Kuadran III.'
	},
	{
		id: 322,
		type: 'menjodohkan',
		subject: 'SKI',
		jenjang: 'MTS',
		grade: 8,
		question_text: '<p>Jodohkan ilmuwan muslim era Daulah Abbasiyah berikut dengan karya/bidang keahliannya:</p>',
		question_number: 22,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify({
			left: [
				{ key: '1', text: 'Ibnu Sina' },
				{ key: '2', text: 'Al-Khawarizmi' },
				{ key: '3', text: 'Jabir bin Hayyan' }
			],
			right: [
				{ key: 'A', text: 'Bapak Kedokteran Dunia (Penulis Al-Qanun fi at-Thibb)' },
				{ key: 'B', text: 'Penemu Aljabar dan Angka Nol' },
				{ key: 'C', text: 'Bapak Ilmu Kimia (Penemu teknik penyulingan)' }
			]
		}),
		correct_answer: '{"1":"A","2":"B","3":"C"}',
		points: 4,
		explanation: 'Ibnu Sina (Kedokteran), Al-Khawarizmi (Matematika), Jabir bin Hayyan (Kimia).'
	},
	{
		id: 323,
		type: 'isian_singkat',
		subject: 'Matematika',
		jenjang: 'MTS',
		grade: 8,
		question_text: '<p>Gradien (kemiringan garis) dari persamaan garis <strong>y = 4x - 9</strong> adalah ... <em>(Tuliskan angka jawabannya saja)</em></p>',
		question_number: 23,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: null,
		correct_answer: '4',
		points: 4,
		explanation: 'Bentuk umum persamaan garis y = mx + c, di mana m adalah gradien. Maka gradien = 4.'
	},
	{
		id: 324,
		type: 'isian_singkat',
		subject: 'Bahasa Indonesia',
		jenjang: 'MTS',
		grade: 8,
		question_text: '<p>Kalimat pendek yang menarik, mencolok, dan mudah diingat untuk memberitahukan atau mengiklankan sesuatu dinamakan...</p>',
		question_number: 24,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: null,
		correct_answer: 'slogan',
		points: 4,
		explanation: 'Slogan adalah kalimat pendek yang menarik dan mudah diingat.'
	},
	{
		id: 325,
		type: 'essay',
		subject: 'Akidah Akhlak',
		jenjang: 'MTS',
		grade: 8,
		question_text: '<p>Uraikan <strong>tiga (3) hikmah beriman kepada Kitab-kitab suci Allah SWT</strong> dalam menuntun perilaku seorang pelajar madrasah di kehidupan nyata!</p>',
		question_number: 25,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: null,
		correct_answer: 'Menjadikan Al-Qur\'an sebagai pedoman hidup, termotivasi untuk rajin menuntut ilmu, membentengi diri dari perbuatan maksiat, dan memperoleh ketenangan hati.',
		points: 4,
		explanation: 'Hikmah mencakup pedoman akhlak, petunjuk kebenaran, dan ketenangan jiwa.'
	}
];

// ==========================================
// 4. BANK SOAL SIMULASI MTS KELAS 9 (25 NOMOR)
// Khusus siswa MTs Kelas 9 (materi Kurikulum Kelas 9 & Asesmen Madrasah)
// ==========================================
export const MTS_QUESTIONS_GRADE_9: SimulationQuestion[] = [
	{
		id: 401,
		type: 'pilihan_ganda',
		subject: "Al-Qur'an Hadis",
		jenjang: 'MTS',
		grade: 9,
		question_text: '<p>Perhatikan potongan ayat: <strong>الْحَاقَّةُ</strong>. Hukum bacaan tajwid pada kata tersebut adalah...</p>',
		question_number: 1,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Mad Lazim Mutsaqqal Kilmi' },
			{ key: 'B', text: 'Mad Lazim Mukhaffaf Kilmi' },
			{ key: 'C', text: 'Mad Wajib Muttashil' },
			{ key: 'D', text: 'Mad Jaiz Munfashil' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Huruf mad bertemu huruf bertasydid dalam satu kata dibaca 6 harakat dengan diberatkan (Mad Lazim Mutsaqqal Kilmi).'
	},
	{
		id: 402,
		type: 'pilihan_ganda',
		subject: 'Akidah Akhlak',
		jenjang: 'MTS',
		grade: 9,
		question_text: '<p>Tanda-tanda kiamat besar (Kubra) yang menandai berakhirnya kehidupan di muka bumi di antaranya adalah...</p>',
		question_number: 2,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Munculnya Dajjal, turunnya Nabi Isa AS, dan terbitnya matahari dari arah barat' },
			{ key: 'B', text: 'Banyak orang berlomba-lomba meninggikan bangunan gedung' },
			{ key: 'C', text: 'Kemaksiatan semakin merajalela di kalangan masyarakat' },
			{ key: 'D', text: 'Banyaknya orang bodoh yang dijadikan pemimpin' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Munculnya Dajjal, turunnya Nabi Isa, dan matahari terbit dari barat merupakan tanda-tanda Kiamat Kubra.'
	},
	{
		id: 403,
		type: 'pilihan_ganda',
		subject: 'Fikih',
		jenjang: 'MTS',
		grade: 9,
		question_text: '<p>Ketentuan waktu penyembelihan hewan kurban yang sah menurut syariat Islam adalah pada tanggal...</p>',
		question_number: 3,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: '10 Dzulhijjah setelah shalat Idul Adha hingga 13 Dzulhijjah sebelum maghrib' },
			{ key: 'B', text: '1 Dzulhijjah sampai dengan 10 Dzulhijjah' },
			{ key: 'C', text: 'Malam tanggal 9 Dzulhijjah saat wukuf di Arafah' },
			{ key: 'D', text: 'Bebas sepanjang bulan Dzulhijjah' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Waktu qurban adalah tanggal 10 Dzulhijjah dan hari tasyriq (11, 12, 13 Dzulhijjah).'
	},
	{
		id: 404,
		type: 'pilihan_ganda',
		subject: 'SKI',
		jenjang: 'MTS',
		grade: 9,
		question_text: '<p>Kerajaan Islam pertama yang berdiri di kepulauan Nusantara terletak di ujung utara pulau Sumatera, yaitu kerajaan...</p>',
		question_number: 4,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Samudera Pasai' },
			{ key: 'B', text: 'Demak' },
			{ key: 'C', text: 'Mataram Islam' },
			{ key: 'D', text: 'Banten' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Kerajaan Samudera Pasai didirikan oleh Sultan Malik As-Saleh pada abad ke-13.'
	},
	{
		id: 405,
		type: 'pilihan_ganda',
		subject: 'Bahasa Arab',
		jenjang: 'MTS',
		grade: 9,
		question_text: '<p>Peristiwa hijrahnya Nabi Muhammad SAW dari Makkah ke Madinah dijadikan sebagai permulaan penanggalan kalender...</p>',
		question_number: 5,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Hijriyyah (السَّنَةُ الْهِجْرِيَّةُ)' },
			{ key: 'B', text: 'Masehi' },
			{ key: 'C', text: 'Syamsiyyah' },
			{ key: 'D', text: 'Jawa Kuno' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Kalender Hijriyyah ditetapkan pertama kali pada masa Khalifah Umar bin Khattab berdasarkan momen Hijrah.'
	},
	{
		id: 406,
		type: 'pilihan_ganda',
		subject: 'Bahasa Indonesia',
		jenjang: 'MTS',
		grade: 9,
		question_text: '<p>Salah satu metode berpidato yang dilakukan secara spontan tanpa persiapan teks terlebih dahulu dinamakan metode...</p>',
		question_number: 6,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Impromptu' },
			{ key: 'B', text: 'Memoriter' },
			{ key: 'C', text: 'Naskah' },
			{ key: 'D', text: 'Ekstemporan' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Metode pidato spontan tanpa persiapan naskah disebut impromptu.'
	},
	{
		id: 407,
		type: 'pilihan_ganda',
		subject: 'Matematika',
		jenjang: 'MTS',
		grade: 9,
		question_text: '<p>Bentuk sederhana dari <strong>√75 + 2√12 - √27</strong> adalah...</p>',
		question_number: 7,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: '6√3' },
			{ key: 'B', text: '5√3' },
			{ key: 'C', text: '4√3' },
			{ key: 'D', text: '8√3' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: '√75 = 5√3; 2√12 = 4√3; √27 = 3√3. Maka 5√3 + 4√3 - 3√3 = 6√3.'
	},
	{
		id: 408,
		type: 'pilihan_ganda',
		subject: 'IPA',
		jenjang: 'MTS',
		grade: 9,
		question_text: '<p>Persilangan antara tanaman berbunga merah (MM) dominan dengan tanaman berbunga putih (mm) resesif akan menghasilkan keturunan F1 yang seluruhnya memiliki genotipe dan fenotipe...</p>',
		question_number: 8,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Mm, 100% berbunga merah' },
			{ key: 'B', text: 'MM, 100% berbunga merah' },
			{ key: 'C', text: 'Mm, 50% merah dan 50% putih' },
			{ key: 'D', text: 'mm, 100% berbunga putih' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Hukum Mendel I: gamet M disilangkan dengan m menghasilkan F1 Mm dengan fenotipe merah (karena merah dominan).'
	},
	{
		id: 409,
		type: 'pilihan_ganda',
		subject: 'IPS',
		jenjang: 'MTS',
		grade: 9,
		question_text: '<p>Benua terluas di permukaan bumi yang juga memiliki jumlah populasi penduduk terbesar adalah benua...</p>',
		question_number: 9,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Asia' },
			{ key: 'B', text: 'Amerika' },
			{ key: 'C', text: 'Afrika' },
			{ key: 'D', text: 'Eropa' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Benua Asia adalah benua terbesar di dunia dengan luas sekitar 44,5 juta km².'
	},
	{
		id: 410,
		type: 'pilihan_ganda',
		subject: 'Matematika',
		jenjang: 'MTS',
		grade: 9,
		question_text: '<p>Akar-akar dari persamaan kuadrat <strong>x² - 7x + 10 = 0</strong> adalah...</p>',
		question_number: 10,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'x = 2 atau x = 5' },
			{ key: 'B', text: 'x = -2 atau x = -5' },
			{ key: 'C', text: 'x = 1 atau x = 10' },
			{ key: 'D', text: 'x = -1 atau x = 10' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: '(x - 2)(x - 5) = 0, sehingga x1 = 2 atau x2 = 5.'
	},
	{
		id: 411,
		type: 'pilihan_ganda',
		subject: 'Fikih',
		jenjang: 'MTS',
		grade: 9,
		question_text: '<p>Hak bagi penjual dan pembeli untuk memilih meneruskan atau membatalkan akad jual beli selama masih berada di tempat transaksi disebut khiyar...</p>',
		question_number: 11,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Majelis' },
			{ key: 'B', text: 'Syarat' },
			{ key: 'C', text: 'Aibi' },
			{ key: 'D', text: 'Ghaban' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Khiyar Majelis berlaku selama kedua belah pihak belum berpisah dari tempat transaksi.'
	},
	{
		id: 412,
		type: 'pilihan_ganda',
		subject: 'Akidah Akhlak',
		jenjang: 'MTS',
		grade: 9,
		question_text: '<p>Takdir Allah yang tidak dapat diubah oleh usaha atau ikhtiar manusia sama sekali, seperti kematian dan hari kiamat, dinamakan takdir...</p>',
		question_number: 12,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Mubram' },
			{ key: 'B', text: 'Mu\'allaq' },
			{ key: 'C', text: 'Ikhtiyari' },
			{ key: 'D', text: 'Kasbi' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Takdir Mubram adalah ketentuan mutlak Allah yang tidak dapat dipengaruhi usaha manusia.'
	},
	{
		id: 413,
		type: 'pilihan_ganda',
		subject: 'IPA',
		jenjang: 'MTS',
		grade: 9,
		question_text: '<p>Mikroorganisme yang digunakan dalam proses pembuatan tempe melalui fermentasi kedelai adalah jamur...</p>',
		question_number: 13,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Rhizopus oryzae' },
			{ key: 'B', text: 'Saccharomyces cerevisiae' },
			{ key: 'C', text: 'Lactobacillus bulgaricus' },
			{ key: 'D', text: 'Acetobacter xylinum' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Rhizopus oryzae (ragi tempe) digunakan dalam fermentasi tempe.'
	},
	{
		id: 414,
		type: 'pilihan_ganda',
		subject: 'Bahasa Arab',
		jenjang: 'MTS',
		grade: 9,
		question_text: '<p>Peristiwa turunnya Al-Qur\'an pertama kali kepada Nabi Muhammad SAW di Gua Hira diperingati pada tanggal...</p>',
		question_number: 14,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: '17 Ramadhan (نُزُوْلُ الْقُرْآن)' },
			{ key: 'B', text: '1 Syawwal' },
			{ key: 'C', text: '1 Muharram' },
			{ key: 'D', text: '12 Rabi\'ul Awwal' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Malam Nuzulul Qur\'an diperingati setiap malam 17 Ramadhan.'
	},
	{
		id: 415,
		type: 'pilihan_ganda',
		subject: 'SKI',
		jenjang: 'MTS',
		grade: 9,
		question_text: '<p>Kerajaan Islam pertama di pulau Jawa yang didirikan oleh Raden Patah dengan bantuan Walisongo adalah kesultanan...</p>',
		question_number: 15,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Demak' },
			{ key: 'B', text: 'Pajang' },
			{ key: 'C', text: 'Mataram' },
			{ key: 'D', text: 'Cirebon' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Kesultanan Demak adalah pelopor kerajaan Islam pertama di tanah Jawa.'
	},
	{
		id: 416,
		type: 'pilihan_ganda_kompleks',
		subject: "Al-Qur'an Hadis",
		jenjang: 'MTS',
		grade: 9,
		question_text: '<p>Manakah di antara tindakan berikut yang sesuai dengan ajaran hadis Nabi SAW tentang <strong>kelestarian lingkungan hidup</strong>? <em>(Pilih 2 jawaban benar)</em></p>',
		question_number: 16,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Menanam pohon atau tumbuhan yang buahnya bermanfaat bagi sesama maupun hewan' },
			{ key: 'B', text: 'Menjaga kebersihan sumber mata air dan tidak membuang kotoran di tempat berteduh' },
			{ key: 'C', text: 'Menebangi pohon secara liar di kawasan hulu sungai' },
			{ key: 'D', text: 'Membuang limbah sampah plastik langsung ke laut' }
		]),
		correct_answer: '["A","B"]',
		points: 4,
		explanation: 'Rasulullah SAW melarang merusak pepohonan dan mencemari sumber air.'
	},
	{
		id: 417,
		type: 'pilihan_ganda_kompleks',
		subject: 'IPA',
		jenjang: 'MTS',
		grade: 9,
		question_text: '<p>Berikut ini yang merupakan contoh pemanfaatan <strong>Bioteknologi Modern</strong> adalah... <em>(Pilih 2 jawaban)</em></p>',
		question_number: 17,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Kultur jaringan tumbuhan' },
			{ key: 'B', text: 'Rekayasa genetika (Pembuatan hormon insulin rekombinan)' },
			{ key: 'C', text: 'Pembuatan kecap menggunakan Aspergillus wentii' },
			{ key: 'D', text: 'Pembuatan nata de coco dari air kelapa' }
		]),
		correct_answer: '["A","B"]',
		points: 4,
		explanation: 'Kultur jaringan dan rekombinasi DNA merupakan bioteknologi modern tingkat sel/genetik.'
	},
	{
		id: 418,
		type: 'pilihan_ganda_kompleks',
		subject: 'IPS',
		jenjang: 'MTS',
		grade: 9,
		question_text: '<p>Dampak positif dari terjadinya <strong>Globalisasi</strong> bagi generasi muda Indonesia adalah... <em>(Pilih 2 jawaban)</em></p>',
		question_number: 18,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Kemudahan akses informasi ilmu pengetahuan dan teknologi dunia' },
			{ key: 'B', text: 'Peluang memasarkan produk kreatif lokal ke pasar global' },
			{ key: 'C', text: 'Lunturnya nilai-nilai budaya dan etika ketimuran' },
			{ key: 'D', text: 'Meningkatnya sifat individualistis dan konsumtif' }
		]),
		correct_answer: '["A","B"]',
		points: 4,
		explanation: 'Kemudahan akses ilmu dan perluasan pasar produk lokal adalah dampak positif globalisasi.'
	},
	{
		id: 419,
		type: 'benar_salah',
		subject: 'Fikih',
		jenjang: 'MTS',
		grade: 9,
		question_text: '<p>Tentukan status kebenaran (<strong>Benar</strong> atau <strong>Salah</strong>) mengenai ketentuan ibadah Aqiqah:</p>',
		question_number: 19,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ id: '1', statement: 'Bagi anak laki-laki disunnahkan menyembelih 2 ekor kambing, dan untuk anak perempuan 1 ekor kambing.' },
			{ id: '2', statement: 'Daging aqiqah disunnahkan dibagikan dalam keadaan mentah sama persis seperti daging kurban.' }
		]),
		correct_answer: '{"1":"benar","2":"salah"}',
		points: 4,
		explanation: 'Ketentuan 2 kambing untuk anak laki-laki dan 1 untuk perempuan (Benar). Daging aqiqah disunnahkan dibagikan dalam kondisi sudah dimasak matang (Salah).'
	},
	{
		id: 420,
		type: 'benar_salah',
		subject: 'Matematika',
		jenjang: 'MTS',
		grade: 9,
		question_text: '<p>Tentukan apakah pernyataan matematika tentang geometri bangun ruang sisi lengkung berikut <strong>Benar</strong> atau <strong>Salah</strong>:</p>',
		question_number: 20,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ id: '1', statement: 'Rumus volume tabung dengan jari-jari r dan tinggi t adalah V = π × r² × t.' },
			{ id: '2', statement: 'Kerucut memiliki dua buah bidang sisi dan dua buah rusuk lengkung.' }
		]),
		correct_answer: '{"1":"benar","2":"salah"}',
		points: 4,
		explanation: 'Volume tabung π r² t (Benar). Kerucut hanya memiliki 1 rusuk lengkung dan 2 sisi (Salah).'
	},
	{
		id: 421,
		type: 'menjodohkan',
		subject: 'SKI',
		jenjang: 'MTS',
		grade: 9,
		question_text: '<p>Jodohkan nama tokoh Walisongo berikut dengan nama asli dan gelar kehormatannya:</p>',
		question_number: 21,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify({
			left: [
				{ key: '1', text: 'Sunan Ampel' },
				{ key: '2', text: 'Sunan Gunung Jati' },
				{ key: '3', text: 'Sunan Kalijaga' }
			],
			right: [
				{ key: 'A', text: 'Raden Rahmat' },
				{ key: 'B', text: 'Syarif Hidayatullah' },
				{ key: 'C', text: 'Raden Mas Said' }
			]
		}),
		correct_answer: '{"1":"A","2":"B","3":"C"}',
		points: 4,
		explanation: 'Sunan Ampel = Raden Rahmat, Sunan Gunung Jati = Syarif Hidayatullah, Sunan Kalijaga = Raden Mas Said.'
	},
	{
		id: 422,
		type: 'menjodohkan',
		subject: 'Bahasa Indonesia',
		jenjang: 'MTS',
		grade: 9,
		question_text: '<p>Jodohkan struktur teks laporan percobaan dengan fungsinya:</p>',
		question_number: 22,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify({
			left: [
				{ key: '1', text: 'Tujuan Percobaan' },
				{ key: '2', text: 'Alat dan Bahan' },
				{ key: '3', text: 'Hasil dan Kesimpulan' }
			],
			right: [
				{ key: 'A', text: 'Memaparkan alasan dan sasaran yang ingin dicapai melalui eksperimen' },
				{ key: 'B', text: 'Mendaftar perlengkapan yang digunakan selama pelaksanaan uji coba' },
				{ key: 'C', text: 'Menyajikan data temuan akhir serta intisari dari kegiatan percobaan' }
			]
		}),
		correct_answer: '{"1":"A","2":"B","3":"C"}',
		points: 4,
		explanation: 'Struktur teks laporan percobaan ilmiah bahasa Indonesia kelas 9.'
	},
	{
		id: 423,
		type: 'isian_singkat',
		subject: 'Matematika',
		jenjang: 'MTS',
		grade: 9,
		question_text: '<p>Hasil dari <strong>3⁴ × 3² ÷ 3³</strong> adalah ... <em>(Tuliskan angka jawabannya saja)</em></p>',
		question_number: 23,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: null,
		correct_answer: '27',
		points: 4,
		explanation: '3^(4 + 2 - 3) = 3^3 = 27.'
	},
	{
		id: 424,
		type: 'isian_singkat',
		subject: 'Akidah Akhlak',
		jenjang: 'MTS',
		grade: 9,
		question_text: '<p>Sikap merasa cukup dan bersyukur atas rezeki dan apa yang telah dianugerahkan Allah SWT dinamakan sifat...</p>',
		question_number: 24,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: null,
		correct_answer: 'qanaah',
		points: 4,
		explanation: 'Qana\'ah adalah sikap rela menerima dan merasa cukup dengan karunia Allah.'
	},
	{
		id: 425,
		type: 'essay',
		subject: 'Akidah Akhlak',
		jenjang: 'MTS',
		grade: 9,
		question_text: '<p>Jelaskan hubungan antara <strong>Iman kepada Hari Akhir (Kiamat)</strong> dengan kejujuran dan integritas seorang siswa saat mengikuti ujian madrasah!</p>',
		question_number: 25,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: null,
		correct_answer: 'Seorang yang beriman kepada Hari Akhir menyadari bahwa seluruh amal perbuatan akan dihisab dan dipertanggungjawabkan di hadapan Allah. Kesadaran ini menumbuhkan rasa muraqabah (selalu diawasi Allah) sehingga siswa tidak akan mencontek dan selalu bertindak jujur saat ujian.',
		points: 4,
		explanation: 'Jawaban mengaitkan pengawasan Allah (muraqabah) dan pertanggungjawaban di yaumul hisab dengan integritas saat ujian.'
	}
];

// ==========================================
// 5. BANK SOAL SIMULASI MA (KELAS 10, 11, 12)
// Disediakan 25 nomor per tingkat
// ==========================================
export const MA_QUESTIONS_GRADE_10: SimulationQuestion[] = [
	{
		id: 501,
		type: 'pilihan_ganda',
		subject: "Al-Qur'an Hadis",
		jenjang: 'MA',
		grade: 10,
		question_text: '<p>Proses pembukuan Al-Qur\'an menjadi satu mushaf standar (Mushaf Usmani) dipimpin oleh sahabat yang bernama...</p>',
		question_number: 1,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Zaid bin Tsabit' },
			{ key: 'B', text: 'Ali bin Abi Thalib' },
			{ key: 'C', text: 'Abdullah bin Mas\'ud' },
			{ key: 'D', text: 'Ubay bin Ka\'ab' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Zaid bin Tsabit RA ditunjuk sebagai ketua panitia kodifikasi Al-Qur\'an.'
	},
	{
		id: 502,
		type: 'pilihan_ganda',
		subject: 'Akidah Akhlak',
		jenjang: 'MA',
		grade: 10,
		question_text: '<p>Meyakini bahwa Allah SWT adalah satu-satunya Pencipta, Pemelihara, dan Pengatur seluruh alam semesta merupakan tauhid...</p>',
		question_number: 2,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Rububiyah' },
			{ key: 'B', text: 'Uluhiyah' },
			{ key: 'C', text: 'Asma wa Sifat' },
			{ key: 'D', text: 'Amaliyah' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Tauhid Rububiyah adalah pengesaan Allah dalam perbuatan-Nya seperti mencipta dan mengatur alam.'
	},
	{
		id: 503,
		type: 'pilihan_ganda',
		subject: 'Fikih',
		jenjang: 'MA',
		grade: 10,
		question_text: '<p>Hukum asal segala bentuk transaksi muamalah dalam Islam adalah mubah (boleh), kecuali...</p>',
		question_number: 3,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Ada dalil yang melarang atau mengharamkannya' },
			{ key: 'B', text: 'Nilai keuntungannya sangat besar' },
			{ key: 'C', text: 'Dilakukan oleh orang yang berlainan negara' },
			{ key: 'D', text: 'Dilakukan secara digital online' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Kaidah ushul fiqih: Al-Ashlu fil mu\'amalati al-ibahah illa an yadulla dalilun \'ala tahrimiha.'
	},
	{
		id: 504,
		type: 'pilihan_ganda',
		subject: 'SKI',
		jenjang: 'MA',
		grade: 10,
		question_text: '<p>Gelar <em>"Dzul Nurain"</em> (pemilik dua cahaya) disematkan kepada khalifah...</p>',
		question_number: 4,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Utsman bin Affan RA' },
			{ key: 'B', text: 'Abu Bakar Ash-Shiddiq RA' },
			{ key: 'C', text: 'Umar bin Khattab RA' },
			{ key: 'D', text: 'Ali bin Abi Thalib RA' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Utsman bin Affan menikahi dua putri Rasulullah SAW (Ruqayyah dan Ummu Kultsum).'
	},
	{
		id: 505,
		type: 'pilihan_ganda',
		subject: 'Bahasa Arab',
		jenjang: 'MA',
		grade: 10,
		question_text: '<p>Kalimat yang tersusun dari subjek (Mubtada\') dan predikat (Khabar) dalam tata bahasa Arab disebut jumlah...</p>',
		question_number: 5,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Ismiyyah' },
			{ key: 'B', text: 'Fi\'liyyah' },
			{ key: 'C', text: 'Zharfiyyah' },
			{ key: 'D', text: 'Syarathiyyah' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Jumlah Ismiyyah adalah kalimat yang diawali dengan isim (kata benda) terdiri dari Mubtada dan Khabar.'
	},
	{
		id: 506,
		type: 'pilihan_ganda',
		subject: 'Matematika',
		jenjang: 'MA',
		grade: 10,
		question_text: '<p>Himpunan penyelesaian dari pertidaksamaan nilai mutlak <strong>|2x - 3| < 7</strong> adalah...</p>',
		question_number: 6,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: '-2 < x < 5' },
			{ key: 'B', text: '-5 < x < 2' },
			{ key: 'C', text: 'x < -2 atau x > 5' },
			{ key: 'D', text: '2 < x < 5' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: '-7 < 2x - 3 < 7 -> -4 < 2x < 10 -> -2 < x < 5.'
	},
	{
		id: 507,
		type: 'pilihan_ganda',
		subject: 'Bahasa Indonesia',
		jenjang: 'MA',
		grade: 10,
		question_text: '<p>Struktur teks laporan hasil observasi (LHO) yang sistematis terdiri atas...</p>',
		question_number: 7,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Pernyataan umum (klasifikasi), deskripsi bagian, dan deskripsi manfaat' },
			{ key: 'B', text: 'Orientasi, komplikasi, evaluasi, dan resolusi' },
			{ key: 'C', text: 'Tesis, rangkaian argumen, dan penegasan ulang' },
			{ key: 'D', text: 'Pengenalan isu, rangkaian peristiwa, dan ajakan' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Struktur baku teks LHO: Pernyataan Umum, Deskripsi Bagian, Deskripsi Manfaat.'
	},
	{
		id: 508,
		type: 'pilihan_ganda',
		subject: 'IPA',
		jenjang: 'MA',
		grade: 10,
		question_text: '<p>Virus yang menyerang dan menginfeksi bakteri disebut...</p>',
		question_number: 8,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Bakteriofag' },
			{ key: 'B', text: 'Retrovirus' },
			{ key: 'C', text: 'Adenovirus' },
			{ key: 'D', text: 'Viroid' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Bakteriofag (fag) adalah kelompok virus yang khusus menginfeksi bakteri.'
	},
	{
		id: 509,
		type: 'pilihan_ganda',
		subject: 'IPS',
		jenjang: 'MA',
		grade: 10,
		question_text: '<p>Masalah pokok ekonomi klasik mencakup tiga kegiatan utama, yaitu...</p>',
		question_number: 9,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Produksi, Distribusi, dan Konsumsi' },
			{ key: 'B', text: 'What, How, dan For Whom' },
			{ key: 'C', text: 'Modal, Tenaga Kerja, dan Laba' },
			{ key: 'D', text: 'Inflasi, Pengangguran, dan Kemiskinan' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Masalah ekonomi klasik berkutat pada produksi, distribusi, dan konsumsi barang/jasa.'
	},
	{
		id: 510,
		type: 'pilihan_ganda',
		subject: 'Akidah Akhlak',
		jenjang: 'MA',
		grade: 10,
		question_text: '<p>Sikap menahan diri dari hawa nafsu dan kesenangan duniawi yang berlebihan demi mendekatkan diri kepada Allah disebut sifat...</p>',
		question_number: 10,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Zuhud dan Wara\'' },
			{ key: 'B', text: 'Takabur' },
			{ key: 'C', text: 'Tatsabut' },
			{ key: 'D', text: 'Riya' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Zuhud dan wara\' adalah sikap hati-hati menjauhi syubhat dan kesenangan dunia berlebih.'
	},
	{
		id: 511,
		type: 'pilihan_ganda',
		subject: 'Matematika',
		jenjang: 'MA',
		grade: 10,
		question_text: '<p>Jika f(x) = 2x + 5 dan g(x) = 3x - 1, maka nilai fungsi komposisi (f ∘ g)(2) adalah...</p>',
		question_number: 11,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: '15' },
			{ key: 'B', text: '17' },
			{ key: 'C', text: '19' },
			{ key: 'D', text: '21' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'g(2) = 3(2) - 1 = 5. Maka f(g(2)) = f(5) = 2(5) + 5 = 15.'
	},
	{
		id: 512,
		type: 'pilihan_ganda',
		subject: 'Fikih',
		jenjang: 'MA',
		grade: 10,
		question_text: '<p>Tindak pidana pembunuhan yang dilakukan dengan sengaja dan terencana dalam hukum jinayah Islam diancam dengan hukuman pokok berupa...</p>',
		question_number: 12,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Qishash (atau Diyat berat bila dimaafkan)' },
			{ key: 'B', text: 'Kafarat puasa satu tahun' },
			{ key: 'C', text: 'Ta\'zir cambuk sepuluh kali' },
			{ key: 'D', text: 'Penjara seumur hidup' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Pembunuhan sengaja (qatlul \'amdi) berkonsekuensi hukuman qishash atau diyat mughalladhah.'
	},
	{
		id: 513,
		type: 'pilihan_ganda',
		subject: 'IPA',
		jenjang: 'MA',
		grade: 10,
		question_text: '<p>Sebuah mobil bergerak dengan kecepatan awal 10 m/s dan mengalami percepatan konstan 2 m/s² selama 5 detik. Kecepatan akhir mobil tersebut adalah...</p>',
		question_number: 13,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: '20 m/s' },
			{ key: 'B', text: '25 m/s' },
			{ key: 'C', text: '15 m/s' },
			{ key: 'D', text: '30 m/s' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'vt = v0 + a.t = 10 + 2(5) = 20 m/s.'
	},
	{
		id: 514,
		type: 'pilihan_ganda',
		subject: 'Bahasa Arab',
		jenjang: 'MA',
		grade: 10,
		question_text: '<p>Huruf-huruf yang termasuk dalam huruf Jar (حُرُوْفُ الْجَرِّ) yang meng-kasrahkan isim setelahnya adalah...</p>',
		question_number: 14,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'مِنْ، إِلَى، عَنْ، عَلَى، فِيْ، الْبَاءُ، اللَّامُ' },
			{ key: 'B', text: 'أَنْ، لَنْ، إِذَنْ، كَيْ' },
			{ key: 'C', text: 'إِنَّ، أَنَّ، كَأَنَّ، لَكِنَّ' },
			{ key: 'D', text: 'لَمْ، لَمَّا، لَامُ الْأَمْرِ' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Min, ila, \'an, \'ala, fi, bi, li adalah huruf jar.'
	},
	{
		id: 515,
		type: 'pilihan_ganda',
		subject: 'SKI',
		jenjang: 'MA',
		grade: 10,
		question_text: '<p>Dinasti Islam yang berhasil menaklukkan kota Konstantinopel pada tahun 1453 M di bawah kepemimpinan Sultan Muhammad Al-Fatih adalah Dinasti...</p>',
		question_number: 15,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Utsmaniyah (Turki Usmani)' },
			{ key: 'B', text: 'Mughal' },
			{ key: 'C', text: 'Safawiyah' },
			{ key: 'D', text: 'Mamluk' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Sultan Muhammad Al-Fatih adalah penguasa Daulah Turki Utsmani.'
	},
	{
		id: 516,
		type: 'pilihan_ganda_kompleks',
		subject: "Al-Qur'an Hadis",
		jenjang: 'MA',
		grade: 10,
		question_text: '<p>Di antara syarat-syarat diterimanya sebuah hadis berderajat <strong>Shahih</strong> menurut ulama ahli hadis adalah... <em>(Pilih 2 jawaban)</em></p>',
		question_number: 16,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Sanadnya bersambung (Ittishal al-Sanad) dari awal hingga akhir' },
			{ key: 'B', text: 'Semua perawi dalam sanad memiliki sifat \'Adil dan Dhabith (kuat hafalannya)' },
			{ key: 'C', text: 'Memiliki riwayat yang bertentangan dengan Al-Qur\'an' },
			{ key: 'D', text: 'Terdapat cacat tersembunyi (\'illat) pada matan hadis' }
		]),
		correct_answer: '["A","B"]',
		points: 4,
		explanation: 'Syarat hadis shahih: sanad bersambung, rawi adil, rawi dhabith, tidak syadz, tidak berillat.'
	},
	{
		id: 517,
		type: 'pilihan_ganda_kompleks',
		subject: 'IPA',
		jenjang: 'MA',
		grade: 10,
		question_text: '<p>Unsur-unsur yang terletak pada golongan Gas Mulia (Golongan VIIIA) dalam tabel periodik memiliki sifat sangat stabil. Contoh gas mulia adalah... <em>(Pilih 2 jawaban)</em></p>',
		question_number: 17,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Helium (He)' },
			{ key: 'B', text: 'Neon (Ne)' },
			{ key: 'C', text: 'Klorin (Cl)' },
			{ key: 'D', text: 'Oksigen (O)' }
		]),
		correct_answer: '["A","B"]',
		points: 4,
		explanation: 'He, Ne, Ar, Kr, Xe, Rn adalah gas mulia golongan VIIIA.'
	},
	{
		id: 518,
		type: 'pilihan_ganda_kompleks',
		subject: 'IPS',
		jenjang: 'MA',
		grade: 10,
		question_text: '<p>Ciri-ciri sistem ekonomi pasar (kapitalis) di antaranya adalah... <em>(Pilih 2 jawaban)</em></p>',
		question_number: 18,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Hak milik perorangan atas faktor produksi diakui sepenuhnya' },
			{ key: 'B', text: 'Harga barang terbentuk bebas berdasarkan mekanisme permintaan dan penawaran' },
			{ key: 'C', text: 'Pemerintah mengatur secara terpusat seluruh alokasi barang kebutuhan' },
			{ key: 'D', text: 'Tidak ada persaingan usaha antar pelaku ekonomi' }
		]),
		correct_answer: '["A","B"]',
		points: 4,
		explanation: 'Kepemilikan pribadi dan mekanisme pasar bebas merupakan ciri khas ekonomi pasar.'
	},
	{
		id: 519,
		type: 'benar_salah',
		subject: 'Fikih',
		jenjang: 'MA',
		grade: 10,
		question_text: '<p>Tentukan status kebenaran (<strong>Benar</strong> atau <strong>Salah</strong>) mengenai hukum akad Muamalah Islam:</p>',
		question_number: 19,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ id: '1', statement: 'Akad Mudharabah adalah kerja sama permodalan di mana satu pihak menyediakan modal 100% dan pihak lain sebagai pengelola keahlian usaha.' },
			{ id: '2', statement: 'Praktik Riba Nasi\'ah (tambahan bunga akibat penundaan tempo hutang) diperbolehkan dalam keadaan darurat tanpa batas.' }
		]),
		correct_answer: '{"1":"benar","2":"salah"}',
		points: 4,
		explanation: 'Definisi Mudharabah (Benar). Riba diharamkan secara tegas dalam syariat Islam (Salah).'
	},
	{
		id: 520,
		type: 'benar_salah',
		subject: 'Bahasa Indonesia',
		jenjang: 'MA',
		grade: 10,
		question_text: '<p>Tentukan status kebenaran pernyataan terkait teks <strong>Biografi</strong> berikut:</p>',
		question_number: 20,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ id: '1', statement: 'Teks biografi ditulis oleh orang lain untuk menceritakan riwayat hidup, perjuangan, dan keteladanan seorang tokoh.' },
			{ id: '2', statement: 'Jika riwayat hidup ditulis oleh tokoh itu sendiri mengenai dirinya, maka teks tersebut dinamakan biografi.' }
		]),
		correct_answer: '{"1":"benar","2":"salah"}',
		points: 4,
		explanation: 'Biografi ditulis oleh orang lain (Benar). Jika ditulis sendiri namanya Autobiografi (Salah).'
	},
	{
		id: 521,
		type: 'menjodohkan',
		subject: 'Matematika',
		jenjang: 'MA',
		grade: 10,
		question_text: '<p>Jodohkan nilai perbandingan trigonometri sudut istimewa berikut:</p>',
		question_number: 21,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify({
			left: [
				{ key: '1', text: 'sin(30°)' },
				{ key: '2', text: 'cos(60°)' },
				{ key: '3', text: 'tan(45°)' }
			],
			right: [
				{ key: 'A', text: '1/2' },
				{ key: 'B', text: '1/2' },
				{ key: 'C', text: '1' }
			]
		}),
		correct_answer: '{"1":"A","2":"B","3":"C"}',
		points: 4,
		explanation: 'sin 30° = 1/2, cos 60° = 1/2, tan 45° = 1.'
	},
	{
		id: 522,
		type: 'menjodohkan',
		subject: 'SKI',
		jenjang: 'MA',
		grade: 10,
		question_text: '<p>Jodohkan daulah Islam berikut dengan ibukota pusat pemerintahannya:</p>',
		question_number: 22,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify({
			left: [
				{ key: '1', text: 'Daulah Umayyah' },
				{ key: '2', text: 'Daulah Abbasiyah' },
				{ key: '3', text: 'Daulah Turki Utsmani' }
			],
			right: [
				{ key: 'A', text: 'Damaskus (Suriah)' },
				{ key: 'B', text: 'Baghdad (Irak)' },
				{ key: 'C', text: 'Istanbul / Konstantinopel (Turki)' }
			]
		}),
		correct_answer: '{"1":"A","2":"B","3":"C"}',
		points: 4,
		explanation: 'Umayyah di Damaskus, Abbasiyah di Baghdad, Utsmaniyah di Istanbul.'
	},
	{
		id: 523,
		type: 'isian_singkat',
		subject: 'Matematika',
		jenjang: 'MA',
		grade: 10,
		question_text: '<p>Jika log 2 = 0,301 dan log 3 = 0,477, maka nilai dari log 6 adalah ... <em>(Tuliskan angka dengan koma atau titik desimal)</em></p>',
		question_number: 23,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: null,
		correct_answer: '0.778',
		points: 4,
		explanation: 'log 6 = log (2 × 3) = log 2 + log 3 = 0,301 + 0,477 = 0,778.'
	},
	{
		id: 524,
		type: 'isian_singkat',
		subject: 'Bahasa Indonesia',
		jenjang: 'MA',
		grade: 10,
		question_text: '<p>Proses tawar-menawar dengan jalan berunding guna mencapai kesepakatan bersama antara dua pihak atau lebih dinamakan...</p>',
		question_number: 24,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: null,
		correct_answer: 'negosiasi',
		points: 4,
		explanation: 'Negosiasi adalah proses perundingan tawar-menawar untuk mencapai kata sepakat.'
	},
	{
		id: 525,
		type: 'essay',
		subject: 'Akidah Akhlak',
		jenjang: 'MA',
		grade: 10,
		question_text: '<p>Jelaskan pentingnya integrasi ilmu pengetahuan (sains) dan nilai-nilai agama Islam bagi seorang siswa madrasah aliyah di era disrupsi digital saat ini!</p>',
		question_number: 25,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: null,
		correct_answer: 'Integrasi sains dan agama menjadikan ilmu pengetahuan bernilai maslahat bagi kemanusiaan dan dilandasi akhlak mulia. Sains memberi keahlian teknologi sedangkan agama menjadi kompas moral agar teknologi tidak disalahgunakan untuk kehancuran.',
		points: 4,
		explanation: 'Jawaban mengaitkan penguasaan IPTEK dengan fondasi IMTAK (iman dan takwa) dalam kemaslahatan umat.'
	}
];

// Soal MA Kelas 11 & 12
export const MA_QUESTIONS_GRADE_11: SimulationQuestion[] = MA_QUESTIONS_GRADE_10.map((q, i) => ({
	...q,
	id: 601 + i,
	grade: 11
}));

export const MA_QUESTIONS_GRADE_12: SimulationQuestion[] = MA_QUESTIONS_GRADE_10.map((q, i) => ({
	...q,
	id: 701 + i,
	grade: 12
}));

// ==========================================
// FUNGSI PARSER TINGKAT KELAS & JENJANG
// ==========================================
export function parseGradeAndJenjang(
	schoolJenjang: string | null | undefined,
	schoolName: string | null | undefined,
	classLevel: string | null | undefined,
	className: string | null | undefined
): { jenjang: 'MI' | 'MTS' | 'MA'; grade: number; displayGrade: string } {
	let jenjang: 'MI' | 'MTS' | 'MA' = 'MTS';

	const normSchoolJenjang = (schoolJenjang || '').trim().toUpperCase();
	const normSchoolName = (schoolName || '').trim().toUpperCase();
	const normClassLevel = (classLevel || '').trim().toUpperCase();
	const normClassName = (className || '').trim().toUpperCase();

	// 1. Tentukan Jenjang Sekolah Utama
	if (normSchoolJenjang.includes('MI') || normSchoolJenjang.includes('SD')) {
		jenjang = 'MI';
	} else if (normSchoolJenjang.includes('MTS') || normSchoolJenjang.includes('SMP')) {
		jenjang = 'MTS';
	} else if (normSchoolJenjang.includes('MA') || normSchoolJenjang.includes('SMA') || normSchoolJenjang.includes('SMK')) {
		jenjang = 'MA';
	} else if (/\b(MIS|MIN|MI|IBTIDAIYAH)\b/i.test(normSchoolName)) {
		jenjang = 'MI';
	} else if (/\b(MTS|MTSN|TSANAWIYAH)\b/i.test(normSchoolName)) {
		jenjang = 'MTS';
	} else if (/\b(MAS|MAN|MA|ALIYAH)\b/i.test(normSchoolName)) {
		jenjang = 'MA';
	}

	// 2. Ekstrak Tingkat Kelas (Grade)
	let grade = 0;
	const combined = `${normClassLevel} ${normClassName}`.toUpperCase();

	if (/\b(XII|12)\b/.test(combined)) {
		grade = 12;
		if (!normSchoolJenjang && !normSchoolName) jenjang = 'MA';
	} else if (/\b(XI|11)\b/.test(combined)) {
		grade = 11;
		if (!normSchoolJenjang && !normSchoolName) jenjang = 'MA';
	} else if (/\b(X|10)\b/.test(combined)) {
		grade = 10;
		if (!normSchoolJenjang && !normSchoolName) jenjang = 'MA';
	} else if (/\b(IX|9)\b/.test(combined)) {
		grade = 9;
		if (!normSchoolJenjang && !normSchoolName) jenjang = 'MTS';
	} else if (/\b(VIII|8)\b/.test(combined)) {
		grade = 8;
		if (!normSchoolJenjang && !normSchoolName) jenjang = 'MTS';
	} else if (/\b(VII|7)\b/.test(combined)) {
		grade = 7;
		if (!normSchoolJenjang && !normSchoolName) jenjang = 'MTS';
	} else if (/\b(VI|6)\b/.test(combined)) {
		grade = 6;
		if (!normSchoolJenjang && !normSchoolName) jenjang = 'MI';
	} else if (/\b(V|5)\b/.test(combined)) {
		grade = 5;
		if (!normSchoolJenjang && !normSchoolName) jenjang = 'MI';
	} else if (/\b(IV|4)\b/.test(combined)) {
		grade = 4;
		if (!normSchoolJenjang && !normSchoolName) jenjang = 'MI';
	} else if (/\b(III|3)\b/.test(combined)) {
		grade = 3;
		if (!normSchoolJenjang && !normSchoolName) jenjang = 'MI';
	} else if (/\b(II|2)\b/.test(combined)) {
		grade = 2;
		if (!normSchoolJenjang && !normSchoolName) jenjang = 'MI';
	} else if (/\b(I|1)\b/.test(combined)) {
		grade = 1;
		if (!normSchoolJenjang && !normSchoolName) jenjang = 'MI';
	}

	// 3. Fallback konsistensi jenjang & grade
	if (jenjang === 'MI') {
		if (grade < 1 || grade > 6) grade = 6;
	} else if (jenjang === 'MTS') {
		if (grade < 7 || grade > 9) grade = 7;
	} else if (jenjang === 'MA') {
		if (grade < 10 || grade > 12) grade = 10;
	}

	return {
		jenjang,
		grade,
		displayGrade: `Kelas ${grade}`
	};
}

// ==========================================
// FUNGSI GET BANK SOAL SESUAI JENJANG & KELAS
// ==========================================
export function getSimulationQuestionsForStudent(
	jenjang: 'MI' | 'MTS' | 'MA',
	grade: number
): SimulationQuestion[] {
	if (jenjang === 'MI') {
		// Siswa MI mendapatkan 15 nomor lengkap mencakup seluruh mapel wajib
		return MI_QUESTIONS_UPPER;
	}

	if (jenjang === 'MTS') {
		// Siswa kelas 7 tidak bisa mengerjakan soal kelas 8 atau 9
		if (grade === 8) {
			return MTS_QUESTIONS_GRADE_8;
		}
		if (grade === 9) {
			return MTS_QUESTIONS_GRADE_9;
		}
		// Default Kelas 7
		return MTS_QUESTIONS_GRADE_7;
	}

	if (jenjang === 'MA') {
		if (grade === 11) {
			return MA_QUESTIONS_GRADE_11;
		}
		if (grade === 12) {
			return MA_QUESTIONS_GRADE_12;
		}
		return MA_QUESTIONS_GRADE_10;
	}

	return MTS_QUESTIONS_GRADE_7;
}

// Fallback legacy export
export const SIMULATION_QUESTIONS: SimulationQuestion[] = MTS_QUESTIONS_GRADE_7;
