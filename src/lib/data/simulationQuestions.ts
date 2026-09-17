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

// =========================================================================
// 1. BANK SOAL SIMULASI MI KELAS 1 (15 NOMOR)
// Meliputi: Bahasa Arab, Matematika, IPA, IPS, Bahasa Indonesia, Akidah Akhlak, SKI, Fikih, Al-Qur'an Hadis
// =========================================================================
export const MI_QUESTIONS_GRADE_1: SimulationQuestion[] = [
	{
		id: 1101,
		type: 'pilihan_ganda',
		subject: "Al-Qur'an Hadis",
		jenjang: 'MI',
		grade: 1,
		question_text: '<p>Huruf hijaiyah <strong>بَ</strong> jika diberi tanda baca fathah dibaca...</p>',
		question_number: 1,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Ba' },
			{ key: 'B', text: 'Bi' },
			{ key: 'C', text: 'Bu' },
			{ key: 'D', text: 'Ban' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'Huruf Ba dengan tanda fathah di atasnya dibaca "Ba".'
	},
	{
		id: 1102,
		type: 'pilihan_ganda',
		subject: 'Akidah Akhlak',
		jenjang: 'MI',
		grade: 1,
		question_text: '<p>Dua kalimat syahadat berbunyi <em>"Asyhadu an laa ilaaha illallaah..."</em> artinya bersaksi bahwa tidak ada Tuhan selain...</p>',
		question_number: 2,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Allah SWT' },
			{ key: 'B', text: 'Malaikat' },
			{ key: 'C', text: 'Nabi' },
			{ key: 'D', text: 'Matahari' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'Syahadat tauhid bermakna tiada sesembahan yang berhak disembah selain Allah SWT.'
	},
	{
		id: 1103,
		type: 'pilihan_ganda',
		subject: 'Fikih',
		jenjang: 'MI',
		grade: 1,
		question_text: '<p>Shalat fardhu yang dikerjakan pada pagi hari sebelum terbit matahari sebanyak dua rakaat adalah shalat...</p>',
		question_number: 3,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Subuh' },
			{ key: 'B', text: 'Dzuhur' },
			{ key: 'C', text: 'Ashar' },
			{ key: 'D', text: 'Maghrib' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'Shalat Subuh berjumlah dua rakaat pada waktu fajar subuh.'
	},
	{
		id: 1104,
		type: 'pilihan_ganda',
		subject: 'SKI',
		jenjang: 'MI',
		grade: 1,
		question_text: '<p>Nabi dan Rasul terakhir yang menjadi teladan dan panutan kita semua adalah Nabi...</p>',
		question_number: 4,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Muhammad SAW' },
			{ key: 'B', text: 'Ibrahim AS' },
			{ key: 'C', text: 'Musa AS' },
			{ key: 'D', text: 'Adam AS' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'Nabi Muhammad SAW adalah nabi dan rasul terakhir penutup para nabi (Khatamul Anbiya).'
	},
	{
		id: 1105,
		type: 'pilihan_ganda',
		subject: 'Bahasa Arab',
		jenjang: 'MI',
		grade: 1,
		question_text: '<p>Angka satu (1) dalam bahasa Arab adalah...</p>',
		question_number: 5,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'وَاحِدٌ (Wahidun)' },
			{ key: 'B', text: 'اِثْنَانِ (Itsnani)' },
			{ key: 'C', text: 'ثَلَاثَةٌ (Tsalatsatun)' },
			{ key: 'D', text: 'أَرْبَعَةٌ (Arba\'atun)' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'وَاحِدٌ (Wahidun) artinya satu.'
	},
	{
		id: 1106,
		type: 'pilihan_ganda',
		subject: 'Bahasa Indonesia',
		jenjang: 'MI',
		grade: 1,
		question_text: '<p>Huruf vokal yang terdapat pada kata <strong>"BUKU"</strong> adalah huruf...</p>',
		question_number: 6,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'u' },
			{ key: 'B', text: 'b' },
			{ key: 'C', text: 'k' },
			{ key: 'D', text: 'm' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'Huruf vokal ada 5: a, i, u, e, o. Pada kata "buku", huruf vokalnya adalah u.'
	},
	{
		id: 1107,
		type: 'pilihan_ganda',
		subject: 'Matematika',
		jenjang: 'MI',
		grade: 1,
		question_text: '<p>Di meja ada 8 pensil warna. Kakak menaruh lagi 5 pensil warna. Berapa jumlah semua pensil warna sekarang?</p>',
		question_number: 7,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: '13' },
			{ key: 'B', text: '12' },
			{ key: 'C', text: '14' },
			{ key: 'D', text: '11' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: '8 + 5 = 13 pensil warna.'
	},
	{
		id: 1108,
		type: 'pilihan_ganda',
		subject: 'IPA',
		jenjang: 'MI',
		grade: 1,
		question_text: '<p>Bagian tubuh kita yang berguna untuk mendengarkan suara bel madrasah berbunyi adalah...</p>',
		question_number: 8,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Telinga' },
			{ key: 'B', text: 'Mata' },
			{ key: 'C', text: 'Hidung' },
			{ key: 'D', text: 'Lidah' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'Telinga adalah panca indra untuk mendengar bunyi.'
	},
	{
		id: 1109,
		type: 'pilihan_ganda',
		subject: 'IPS',
		jenjang: 'MI',
		grade: 1,
		question_text: '<p>Orang tua perempuan yang melahirkan, menyayangi, dan merawat kita di rumah disebut...</p>',
		question_number: 9,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Ibu' },
			{ key: 'B', text: 'Bibi' },
			{ key: 'C', text: 'Kakak' },
			{ key: 'D', text: 'Nenek' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'Ibu adalah orang tua perempuan yang merawat dan mengasuh kita.'
	},
	{
		id: 1110,
		type: 'pilihan_ganda_kompleks',
		subject: "Al-Qur'an Hadis",
		jenjang: 'MI',
		grade: 1,
		question_text: '<p>Kalimat thayyibah yang kita ucapkan <strong>sebelum makan</strong> dan <strong>setelah selesai makan</strong> adalah... <em>(Pilih 2 jawaban)</em></p>',
		question_number: 10,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Bismillah (sebelum makan)' },
			{ key: 'B', text: 'Alhamdulillah (setelah makan)' },
			{ key: 'C', text: 'Innalillahi' },
			{ key: 'D', text: 'Astaghfirullah' }
		]),
		correct_answer: '["A","B"]',
		points: 7,
		explanation: 'Sebelum makan membaca Bismillah, sesudah makan bersyukur dengan Alhamdulillah.'
	},
	{
		id: 1111,
		type: 'pilihan_ganda_kompleks',
		subject: 'IPA',
		jenjang: 'MI',
		grade: 1,
		question_text: '<p>Benda-benda di sekitar kita berikut ini yang memiliki bentuk <strong>lingkaran</strong> adalah... <em>(Pilih 2 jawaban)</em></p>',
		question_number: 11,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Uang koin logam' },
			{ key: 'B', text: 'Roda sepeda' },
			{ key: 'C', text: 'Buku tulis' },
			{ key: 'D', text: 'Pintu kelas' }
		]),
		correct_answer: '["A","B"]',
		points: 7,
		explanation: 'Uang koin dan roda sepeda berbentuk lingkaran.'
	},
	{
		id: 1112,
		type: 'benar_salah',
		subject: 'Fikih',
		jenjang: 'MI',
		grade: 1,
		question_text: '<p>Tentukan apakah pernyataan jumlah rakaat shalat fardhu berikut <strong>Benar</strong> atau <strong>Salah</strong>:</p>',
		question_number: 12,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ id: '1', statement: 'Shalat Subuh terdiri dari 2 rakaat.' },
			{ id: '2', statement: 'Shalat Maghrib terdiri dari 4 rakaat.' }
		]),
		correct_answer: '{"1":"benar","2":"salah"}',
		points: 7,
		explanation: 'Shalat Subuh 2 rakaat (Benar). Shalat Maghrib 3 rakaat bukan 4 (Salah).'
	},
	{
		id: 1113,
		type: 'menjodohkan',
		subject: 'Bahasa Arab',
		jenjang: 'MI',
		grade: 1,
		question_text: '<p>Jodohkan panggilan keluarga dalam bahasa Arab dengan artinya:</p>',
		question_number: 13,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify({
			left: [
				{ key: '1', text: 'أَبٌ (Abun)' },
				{ key: '2', text: 'أُمٌّ (Ummun)' },
				{ key: '3', text: 'أَخٌ (Akhun)' }
			],
			right: [
				{ key: 'A', text: 'Ayah' },
				{ key: 'B', text: 'Ibu' },
				{ key: 'C', text: 'Saudara Laki-laki' }
			]
		}),
		correct_answer: '{"1":"A","2":"B","3":"C"}',
		points: 7,
		explanation: 'Abun = Ayah, Ummun = Ibu, Akhun = Saudara laki-laki.'
	},
	{
		id: 1114,
		type: 'isian_singkat',
		subject: 'Matematika',
		jenjang: 'MI',
		grade: 1,
		question_text: '<p>Berapa hasil dari <strong>15 - 6</strong>? <em>(Tuliskan angka jawabannya saja)</em></p>',
		question_number: 14,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: null,
		correct_answer: '9',
		points: 7,
		explanation: '15 dikurangi 6 sama dengan 9.'
	},
	{
		id: 1115,
		type: 'essay',
		subject: 'Akidah Akhlak',
		jenjang: 'MI',
		grade: 1,
		question_text: '<p>Tuliskan contoh perbuatan patuh dan hormat kepada ayah dan ibu ketika berada di rumah!</p>',
		question_number: 15,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: null,
		correct_answer: 'Mendengarkan nasehat orang tua, mencium tangan saat pamit, dan membantu merapikan mainan.',
		points: 7,
		explanation: 'Sikap sopan, patuh, dan membantu orang tua adalah akhlak mulia anak sholeh.'
	}
];

// =========================================================================
// 2. BANK SOAL SIMULASI MI KELAS 2 (15 NOMOR)
// Meliputi: Bahasa Arab, Matematika, IPA, IPS, Bahasa Indonesia, Akidah Akhlak, SKI, Fikih, Al-Qur'an Hadis
// =========================================================================
export const MI_QUESTIONS_GRADE_2: SimulationQuestion[] = [
	{
		id: 1201,
		type: 'pilihan_ganda',
		subject: "Al-Qur'an Hadis",
		jenjang: 'MI',
		grade: 2,
		question_text: '<p>Surah An-Nas dan Surah Al-Falaq disebut juga <em>Al-Mu\'awwidzatain</em> yang diturunkan untuk memohon perlindungan kepada Allah dari...</p>',
		question_number: 1,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Segala macam kejahatan makhluk dan godaan setan' },
			{ key: 'B', text: 'Rasa lapar dan haus semata' },
			{ key: 'C', text: 'Hujan deras dan petir' },
			{ key: 'D', text: 'Rasa kantuk di siang hari' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'Al-Mu\'awwidzatain adalah dua surah perlindungan dari kejahatan malam, sihir, hasad, dan bisikan setan.'
	},
	{
		id: 1202,
		type: 'pilihan_ganda',
		subject: 'Akidah Akhlak',
		jenjang: 'MI',
		grade: 2,
		question_text: '<p>Allah SWT memiliki Asmaul Husna <strong>Al-Khaliq</strong>, yang artinya Allah Maha...</p>',
		question_number: 2,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Pencipta seluruh alam semesta' },
			{ key: 'B', text: 'Mendengar' },
			{ key: 'C', text: 'Melihat' },
			{ key: 'D', text: 'Merajai' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'Al-Khaliq bermakna Allah Maha Pencipta segala sesuatu.'
	},
	{
		id: 1203,
		type: 'pilihan_ganda',
		subject: 'Fikih',
		jenjang: 'MI',
		grade: 2,
		question_text: '<p>Hal yang dapat membatalkan wudhu seorang muslim adalah...</p>',
		question_number: 3,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Buang air kecil atau buang angin (kentut)' },
			{ key: 'B', text: 'Minum segelas air putih' },
			{ key: 'C', text: 'Berbicara sopan kepada guru' },
			{ key: 'D', text: 'Tersenyum ramah kepada teman' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'Keluarnya sesuatu dari qubul dan dubur membatalkan wudhu.'
	},
	{
		id: 1204,
		type: 'pilihan_ganda',
		subject: 'SKI',
		jenjang: 'MI',
		grade: 2,
		question_text: '<p>Ketika masih bayi, Nabi Muhammad SAW diasuh dan disusui oleh seorang ibu yang baik hati dari perkampungan Bani Sa\'ad bernama...</p>',
		question_number: 4,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Halimah As-Sa\'diyah' },
			{ key: 'B', text: 'Ummu Aiman' },
			{ key: 'C', text: 'Fatimah binti Asad' },
			{ key: 'D', text: 'Khadijah' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'Ibu susuan Nabi Muhammad SAW adalah Halimah As-Sa\'diyah.'
	},
	{
		id: 1205,
		type: 'pilihan_ganda',
		subject: 'Bahasa Arab',
		jenjang: 'MI',
		grade: 2,
		question_text: '<p>Perhatikan gambar dan kata berikut: <strong>مِسْطَرَةٌ</strong>. Benda perlengkapan sekolah ini adalah...</p>',
		question_number: 5,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Penggaris' },
			{ key: 'B', text: 'Buku tulis' },
			{ key: 'C', text: 'Kotak pensil' },
			{ key: 'D', text: 'Tas sekolah' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'مِسْطَرَةٌ (Misthorotun) berarti penggaris.'
	},
	{
		id: 1206,
		type: 'pilihan_ganda',
		subject: 'Bahasa Indonesia',
		jenjang: 'MI',
		grade: 2,
		question_text: '<p>Penulisan huruf kapital yang tepat di awal nama orang dan awal kalimat adalah...</p>',
		question_number: 6,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Ahmad dan Yusuf membaca Al-Qur\'an di serambi masjid.' },
			{ key: 'B', text: 'ahmad dan yusuf membaca al-qur\'an di serambi masjid.' },
			{ key: 'C', text: 'Ahmad Dan Yusuf Membaca Al-qur\'an di serambi masjid.' },
			{ key: 'D', text: 'ahmad Dan yusuf Membaca Al-Qur\'an di serambi masjid.' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'Awal kalimat dan nama orang wajib menggunakan huruf kapital (Ahmad, Yusuf).'
	},
	{
		id: 1207,
		type: 'pilihan_ganda',
		subject: 'Matematika',
		jenjang: 'MI',
		grade: 2,
		question_text: '<p>Berapa hasil dari <strong>4 × 5</strong>?</p>',
		question_number: 7,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: '20' },
			{ key: 'B', text: '16' },
			{ key: 'C', text: '24' },
			{ key: 'D', text: '25' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: '4 × 5 = 5 + 5 + 5 + 5 = 20.'
	},
	{
		id: 1208,
		type: 'pilihan_ganda',
		subject: 'IPA',
		jenjang: 'MI',
		grade: 2,
		question_text: '<p>Hewan dan tumbuhan membutuhkan air dan makanan agar dapat bertahan hidup. Hal ini membuktikan bahwa makhluk hidup mengalami proses...</p>',
		question_number: 8,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Pertumbuhan dan perkembangan' },
			{ key: 'B', text: 'Pembekuan' },
			{ key: 'C', text: 'Penguapan' },
			{ key: 'D', text: 'Pencairan' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'Makanan dan air diperlukan untuk tumbuh kembang makhluk hidup.'
	},
	{
		id: 1209,
		type: 'pilihan_ganda',
		subject: 'IPS',
		jenjang: 'MI',
		grade: 2,
		question_text: '<p>Ketika tetangga sebelah rumah sedang tertimpa musibah sakit, sikap terpuji yang harus kita lakukan adalah...</p>',
		question_number: 9,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Menjenguk dan mendoakan kesembuhannya' },
			{ key: 'B', text: 'Membuat suara bising di depan rumahnya' },
			{ key: 'C', text: 'Masa bodoh dan pura-pura tidak kenal' },
			{ key: 'D', text: 'Menertawakan kemalangannya' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'Menjenguk orang sakit dan mendoakan adalah adab hidup bertetangga.'
	},
	{
		id: 1210,
		type: 'pilihan_ganda_kompleks',
		subject: 'Fikih',
		jenjang: 'MI',
		grade: 2,
		question_text: '<p>Bagian anggota tubuh yang <strong>wajib dibasuh (rukun)</strong> saat berwudhu adalah... <em>(Pilih 2 jawaban)</em></p>',
		question_number: 10,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Membasuh seluruh wajah (muka)' },
			{ key: 'B', text: 'Membasuh kedua tangan sampai siku' },
			{ key: 'C', text: 'Membasuh perut' },
			{ key: 'D', text: 'Membasuh leher' }
		]),
		correct_answer: '["A","B"]',
		points: 7,
		explanation: 'Rukun wudhu mencakup membasuh muka dan kedua tangan sampai siku.'
	},
	{
		id: 1211,
		type: 'pilihan_ganda_kompleks',
		subject: 'IPA',
		jenjang: 'MI',
		grade: 2,
		question_text: '<p>Hewan-hewan berikut yang berkembang biak dengan cara <strong>bertelur</strong> adalah... <em>(Pilih 2 jawaban)</em></p>',
		question_number: 11,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Ayam' },
			{ key: 'B', text: 'Bebek' },
			{ key: 'C', text: 'Kucing' },
			{ key: 'D', text: 'Sapi' }
		]),
		correct_answer: '["A","B"]',
		points: 7,
		explanation: 'Ayam dan bebek berkembang biak secara ovipar (bertelur).'
	},
	{
		id: 1212,
		type: 'benar_salah',
		subject: 'Fikih',
		jenjang: 'MI',
		grade: 2,
		question_text: '<p>Tentukan status kebenaran (<strong>Benar</strong> atau <strong>Salah</strong>) syarat sah shalat berikut:</p>',
		question_number: 12,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ id: '1', statement: 'Menghadap ke arah kiblat merupakan syarat sah shalat.' },
			{ id: '2', statement: 'Makan dan minum sambil shalat tidak membatalkan shalat.' }
		]),
		correct_answer: '{"1":"benar","2":"salah"}',
		points: 7,
		explanation: 'Menghadap kiblat syarat sah shalat (Benar). Makan minum membatalkan shalat (Salah).'
	},
	{
		id: 1213,
		type: 'menjodohkan',
		subject: 'Bahasa Arab',
		jenjang: 'MI',
		grade: 2,
		question_text: '<p>Jodohkan nama warna dalam bahasa Arab dengan artinya:</p>',
		question_number: 13,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify({
			left: [
				{ key: '1', text: 'أَبْيَضُ (Abyadhu)' },
				{ key: '2', text: 'أَسْوَدُ (Aswadu)' },
				{ key: '3', text: 'أَحْمَرُ (Ahmaru)' }
			],
			right: [
				{ key: 'A', text: 'Putih' },
				{ key: 'B', text: 'Hitam' },
				{ key: 'C', text: 'Merah' }
			]
		}),
		correct_answer: '{"1":"A","2":"B","3":"C"}',
		points: 7,
		explanation: 'Abyadhu = Putih, Aswadu = Hitam, Ahmaru = Merah.'
	},
	{
		id: 1214,
		type: 'isian_singkat',
		subject: 'Matematika',
		jenjang: 'MI',
		grade: 2,
		question_text: '<p>Jarum panjang menunjuk angka 12 dan jarum pendek menunjuk angka 4. Jam tersebut menunjukkan pukul ... <em>(Tuliskan angka jamnya saja)</em></p>',
		question_number: 14,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: null,
		correct_answer: '4',
		points: 7,
		explanation: 'Jarum pendek ke 4 dan jarum panjang ke 12 menunjukkan tepat pukul 4.'
	},
	{
		id: 1215,
		type: 'essay',
		subject: 'Akidah Akhlak',
		jenjang: 'MI',
		grade: 2,
		question_text: '<p>Mengapa kita tidak boleh berbohong dan harus selalu berkata jujur kepada guru dan orang tua?</p>',
		question_number: 15,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: null,
		correct_answer: 'Karena jujur disukai Allah, membawa ketenangan hati, dan membuat orang tua serta guru percaya kepada kita.',
		points: 7,
		explanation: 'Jujur adalah sifat terpuji para nabi yang mendatangkan berkah dan ridha Allah.'
	}
];

// =========================================================================
// 3. BANK SOAL SIMULASI MI KELAS 3 (15 NOMOR)
// Meliputi: Bahasa Arab, Matematika, IPA, IPS, Bahasa Indonesia, Akidah Akhlak, SKI, Fikih, Al-Qur'an Hadis
// =========================================================================
export const MI_QUESTIONS_GRADE_3: SimulationQuestion[] = [
	{
		id: 1301,
		type: 'pilihan_ganda',
		subject: "Al-Qur'an Hadis",
		jenjang: 'MI',
		grade: 3,
		question_text: '<p>Huruf-huruf Mad Thabi\'i (Mad Asli) dalam kaidah tajwid Al-Qur\'an terdiri dari 3 huruf yaitu...</p>',
		question_number: 1,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Alif, Wawu, dan Ya (ا, و, ي)' },
			{ key: 'B', text: 'Ba, Ta, dan Tsa' },
			{ key: 'C', text: 'Kaf, Lam, dan Mim' },
			{ key: 'D', text: 'Hamzah, Ha, dan Kha' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'Huruf Mad Thabi\'i adalah alif sukun setelah fathah, wawu sukun setelah dhammah, dan ya sukun setelah kasrah.'
	},
	{
		id: 1302,
		type: 'pilihan_ganda',
		subject: 'Akidah Akhlak',
		jenjang: 'MI',
		grade: 3,
		question_text: '<p>Allah SWT memiliki sifat wajib <strong>Qidam</strong>, yang artinya Allah Maha...</p>',
		question_number: 2,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Terdahulu (ada tanpa permulaan)' },
			{ key: 'B', text: 'Kekal abadi' },
			{ key: 'C', text: 'Maha Kuasa' },
			{ key: 'D', text: 'Maha Mendengar' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'Qidam artinya terdahulu, ada sebelum segala sesuatu tercipta tanpa permulaan.'
	},
	{
		id: 1303,
		type: 'pilihan_ganda',
		subject: 'Fikih',
		jenjang: 'MI',
		grade: 3,
		question_text: '<p>Shalat sunnah yang dikerjakan sebelum shalat fardhu Subuh memiliki keutamaan yang sangat besar, shalat sunnah ini disebut rawatib...</p>',
		question_number: 3,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Qabliyah Subuh' },
			{ key: 'B', text: 'Ba\'diyah Subuh' },
			{ key: 'C', text: 'Tarawih' },
			{ key: 'D', text: 'Witir' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'Shalat dua rakaat qabliyah subuh lebih baik daripada dunia dan seisinya.'
	},
	{
		id: 1304,
		type: 'pilihan_ganda',
		subject: 'SKI',
		jenjang: 'MI',
		grade: 3,
		question_text: '<p>Sejak usia muda, Nabi Muhammad SAW dikenal memiliki kepribadian yang sangat jujur dan amanah sehingga penduduk kota Makkah memberinya gelar...</p>',
		question_number: 4,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Al-Amin' },
			{ key: 'B', text: 'As-Shiddiq' },
			{ key: 'C', text: 'Al-Faruq' },
			{ key: 'D', text: 'Dzulqarnain' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'Al-Amin artinya orang yang dapat dipercaya.'
	},
	{
		id: 1305,
		type: 'pilihan_ganda',
		subject: 'Bahasa Arab',
		jenjang: 'MI',
		grade: 3,
		question_text: '<p>Perhatikan kata anggota tubuh berikut: <strong>رَأْسٌ</strong>. Anggota tubuh yang dimaksud adalah...</p>',
		question_number: 5,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Kepala' },
			{ key: 'B', text: 'Mata' },
			{ key: 'C', text: 'Tangan' },
			{ key: 'D', text: 'Kaki' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'رَأْسٌ (Ra\'sun) berarti kepala.'
	},
	{
		id: 1306,
		type: 'pilihan_ganda',
		subject: 'Bahasa Indonesia',
		jenjang: 'MI',
		grade: 3,
		question_text: '<p>Cerita dongeng fiksi yang menceritakan kehidupan hewan-hewan yang bertingkah laku dan berbicara seperti manusia dinamakan...</p>',
		question_number: 6,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Fabel' },
			{ key: 'B', text: 'Mite' },
			{ key: 'C', text: 'Legenda' },
			{ key: 'D', text: 'Sage' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'Fabel adalah cerita rakyat yang tokoh-tokohnya diperankan oleh binatang.'
	},
	{
		id: 1307,
		type: 'pilihan_ganda',
		subject: 'Matematika',
		jenjang: 'MI',
		grade: 3,
		question_text: '<p>Sebuah semangka dibelah menjadi 8 potong sama besar. Fatimah memakan 3 potong semangka. Bagian semangka yang dimakan Fatimah dinyatakan dalam pecahan adalah...</p>',
		question_number: 7,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: '3/8' },
			{ key: 'B', text: '1/8' },
			{ key: 'C', text: '5/8' },
			{ key: 'D', text: '3/5' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: '3 potong dari total 8 potong semangka ditulis 3/8.'
	},
	{
		id: 1308,
		type: 'pilihan_ganda',
		subject: 'IPA',
		jenjang: 'MI',
		grade: 3,
		question_text: '<p>Perubahan wujud benda dari cair menjadi padat, seperti air yang dimasukkan ke dalam freezer kulkas, dinamakan peristiwa...</p>',
		question_number: 8,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Membeku' },
			{ key: 'B', text: 'Mencair' },
			{ key: 'C', text: 'Menguap' },
			{ key: 'D', text: 'Menyublim' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'Cair menjadi padat dinamakan membeku.'
	},
	{
		id: 1309,
		type: 'pilihan_ganda',
		subject: 'IPS',
		jenjang: 'MI',
		grade: 3,
		question_text: '<p>Gambar sederhana yang menunjukkan tata letak ruang kelas, kantor guru, dan perpustakaan di madrasah dinamakan...</p>',
		question_number: 9,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Denah' },
			{ key: 'B', text: 'Foto' },
			{ key: 'C', text: 'Lukisan' },
			{ key: 'D', text: 'Kaligrafi' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'Denah menggambarkan tata letak ruangan atau tempat tertentu.'
	},
	{
		id: 1310,
		type: 'pilihan_ganda_kompleks',
		subject: "Al-Qur'an Hadis",
		jenjang: 'MI',
		grade: 3,
		question_text: '<p>Rasulullah SAW bersabda: <em>"Kebersihan itu sebagian dari iman"</em>. Tindakan nyata menjaga kebersihan di lingkungan madrasah adalah... <em>(Pilih 2 jawaban)</em></p>',
		question_number: 10,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Membuang bungkus makanan ke tempat sampah' },
			{ key: 'B', text: 'Melaksanakan piket menyapu kelas bersama teman' },
			{ key: 'C', text: 'Menyimpan sampah di laci meja kelas' },
			{ key: 'D', text: 'Mencoret-coret meja madrasah dengan spidol' }
		]),
		correct_answer: '["A","B"]',
		points: 7,
		explanation: 'Membuang sampah pada tempatnya dan rajin piket membersihkan kelas.'
	},
	{
		id: 1311,
		type: 'pilihan_ganda_kompleks',
		subject: 'IPA',
		jenjang: 'MI',
		grade: 3,
		question_text: '<p>Benda-benda berikut yang <strong>dapat ditarik oleh gaya magnet</strong> adalah... <em>(Pilih 2 jawaban)</em></p>',
		question_number: 11,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Paku besi' },
			{ key: 'B', text: 'Klip kertas dari logam' },
			{ key: 'C', text: 'Penggaris plastik' },
			{ key: 'D', text: 'Buku tulis kertas' }
		]),
		correct_answer: '["A","B"]',
		points: 7,
		explanation: 'Benda magnetis yang terbuat dari besi/baja dapat ditarik magnet.'
	},
	{
		id: 1312,
		type: 'benar_salah',
		subject: 'Fikih',
		jenjang: 'MI',
		grade: 3,
		question_text: '<p>Tentukan status kebenaran (<strong>Benar</strong> atau <strong>Salah</strong>) mengenai shalat berjamaah:</p>',
		question_number: 12,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ id: '1', statement: 'Pahala shalat berjamaah dilipatgandakan 27 derajat dibanding shalat sendirian (munfarid).' },
			{ id: '2', statement: 'Makmum diperbolehkan mendahului gerakan ruku\' dan sujud imam.' }
		]),
		correct_answer: '{"1":"benar","2":"salah"}',
		points: 7,
		explanation: 'Pahala shalat jamaah 27 derajat (Benar). Makmum haram mendahului gerakan imam (Salah).'
	},
	{
		id: 1313,
		type: 'menjodohkan',
		subject: 'Bahasa Arab',
		jenjang: 'MI',
		grade: 3,
		question_text: '<p>Jodohkan nama anggota tubuh bahasa Arab berikut dengan artinya:</p>',
		question_number: 13,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify({
			left: [
				{ key: '1', text: 'عَيْنٌ (\'Ainun)' },
				{ key: '2', text: 'أَنْفٌ (Anfun)' },
				{ key: '3', text: 'يَدٌ (Yadun)' }
			],
			right: [
				{ key: 'A', text: 'Mata' },
				{ key: 'B', text: 'Hidung' },
				{ key: 'C', text: 'Tangan' }
			]
		}),
		correct_answer: '{"1":"A","2":"B","3":"C"}',
		points: 7,
		explanation: '\'Ainun = Mata, Anfun = Hidung, Yadun = Tangan.'
	},
	{
		id: 1314,
		type: 'isian_singkat',
		subject: 'Matematika',
		jenjang: 'MI',
		grade: 3,
		question_text: '<p>Sebuah persegi memiliki panjang sisi 6 cm. Keliling persegi tersebut adalah ... cm. <em>(Tuliskan angka jawabannya saja)</em></p>',
		question_number: 14,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: null,
		correct_answer: '24',
		points: 7,
		explanation: 'Keliling persegi = 4 × sisi = 4 × 6 = 24 cm.'
	},
	{
		id: 1315,
		type: 'essay',
		subject: 'Akidah Akhlak',
		jenjang: 'MI',
		grade: 3,
		question_text: '<p>Jelaskan mengapa seorang murid madrasah tidak boleh menyontek saat mengerjakan ulangan atau ujian!</p>',
		question_number: 15,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: null,
		correct_answer: 'Karena menyontek adalah perbuatan curang yang berdosa, dilarang oleh Allah dan Rasulullah, serta merugikan diri sendiri dan orang lain.',
		points: 7,
		explanation: 'Menyontek melanggar nilai kejujuran dan amanah dalam Islam.'
	}
];

// =========================================================================
// 4. BANK SOAL SIMULASI MI KELAS 4 (15 NOMOR)
// Meliputi: Bahasa Arab, Matematika, IPA, IPS, Bahasa Indonesia, Akidah Akhlak, SKI, Fikih, Al-Qur'an Hadis
// =========================================================================
export const MI_QUESTIONS_GRADE_4: SimulationQuestion[] = [
	{
		id: 1401,
		type: 'pilihan_ganda',
		subject: "Al-Qur'an Hadis",
		jenjang: 'MI',
		grade: 4,
		question_text: '<p>Hukum bacaan nun sukun (نْ) bertemu huruf Ba (ب) yang dibaca dengan mengubah bunyi huruf nun menjadi mim sukun disertai dengung disebut hukum...</p>',
		question_number: 1,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Iqlab' },
			{ key: 'B', text: 'Idzhar Halqi' },
			{ key: 'C', text: 'Idgham Bighunnah' },
			{ key: 'D', text: 'Ikhfa Haqiqi' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'Iqlab terjadi apabila nun sukun atau tanwin bertemu huruf ba.'
	},
	{
		id: 1402,
		type: 'pilihan_ganda',
		subject: 'Akidah Akhlak',
		jenjang: 'MI',
		grade: 4,
		question_text: '<p>Malaikat yang bertugas menyampaikan wahyu dari Allah SWT kepada para Nabi dan Rasul adalah Malaikat...</p>',
		question_number: 2,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Jibril' },
			{ key: 'B', text: 'Mikail' },
			{ key: 'C', text: 'Israfil' },
			{ key: 'D', text: 'Izrail' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'Malaikat Jibril adalah penyampai wahyu Allah SWT.'
	},
	{
		id: 1403,
		type: 'pilihan_ganda',
		subject: 'Fikih',
		jenjang: 'MI',
		grade: 4,
		question_text: '<p>Shalat fardhu yang wajib dikerjakan bagi setiap muslim laki-laki secara berjamaah di masjid pada hari Jumat sebagai pengganti shalat Dzuhur adalah...</p>',
		question_number: 3,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Shalat Jumat' },
			{ key: 'B', text: 'Shalat Duha' },
			{ key: 'C', text: 'Shalat Jenazah' },
			{ key: 'D', text: 'Shalat Hajat' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'Shalat Jumat dilaksanakan dua rakaat setelah dua khutbah pada waktu Dzuhur.'
	},
	{
		id: 1404,
		type: 'pilihan_ganda',
		subject: 'SKI',
		jenjang: 'MI',
		grade: 4,
		question_text: '<p>Keluarga muslim pertama yang mati syahid di Makkah demi mempertahankan keimanan kepada Allah SWT dari siksaan kaum kafir Quraisy adalah keluarga...</p>',
		question_number: 4,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Yasir dan Sumayyah' },
			{ key: 'B', text: 'Abu Bakar' },
			{ key: 'C', text: 'Umar bin Khattab' },
			{ key: 'D', text: 'Utsman bin Affan' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'Sumayyah dan suaminya Yasir adalah syahidah dan syahid pertama dalam sejarah Islam.'
	},
	{
		id: 1405,
		type: 'pilihan_ganda',
		subject: 'Bahasa Arab',
		jenjang: 'MI',
		grade: 4,
		question_text: '<p>Perhatikan kalimat: <strong>مَنْ هُوَ؟ ... هُوَ طَبِيْبٌ فِي الْمُسْتَشْفَى</strong>. Profesi yang dimaksud dalam kalimat tersebut adalah seorang...</p>',
		question_number: 5,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Dokter' },
			{ key: 'B', text: 'Guru' },
			{ key: 'C', text: 'Petani' },
			{ key: 'D', text: 'Polisi' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'طَبِيْبٌ (Thobibun) berarti dokter, bekerja di الْمُسْتَشْفَى (Rumah Sakit).'
	},
	{
		id: 1406,
		type: 'pilihan_ganda',
		subject: 'Bahasa Indonesia',
		jenjang: 'MI',
		grade: 4,
		question_text: '<p>Kalimat yang membutuhkan objek penderita agar maknanya menjadi jelas dan utuh disebut kalimat...</p>',
		question_number: 6,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Transitif' },
			{ key: 'B', text: 'Intransitif' },
			{ key: 'C', text: 'Perintah' },
			{ key: 'D', text: 'Tanya' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'Kalimat transitif memerlukan objek, contoh: "Ali membaca (predikat) buku (objek)".'
	},
	{
		id: 1407,
		type: 'pilihan_ganda',
		subject: 'Matematika',
		jenjang: 'MI',
		grade: 4,
		question_text: '<p>Faktor Persekutuan Terbesar (FPB) dari bilangan <strong>12 dan 18</strong> adalah...</p>',
		question_number: 7,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: '6' },
			{ key: 'B', text: '3' },
			{ key: 'C', text: '4' },
			{ key: 'D', text: '2' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'Faktor 12: 1, 2, 3, 4, 6, 12. Faktor 18: 1, 2, 3, 6, 9, 18. FPB = 6.'
	},
	{
		id: 1408,
		type: 'pilihan_ganda',
		subject: 'IPA',
		jenjang: 'MI',
		grade: 4,
		question_text: '<p>Bagian tumbuhan yang memiliki zat hijau daun (klorofil) dan berfungsi sebagai tempat terjadinya proses fotosintesis adalah...</p>',
		question_number: 8,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Daun' },
			{ key: 'B', text: 'Akar' },
			{ key: 'C', text: 'Batang' },
			{ key: 'D', text: 'Bunga' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'Fotosintesis utama tumbuhan berlangsung di organ daun yang mengandung klorofil.'
	},
	{
		id: 1409,
		type: 'pilihan_ganda',
		subject: 'IPS',
		jenjang: 'MI',
		grade: 4,
		question_text: '<p>Rumah adat khas suku Minangkabau di Sumatera Barat yang memiliki atap runcing bertingkat menyerupai tanduk kerbau adalah...</p>',
		question_number: 9,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Rumah Gadang' },
			{ key: 'B', text: 'Rumah Joglo' },
			{ key: 'C', text: 'Rumah Honai' },
			{ key: 'D', text: 'Rumah Tongkonan' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'Rumah Gadang adalah rumah tradisional suku Minangkabau.'
	},
	{
		id: 1410,
		type: 'pilihan_ganda_kompleks',
		subject: 'Akidah Akhlak',
		jenjang: 'MI',
		grade: 4,
		question_text: '<p>Malaikat yang bertugas <strong>mencatat seluruh amal baik dan amal buruk</strong> manusia selama hidup di dunia adalah... <em>(Pilih 2 jawaban)</em></p>',
		question_number: 10,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Malaikat Raqib (pencatat amal kebaikan)' },
			{ key: 'B', text: 'Malaikat Atid (pencatat amal keburukan)' },
			{ key: 'C', text: 'Malaikat Malik (penjaga neraka)' },
			{ key: 'D', text: 'Malaikat Ridwan (penjaga surga)' }
		]),
		correct_answer: '["A","B"]',
		points: 7,
		explanation: 'Raqib dan Atid senantiasa mengawasi dan mencatat perbuatan manusia.'
	},
	{
		id: 1411,
		type: 'pilihan_ganda_kompleks',
		subject: 'IPA',
		jenjang: 'MI',
		grade: 4,
		question_text: '<p>Berikut ini yang merupakan contoh <strong>simbiosis mutualisme</strong> (hubungan antarmakhluk hidup yang saling menguntungkan) adalah... <em>(Pilih 2 jawaban)</em></p>',
		question_number: 11,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Lebah yang mengisap nektar bunga sambil membantu penyerbukan' },
			{ key: 'B', text: 'Burung jalak yang memakan kutu pada tubuh kerbau' },
			{ key: 'C', text: 'Tanaman benalu yang hidup menempel pada pohon mangga' },
			{ key: 'D', text: 'Nyamuk yang menggigit dan mengisap darah manusia' }
		]),
		correct_answer: '["A","B"]',
		points: 7,
		explanation: 'Lebah-bunga dan burung jalak-kerbau saling menguntungkan kedua pihak.'
	},
	{
		id: 1412,
		type: 'benar_salah',
		subject: 'Fikih',
		jenjang: 'MI',
		grade: 4,
		question_text: '<p>Tentukan status kebenaran (<strong>Benar</strong> atau <strong>Salah</strong>) mengenai batas aurat dalam shalat:</p>',
		question_number: 12,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ id: '1', statement: 'Batas aurat laki-laki dalam shalat adalah antara pusar hingga lutut.' },
			{ id: '2', statement: 'Aurat perempuan dalam shalat meliputi seluruh tubuh kecuali wajah dan kedua telapak tangan.' }
		]),
		correct_answer: '{"1":"benar","2":"benar"}',
		points: 7,
		explanation: 'Kedua pernyataan mengenai batasan aurat laki-laki dan perempuan adalah benar.'
	},
	{
		id: 1413,
		type: 'menjodohkan',
		subject: 'Bahasa Arab',
		jenjang: 'MI',
		grade: 4,
		question_text: '<p>Jodohkan profesi dalam bahasa Arab berikut dengan artinya:</p>',
		question_number: 13,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify({
			left: [
				{ key: '1', text: 'مُدَرِّسٌ (Mudarrisun)' },
				{ key: '2', text: 'فَلَّاحٌ (Fallahun)' },
				{ key: '3', text: 'شُرْطِيٌّ (Syurthiyyun)' }
			],
			right: [
				{ key: 'A', text: 'Guru' },
				{ key: 'B', text: 'Petani' },
				{ key: 'C', text: 'Polisi' }
			]
		}),
		correct_answer: '{"1":"A","2":"B","3":"C"}',
		points: 7,
		explanation: 'Mudarrisun = Guru, Fallahun = Petani, Syurthiyyun = Polisi.'
	},
	{
		id: 1414,
		type: 'isian_singkat',
		subject: 'Matematika',
		jenjang: 'MI',
		grade: 4,
		question_text: '<p>Kelipatan Persekutuan Terkecil (KPK) dari bilangan <strong>4 dan 6</strong> adalah ... <em>(Tuliskan angka jawabannya saja)</em></p>',
		question_number: 14,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: null,
		correct_answer: '12',
		points: 7,
		explanation: 'Kelipatan 4: 4, 8, 12, 16... Kelipatan 6: 6, 12, 18... KPK = 12.'
	},
	{
		id: 1415,
		type: 'essay',
		subject: 'Akidah Akhlak',
		jenjang: 'MI',
		grade: 4,
		question_text: '<p>Jelaskan pengertian sikap rendah hati (<strong>Tawadhu\'</strong>) dan sebutkan satu contoh penerapannya ketika bergaul dengan teman di madrasah!</p>',
		question_number: 15,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: null,
		correct_answer: 'Tawadhu adalah sikap tidak menyombongkan diri meskipun memiliki kelebihan. Contoh: tidak memamerkan nilai tinggi dan mau berteman dengan siapa saja.',
		points: 7,
		explanation: 'Tawadhu merupakan lawan dari takabur yang sangat dicintai oleh Allah SWT.'
	}
];

// =========================================================================
// 5. BANK SOAL SIMULASI MI KELAS 5 (15 NOMOR)
// Meliputi: Bahasa Arab, Matematika, IPA, IPS, Bahasa Indonesia, Akidah Akhlak, SKI, Fikih, Al-Qur'an Hadis
// =========================================================================
export const MI_QUESTIONS_GRADE_5: SimulationQuestion[] = [
	{
		id: 1501,
		type: 'pilihan_ganda',
		subject: "Al-Qur'an Hadis",
		jenjang: 'MI',
		grade: 5,
		question_text: '<p>Hukum bacaan yang terjadi apabila huruf Mim Sukun (مْ) bertemu dengan huruf Mim (م) dinamakan hukum bacaan...</p>',
		question_number: 1,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Idgham Mimi (Idgham Mutamatsilain)' },
			{ key: 'B', text: 'Ikhfa Syafawi' },
			{ key: 'C', text: 'Idzhar Syafawi' },
			{ key: 'D', text: 'Iqlab' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'Mim sukun bertemu mim dibaca melebur disertai ghunnah (Idgham Mimi).'
	},
	{
		id: 1502,
		type: 'pilihan_ganda',
		subject: 'Akidah Akhlak',
		jenjang: 'MI',
		grade: 5,
		question_text: '<p>Peristiwa kebangkitan kembali seluruh umat manusia dari alam kubur setelah ditiupkannya sangkakala kedua dinamakan...</p>',
		question_number: 2,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Yaumul Ba\'ats' },
			{ key: 'B', text: 'Yaumul Hisab' },
			{ key: 'C', text: 'Yaumul Mizan' },
			{ key: 'D', text: 'Yaumul Jaza\'' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'Yaumul Ba\'ats adalah hari dibangkitkannya manusia dari kubur.'
	},
	{
		id: 1503,
		type: 'pilihan_ganda',
		subject: 'Fikih',
		jenjang: 'MI',
		grade: 5,
		question_text: '<p>Menahan diri dari makan, minum, serta segala hal yang membatalkan dari terbit fajar shadiq hingga terbenam matahari dengan niat beribadah adalah pengertian dari ibadah...</p>',
		question_number: 3,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Puasa (Shaum)' },
			{ key: 'B', text: 'I\'tikaf' },
			{ key: 'C', text: 'Zakat' },
			{ key: 'D', text: 'Haji' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'Pengertian puasa secara syariat adalah imsak dari terbit fajar sampai terbenam matahari.'
	},
	{
		id: 1504,
		type: 'pilihan_ganda',
		subject: 'SKI',
		jenjang: 'MI',
		grade: 5,
		question_text: '<p>Perjanjian setia yang dilakukan oleh penduduk Yatsrib kepada Nabi Muhammad SAW di bukit Aqabah sebelum peristiwa Hijrah dikenal dengan nama...</p>',
		question_number: 4,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Bai\'atul Aqabah' },
			{ key: 'B', text: 'Perjanjian Hudaibiyah' },
			{ key: 'C', text: 'Piagam Madinah' },
			{ key: 'D', text: 'Fathu Makkah' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'Bai\'atul Aqabah I dan II menjadi tonggak awal hijrah ke Madinah.'
	},
	{
		id: 1505,
		type: 'pilihan_ganda',
		subject: 'Bahasa Arab',
		jenjang: 'MI',
		grade: 5,
		question_text: '<p>Perhatikan kalimat berikut: <strong>أَنَا أَذْهَبُ إِلَى الْمَدْرَسَةِ فِي السَّاعَةِ السَّادِسَةِ وَالنِّصْفِ</strong>. Jam keberangkatan sekolah yang dimaksud adalah pukul...</p>',
		question_number: 5,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: '06.30 (Setengah tujuh pagi)' },
			{ key: 'B', text: '06.00 (Pukul enam tepat)' },
			{ key: 'C', text: '07.00 (Pukul tujuh tepat)' },
			{ key: 'D', text: '07.30 (Setengah delapan pagi)' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'السَّادِسَةِ (enam) وَالنِّصْفِ (lewat setengah/tiga puluh menit) = 06.30.'
	},
	{
		id: 1506,
		type: 'pilihan_ganda',
		subject: 'Bahasa Indonesia',
		jenjang: 'MI',
		grade: 5,
		question_text: '<p>Teks yang memuat penjelasan ilmiah mengenai sebab dan akibat terjadinya peristiwa alam seperti banjir, gunung meletus, atau gempa bumi disebut teks...</p>',
		question_number: 6,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Eksplanasi' },
			{ key: 'B', text: 'Narasi' },
			{ key: 'C', text: 'Deskripsi' },
			{ key: 'D', text: 'Fabel' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'Teks eksplanasi menjelaskan proses "mengapa" dan "bagaimana" fenomena alam terjadi.'
	},
	{
		id: 1507,
		type: 'pilihan_ganda',
		subject: 'Matematika',
		jenjang: 'MI',
		grade: 5,
		question_text: '<p>Hasil dari operasi penjumlahan pecahan <strong>(3/4) + (2/5)</strong> adalah...</p>',
		question_number: 7,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: '23/20' },
			{ key: 'B', text: '5/9' },
			{ key: 'C', text: '6/20' },
			{ key: 'D', text: '15/20' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'Penyebut KPK 4 dan 5 adalah 20. (15/20) + (8/20) = 23/20 = 1 3/20.'
	},
	{
		id: 1508,
		type: 'pilihan_ganda',
		subject: 'IPA',
		jenjang: 'MI',
		grade: 5,
		question_text: '<p>Bagian paru-paru yang berupa gelembung-gelembung halus dan berfungsi sebagai tempat pertukaran oksigen dengan karbon dioksida adalah...</p>',
		question_number: 8,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Alveolus' },
			{ key: 'B', text: 'Trakea' },
			{ key: 'C', text: 'Bronkus' },
			{ key: 'D', text: 'Laring' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'Alveolus adalah tempat pertukaran gas O2 dan CO2 pada sistem pernapasan.'
	},
	{
		id: 1509,
		type: 'pilihan_ganda',
		subject: 'IPS',
		jenjang: 'MI',
		grade: 5,
		question_text: '<p>Pahlawan nasional yang gigih memimpin perlawanan rakyat Maluku melawan monopoli perdagangan rempah VOC Belanda pada tahun 1817 adalah...</p>',
		question_number: 9,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Kapitan Pattimura (Thomas Matulessy)' },
			{ key: 'B', text: 'Pangeran Diponegoro' },
			{ key: 'C', text: 'Tuanku Imam Bonjol' },
			{ key: 'D', text: 'Sultan Hasanuddin' }
		]),
		correct_answer: 'A',
		points: 7,
		explanation: 'Kapitan Pattimura adalah pahlawan nasional dari kepulauan Maluku.'
	},
	{
		id: 1510,
		type: 'pilihan_ganda_kompleks',
		subject: "Al-Qur'an Hadis",
		jenjang: 'MI',
		grade: 5,
		question_text: '<p>Berdasarkan kandungan <strong>Surah Al-Humazah</strong>, sifat tercela yang diancam dengan siksa neraka Huthamah adalah... <em>(Pilih 2 jawaban)</em></p>',
		question_number: 10,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Suka mengumpat dan mencela kehormatan orang lain' },
			{ key: 'B', text: 'Mengumpulkan harta secara serakah dan kikir tanpa mau bersedekah' },
			{ key: 'C', text: 'Suka menolong sesama yang membutuhkan bantuan' },
			{ key: 'D', text: 'Menjaga lisan dari perkataan kotor' }
		]),
		correct_answer: '["A","B"]',
		points: 7,
		explanation: 'Surah Al-Humazah mencela orang yang suka mengumpat (humazah lumazah) dan menumpuk harta.'
	},
	{
		id: 1511,
		type: 'pilihan_ganda_kompleks',
		subject: 'IPA',
		jenjang: 'MI',
		grade: 5,
		question_text: '<p>Organ pencernaan manusia yang berfungsi melakukan pencernaan makanan secara kimiawi dengan bantuan getah lambung adalah... <em>(Pilih 2 organ)</em></p>',
		question_number: 11,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Mulut (enzim ptialin)' },
			{ key: 'B', text: 'Lambung (enzim pepsin & renin)' },
			{ key: 'C', text: 'Paru-paru' },
			{ key: 'D', text: 'Hidung' }
		]),
		correct_answer: '["A","B"]',
		points: 7,
		explanation: 'Mulut dan lambung memproses makanan secara mekanik dan kimiawi.'
	},
	{
		id: 1512,
		type: 'benar_salah',
		subject: 'Fikih',
		jenjang: 'MI',
		grade: 5,
		question_text: '<p>Tentukan status kebenaran (<strong>Benar</strong> atau <strong>Salah</strong>) mengenai ketentuan puasa Ramadhan:</p>',
		question_number: 12,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ id: '1', statement: 'Orang yang sakit berat atau dalam perjalanan jauh (musafir) boleh berbuka puasa dan wajib menggantinya (qadha) di hari lain.' },
			{ id: '2', statement: 'Muntah secara tidak sengaja dapat membatalkan puasa seseorang.' }
		]),
		correct_answer: '{"1":"benar","2":"salah"}',
		points: 7,
		explanation: 'Rukhsah bagi orang sakit/musafir qadha puasa (Benar). Muntah tanpa sengaja tidak membatalkan puasa (Salah).'
	},
	{
		id: 1513,
		type: 'menjodohkan',
		subject: 'SKI',
		jenjang: 'MI',
		grade: 5,
		question_text: '<p>Jodohkan tokoh pahlawan perlawanan Nusantara berikut dengan daerah asalnya:</p>',
		question_number: 13,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify({
			left: [
				{ key: '1', text: 'Pangeran Diponegoro' },
				{ key: '2', text: 'Tuanku Imam Bonjol' },
				{ key: '3', text: 'Sultan Hasanuddin' }
			],
			right: [
				{ key: 'A', text: 'Jawa Tengah (Perang Jawa)' },
				{ key: 'B', text: 'Sumatera Barat (Perang Padri)' },
				{ key: 'C', text: 'Sulawesi Selatan / Makassar' }
			]
		}),
		correct_answer: '{"1":"A","2":"B","3":"C"}',
		points: 7,
		explanation: 'Pangeran Diponegoro (Jawa), Tuanku Imam Bonjol (Minang), Sultan Hasanuddin (Makassar).'
	},
	{
		id: 1514,
		type: 'isian_singkat',
		subject: 'Matematika',
		jenjang: 'MI',
		grade: 5,
		question_text: '<p>Jarak antara kota A dan kota B pada peta adalah 4 cm. Jika skala peta tersebut adalah 1 : 200.000, maka jarak sebenarnya kedua kota tersebut adalah ... km. <em>(Tuliskan angka jawabannya saja)</em></p>',
		question_number: 14,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: null,
		correct_answer: '8',
		points: 7,
		explanation: 'Jarak sebenarnya = 4 cm × 200.000 = 800.000 cm = 8 km.'
	},
	{
		id: 1515,
		type: 'essay',
		subject: 'Akidah Akhlak',
		jenjang: 'MI',
		grade: 5,
		question_text: '<p>Sebutkan <strong>tiga (3) hikmah beriman kepada Hari Akhir (Kiamat)</strong> yang dapat membimbing tingkah laku seorang pelajar madrasah!</p>',
		question_number: 15,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: null,
		correct_answer: 'Termotivasi untuk rajin beribadah dan beramal shaleh, selalu menjaga kejujuran karena sadar ada hisab amal, serta menjauhi perbuatan dosa dan maksiat.',
		points: 7,
		explanation: 'Iman pada Hari Akhir membimbing manusia bersikap jujur dan senantiasa beramal shaleh.'
	}
];

// =========================================================================
// 6. BANK SOAL SIMULASI MI KELAS 6 (15 NOMOR)
// Meliputi: Bahasa Arab, Matematika, IPA, IPS, Bahasa Indonesia, Akidah Akhlak, SKI, Fikih, Al-Qur'an Hadis
// =========================================================================
export const MI_QUESTIONS_GRADE_6: SimulationQuestion[] = [
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

export const MI_QUESTIONS_UPPER = MI_QUESTIONS_GRADE_6;

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
		question_text: '<p>عُمَرُ بْنُ الْخَطَّابِ هُوَ الَّذِي ... التَّقْوِيْمَ الْهِجْرِيَّ.</p>',
		question_number: 5,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'وَضَعَ' },
			{ key: 'B', text: 'وَضَعَتْ' },
			{ key: 'C', text: 'وَضَعُوْا' },
			{ key: 'D', text: 'وَضَعْتَ' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Dhamir untuk \'عُمَرُ بْنُ الْخَطَّابِ\' adalah هُوَ (dia laki-laki tunggal), sehingga bentuk fi\'il madhi yang tepat adalah وَضَعَ (wada\'a).'
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
		question_text: '<p>فِي أَيِّ شَهْرٍ نَزَلَ الْقُرْآنُ الْكَرِيْمُ أَوَّلَ مَرَّةٍ عَلَى النَّبِيِّ مُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ فِي غَارِ حِرَاءَ؟</p>',
		question_number: 14,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'شَهْرِ رَمَضَانَ (Bulan Ramadhan)' },
			{ key: 'B', text: 'شَهْرِ شَوَّالٍ (Bulan Syawwal)' },
			{ key: 'C', text: 'شَهْرِ مُحَرَّمٍ (Bulan Muharram)' },
			{ key: 'D', text: 'شَهْرِ رَبِيْعِ الأَوَّلِ (Bulan Rabi\'ul Awwal)' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Al-Qur\'an pertama kali diturunkan kepada Nabi Muhammad SAW di Gua Hira pada bulan Ramadhan (شَهْرُ رَمَضَانَ) atau malam Nuzulul Qur\'an.'
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

// ==========================================
// 6. BANK SOAL SIMULASI MA KELAS 11 (25 NOMOR)
// Khusus siswa MA Kelas 11 (Materi Kurikulum Kelas 11)
// ==========================================
export const MA_QUESTIONS_GRADE_11: SimulationQuestion[] = [
	{
		id: 601,
		type: 'pilihan_ganda',
		subject: "Al-Qur'an Hadis",
		jenjang: 'MA',
		grade: 11,
		question_text: '<p>Hadis riwayat Bukhari dan Muslim menyatakan: <strong>كُلُّكُمْ رَاعٍ وَكُلُّكُمْ مَسْئُولٌ عَنْ رَعِيَّتِهِ</strong>. Kandungan pokok hadis tersebut menegaskan tentang...</p>',
		question_number: 1,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Setiap manusia adalah pemimpin dan akan dimintai pertanggungjawaban atas apa yang dipimpinnya' },
			{ key: 'B', text: 'Kewajiban berhijrah ke negeri yang aman' },
			{ key: 'C', text: 'Keutamaan menunaikan ibadah haji ke Baitullah' },
			{ key: 'D', text: 'Larangan memakan riba dalam berniaga' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Hadis tentang amanah kepemimpinan dan tanggung jawab sosial setiap insan.'
	},
	{
		id: 602,
		type: 'pilihan_ganda',
		subject: 'Akidah Akhlak',
		jenjang: 'MA',
		grade: 11,
		question_text: '<p>Salah satu aliran teologi (Ilmu Kalam) dalam sejarah pemikiran Islam yang mengedepankan akal rasional dan terkenal dengan doktrin <em>Ushulul Khamsah</em> adalah aliran...</p>',
		question_number: 2,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Mu\'tazilah' },
			{ key: 'B', text: 'Asy\'ariyah' },
			{ key: 'C', text: 'Maturidiyah' },
			{ key: 'D', text: 'Jabariyah' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Aliran Mu\'tazilah memiliki 5 prinsip pokok (Ushulul Khamsah).'
	},
	{
		id: 603,
		type: 'pilihan_ganda',
		subject: 'Fikih',
		jenjang: 'MA',
		grade: 11,
		question_text: '<p>Menuduh orang lain yang baik-baik berbuat zina tanpa disertai empat orang saksi yang adil dalam hukum pidana Islam dinamakan...</p>',
		question_number: 3,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Qadzaf' },
			{ key: 'B', text: 'Li\'an' },
			{ key: 'C', text: 'Zhihar' },
			{ key: 'D', text: 'Bughat' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Qadzaf adalah tuduhan palsu berbuat zina dan dikenai hukuman hudud 80 kali cambuk.'
	},
	{
		id: 604,
		type: 'pilihan_ganda',
		subject: 'SKI',
		jenjang: 'MA',
		grade: 11,
		question_text: '<p>Pusat peradaban dan kebudayaan Islam di benua Eropa yang mencapai puncak kemegahan pada masa Daulah Umayyah II terletak di kota...</p>',
		question_number: 4,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Cordoba (Spanyol)' },
			{ key: 'B', text: 'Roma (Italia)' },
			{ key: 'C', text: 'Wina (Austria)' },
			{ key: 'D', text: 'Paris (Prancis)' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Cordoba di Andalusia merupakan mercusuar ilmu pengetahuan Eropa era keemasan Islam.'
	},
	{
		id: 605,
		type: 'pilihan_ganda',
		subject: 'Bahasa Arab',
		jenjang: 'MA',
		grade: 11,
		question_text: '<p>Dalam kalimat: <strong>هَذَا طَالِبٌ نَشِيْطٌ</strong>, kedudukan kata <strong>نَشِيْطٌ</strong> adalah sebagai...</p>',
		question_number: 5,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Na\'at (Sifat)' },
			{ key: 'B', text: 'Mubtada\'' },
			{ key: 'C', text: 'Maf\'ul Bih' },
			{ key: 'D', text: 'Zharf' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'نَشِيْطٌ adalah na\'at (kata sifat) yang menyifati kata thalibun (man\'ut).'
	},
	{
		id: 606,
		type: 'pilihan_ganda',
		subject: 'Matematika',
		jenjang: 'MA',
		grade: 11,
		question_text: '<p>Turunan pertama dari fungsi <strong>f(x) = 2x³ - 4x² + 5x - 7</strong> adalah f\'(x) = ...</p>',
		question_number: 6,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: '6x² - 8x + 5' },
			{ key: 'B', text: '6x² - 4x + 5' },
			{ key: 'C', text: '3x² - 8x + 5' },
			{ key: 'D', text: '6x² - 8x' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'f\'(x) = 2(3)x² - 4(2)x + 5 = 6x² - 8x + 5.'
	},
	{
		id: 607,
		type: 'pilihan_ganda',
		subject: 'Bahasa Indonesia',
		jenjang: 'MA',
		grade: 11,
		question_text: '<p>Bagian pendahuluan dalam teks ceramah yang berisi pengenalan isu, masalah, serta pandangan umum pembicara disebut bagian...</p>',
		question_number: 7,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Pembuka (Tesis)' },
			{ key: 'B', text: 'Rangkaian Argumen' },
			{ key: 'C', text: 'Penegasan Ulang' },
			{ key: 'D', text: 'Resolusi' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Struktur teks ceramah diawali tesis (pembuka), rangkaian argumen (isi), dan penegasan ulang (penutup).'
	},
	{
		id: 608,
		type: 'pilihan_ganda',
		subject: 'IPA',
		jenjang: 'MA',
		grade: 11,
		question_text: '<p>Organel sel yang berfungsi sebagai tempat modifikasi, penyortiran, dan pengemasan protein sebelum disekresikan ke luar sel adalah...</p>',
		question_number: 8,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Badan Golgi (Aparatus Golgi)' },
			{ key: 'B', text: 'Lisosom' },
			{ key: 'C', text: 'Vakuola' },
			{ key: 'D', text: 'Sentriol' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Badan Golgi berperan dalam sekresi dan glikosilasi protein seluler.'
	},
	{
		id: 609,
		type: 'pilihan_ganda',
		subject: 'IPS',
		jenjang: 'MA',
		grade: 11,
		question_text: '<p>Pengelompokan masyarakat secara horizontal berdasarkan perbedaan suku, agama, ras, dan klan tanpa adanya hierarki tingkatan sosial disebut...</p>',
		question_number: 9,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Diferensiasi Sosial' },
			{ key: 'B', text: 'Stratifikasi Sosial' },
			{ key: 'C', text: 'Konflik Sosial' },
			{ key: 'D', text: 'Asimilasi Sosial' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Diferensiasi sosial adalah pembedaan masyarakat secara horizontal/sejajar.'
	},
	{
		id: 610,
		type: 'pilihan_ganda',
		subject: 'Akidah Akhlak',
		jenjang: 'MA',
		grade: 11,
		question_text: '<p>Perilaku membelanjakan harta secara boros dan berlebih-lebihan untuk hal-hal yang tidak berguna atau bernilai maksiat dinamakan...</p>',
		question_number: 10,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Isyraf dan Tabdzir' },
			{ key: 'B', text: 'Qana\'ah' },
			{ key: 'C', text: 'Wara\'' },
			{ key: 'D', text: 'Iffah' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Isyraf dan Tabdzir adalah sikap boros dan menyia-nyiakan nikmat harta.'
	},
	{
		id: 611,
		type: 'pilihan_ganda',
		subject: 'Matematika',
		jenjang: 'MA',
		grade: 11,
		question_text: '<p>Jumlah tak hingga dari deret geometri konvergen <strong>12 + 6 + 3 + 3/2 + ...</strong> adalah...</p>',
		question_number: 11,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: '24' },
			{ key: 'B', text: '20' },
			{ key: 'C', text: '18' },
			{ key: 'D', text: '36' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'a = 12, r = 1/2. S tak hingga = a / (1 - r) = 12 / (1 - 1/2) = 12 / (1/2) = 24.'
	},
	{
		id: 612,
		type: 'pilihan_ganda',
		subject: 'Fikih',
		jenjang: 'MA',
		grade: 11,
		question_text: '<p>Ahli waris yang mendapatkan sisa harta warisan setelah harta dibagikan kepada ahli waris ashhabul furudh dinamakan...</p>',
		question_number: 12,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Ashabah' },
			{ key: 'B', text: 'Zawil Arham' },
			{ key: 'C', text: 'Hijab Nuqsan' },
			{ key: 'D', text: 'Hijab Hirman' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Ashabah adalah penerima sisa tirkah warisan.'
	},
	{
		id: 613,
		type: 'pilihan_ganda',
		subject: 'IPA',
		jenjang: 'MA',
		grade: 11,
		question_text: '<p>Hukum Pertama Termodinamika pada dasarnya merupakan pernyataan dari hukum...</p>',
		question_number: 13,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Kekekalan Energi' },
			{ key: 'B', text: 'Kekekalan Momentum' },
			{ key: 'C', text: 'Entropi Maksimum' },
			{ key: 'D', text: 'Aksi-Reaksi' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Hukum I Termodinamika: Energi tidak dapat diciptakan atau dimusnahkan (ΔU = Q - W).'
	},
	{
		id: 614,
		type: 'pilihan_ganda',
		subject: 'Bahasa Arab',
		jenjang: 'MA',
		grade: 11,
		question_text: '<p>Huruf <strong>لَنْ</strong> dalam tata bahasa Arab berfungsi sebagai amil nawashib yang bertugas...</p>',
		question_number: 14,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Menashabkan fi\'il mudhari\' dan menafikan masa depan' },
			{ key: 'B', text: 'Menjazamkan fi\'il mudhari\'' },
			{ key: 'C', text: 'Meng-kasrahkan isim' },
			{ key: 'D', text: 'Menjadikan fi\'il bermakna lampau' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Lan adalah huruf nafi dan nashab untuk waktu mustaqbal.'
	},
	{
		id: 615,
		type: 'pilihan_ganda',
		subject: 'SKI',
		jenjang: 'MA',
		grade: 11,
		question_text: '<p>Universitas Islam Al-Azhar di Kairo Mesir dibangun pada masa pemerintahan Dinasti...</p>',
		question_number: 15,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Fathimiyah' },
			{ key: 'B', text: 'Ayyubiyah' },
			{ key: 'C', text: 'Umayyah' },
			{ key: 'D', text: 'Abbasiyah' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Masjid dan Universitas Al-Azhar didirikan oleh panglima Jauhar As-Siqili era Dinasti Fathimiyah.'
	},
	{
		id: 616,
		type: 'pilihan_ganda_kompleks',
		subject: "Al-Qur'an Hadis",
		jenjang: 'MA',
		grade: 11,
		question_text: '<p>Hadis riwayat Al-Miqdam bin Ma\'dikarib RA menyatakan bahwa makanan terbaik bagi seorang hamba adalah makanan dari... <em>(Pilih 2 jawaban yang tepat)</em></p>',
		question_number: 16,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Hasil kerja keringat tangannya sendiri secara halal' },
			{ key: 'B', text: 'Nafkah yang diperoleh dari usaha yang jujur sebagaimana Nabi Daud AS' },
			{ key: 'C', text: 'Meminta-minta belas kasihan orang lain di jalanan' },
			{ key: 'D', text: 'Harta rampasan tanpa usaha yang sah' }
		]),
		correct_answer: '["A","B"]',
		points: 4,
		explanation: 'Nabi bersabda tidak ada makanan yang lebih baik daripada hasil usaha tangannya sendiri.'
	},
	{
		id: 617,
		type: 'pilihan_ganda_kompleks',
		subject: 'IPA',
		jenjang: 'MA',
		grade: 11,
		question_text: '<p>Faktor-faktor berikut yang dapat <strong>mempercepat laju suatu reaksi kimia</strong> adalah... <em>(Pilih 2 jawaban)</em></p>',
		question_number: 17,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Menaikkan suhu sistem reaksi' },
			{ key: 'B', text: 'Menambahkan zat katalisator' },
			{ key: 'C', text: 'Memperkecil luas permukaan bidang sentuh' },
			{ key: 'D', text: 'Menurunkan konsentrasi zat pereaksi' }
		]),
		correct_answer: '["A","B"]',
		points: 4,
		explanation: 'Kenaikan suhu dan penambahan katalisator mempercepat tercapainya energi aktivasi.'
	},
	{
		id: 618,
		type: 'pilihan_ganda_kompleks',
		subject: 'IPS',
		jenjang: 'MA',
		grade: 11,
		question_text: '<p>Ciri-ciri masyarakat multikultural yang berhasil menjaga <strong>integrasi sosial</strong> adalah... <em>(Pilih 2 jawaban)</em></p>',
		question_number: 18,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Tumbuhnya sikap toleransi dan saling menghormati perbedaan suku serta agama' },
			{ key: 'B', text: 'Tercapainya konsensus bersama mengenai nilai-nilai dasar kemasyarakatan' },
			{ key: 'C', text: 'Dominasi satu kelompok mayoritas atas kelompok minoritas' },
			{ key: 'D', text: 'Terjadinya disintegrasi antardaerah secara terus-menerus' }
		]),
		correct_answer: '["A","B"]',
		points: 4,
		explanation: 'Toleransi dan konsensus bersama merupakan fondasi integrasi bangsa.'
	},
	{
		id: 619,
		type: 'benar_salah',
		subject: 'Fikih',
		jenjang: 'MA',
		grade: 11,
		question_text: '<p>Tentukan status kebenaran (<strong>Benar</strong> atau <strong>Salah</strong>) mengenai ketentuan hukum waris Islam:</p>',
		question_number: 19,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ id: '1', statement: 'Ketentuan bagian waris anak laki-laki adalah dua kali lipat dari bagian anak perempuan.' },
			{ id: '2', statement: 'Ahli waris yang membunuh pewarisnya tetap berhak menerima harta warisan peninggalan korban.' }
		]),
		correct_answer: '{"1":"benar","2":"salah"}',
		points: 4,
		explanation: 'Laki-laki 2 bagian perempuan 1 bagian (Benar). Pembunuhan adalah penghalang warisan (Mani\'ul Irtsi) (Salah).'
	},
	{
		id: 620,
		type: 'benar_salah',
		subject: 'Matematika',
		jenjang: 'MA',
		grade: 11,
		question_text: '<p>Tentukan status kebenaran pernyataan matematika seputar <strong>Limit Fungsi</strong> berikut:</p>',
		question_number: 20,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ id: '1', statement: 'Nilai dari lim (x→2) (x² - 4)/(x - 2) adalah sama dengan 4.' },
			{ id: '2', statement: 'Jika hasil substitusi langsung pada limit fungsi menghasilkan bentuk 0/0, maka nilai limit tersebut otomatis tak terdefinisi dan tidak bisa dicari.' }
		]),
		correct_answer: '{"1":"benar","2":"salah"}',
		points: 4,
		explanation: '(x-2)(x+2)/(x-2) = x+2 -> 2+2 = 4 (Benar). Bentuk 0/0 adalah tak tentu dan dapat diselesaikan dengan pemfaktoran/L\'Hopital (Salah).'
	},
	{
		id: 621,
		type: 'menjodohkan',
		subject: 'Matematika',
		jenjang: 'MA',
		grade: 11,
		question_text: '<p>Jodohkan turunan pertama fungsi berikut:</p>',
		question_number: 21,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify({
			left: [
				{ key: '1', text: 'f(x) = x³' },
				{ key: '2', text: 'f(x) = 5x²' },
				{ key: '3', text: 'f(x) = 7x' }
			],
			right: [
				{ key: 'A', text: 'f\'(x) = 3x²' },
				{ key: 'B', text: 'f\'(x) = 10x' },
				{ key: 'C', text: 'f\'(x) = 7' }
			]
		}),
		correct_answer: '{"1":"A","2":"B","3":"C"}',
		points: 4,
		explanation: 'Turunan fungsi aljabar dasar ax^n -> n.a.x^(n-1).'
	},
	{
		id: 622,
		type: 'menjodohkan',
		subject: 'SKI',
		jenjang: 'MA',
		grade: 11,
		question_text: '<p>Jodohkan ilmuwan muslim masa Daulah Umayyah di Andalusia dengan bidang keahliannya:</p>',
		question_number: 22,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify({
			left: [
				{ key: '1', text: 'Ibnu Rusyd (Averroes)' },
				{ key: '2', text: 'Az-Zahrawi (Albucasis)' },
				{ key: '3', text: 'Abbas bin Firnas' }
			],
			right: [
				{ key: 'A', text: 'Filsuf dan Pengarang Bidayatul Mujtahid' },
				{ key: 'B', text: 'Bapak Ilmu Bedah Medis Modern' },
				{ key: 'C', text: 'Pelopor Penerbangan dan Pembuat Sayap Buatan' }
			]
		}),
		correct_answer: '{"1":"A","2":"B","3":"C"}',
		points: 4,
		explanation: 'Para ilmuwan terkemuka Andalusia Spanyol.'
	},
	{
		id: 623,
		type: 'isian_singkat',
		subject: 'Matematika',
		jenjang: 'MA',
		grade: 11,
		question_text: '<p>Jika f(x) = x² - 3x + 8, maka nilai f\'(4) adalah ... <em>(Tuliskan angka jawabannya saja)</em></p>',
		question_number: 23,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: null,
		correct_answer: '5',
		points: 4,
		explanation: 'f\'(x) = 2x - 3. f\'(4) = 2(4) - 3 = 8 - 3 = 5.'
	},
	{
		id: 624,
		type: 'isian_singkat',
		subject: 'Bahasa Indonesia',
		jenjang: 'MA',
		grade: 11,
		question_text: '<p>Majas perbandingan yang menyamakan dua hal secara langsung tanpa menggunakan kata pembanding (seperti "buku adalah jendela dunia") dinamakan majas...</p>',
		question_number: 24,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: null,
		correct_answer: 'metafora',
		points: 4,
		explanation: 'Majas metafora menyamakan dua hal secara analogis langsung.'
	},
	{
		id: 625,
		type: 'essay',
		subject: 'Akidah Akhlak',
		jenjang: 'MA',
		grade: 11,
		question_text: '<p>Jelaskan bahaya dari sifat <strong>Namimah (Adu Domba)</strong> dan <strong>Fitnah</strong> terhadap kerukunan umat Islam serta bagaimana cara membentengi diri darinya!</p>',
		question_number: 25,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: null,
		correct_answer: 'Namimah dan fitnah dapat menghancurkan ukhuwah persaudaraan, menimbulkan kebencian, dan diancam tidak masuk surga. Cara membentengi diri adalah dengan tabayyun (klarifikasi berita), menjaga lisan, dan senantiasa berprasangka baik (husnuzhan).',
		points: 4,
		explanation: 'Jawaban mencakup bahaya perpecahan sosial, ancaman dosa, dan pentingnya sikap tabayyun.'
	}
];

// ==========================================
// 7. BANK SOAL SIMULASI MA KELAS 12 (25 NOMOR)
// Khusus siswa MA Kelas 12 (Persiapan Asesmen Madrasah Tingkat Akhir)
// ==========================================
export const MA_QUESTIONS_GRADE_12: SimulationQuestion[] = [
	{
		id: 701,
		type: 'pilihan_ganda',
		subject: "Al-Qur'an Hadis",
		jenjang: 'MA',
		grade: 12,
		question_text: '<p>Kandungan <strong>Surah Ali \'Imran ayat 190-191</strong> memerintahkan orang-orang yang berakal (<em>Ulil Albab</em>) untuk senantiasa...</p>',
		question_number: 1,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Mengingat Allah sambil berdiri, duduk, atau berbaring dan merenungkan penciptaan langit dan bumi' },
			{ key: 'B', text: 'Mengasingkan diri dari pergaulan masyarakat ramai' },
			{ key: 'C', text: 'Berpuasa setiap hari tanpa berbuka' },
			{ key: 'D', text: 'Menghindari ilmu pengetahuan modern' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Karakter Ulil Albab memadukan zikir kepada Allah dan fikir atas keagungan ciptaan-Nya.'
	},
	{
		id: 702,
		type: 'pilihan_ganda',
		subject: 'Akidah Akhlak',
		jenjang: 'MA',
		grade: 12,
		question_text: '<p>Sikap saling menghormati dan menghargai perbedaan keyakinan dan pandangan tanpa menggadaikan prinsip akidah Islam disebut sikap...</p>',
		question_number: 2,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Tasamuh (Toleransi)' },
			{ key: 'B', text: 'Ta\'ashub (Fanatisme buta)' },
			{ key: 'C', text: 'Ananiah' },
			{ key: 'D', text: 'Tamalluq' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Tasamuh adalah toleransi yang berlandaskan lakum diinukum waliyadiin.'
	},
	{
		id: 703,
		type: 'pilihan_ganda',
		subject: 'Fikih',
		jenjang: 'MA',
		grade: 12,
		question_text: '<p>Rukun pernikahan dalam Islam yang menjadi simbol kerelaan dan ikatan suci antara wali pengantin wanita dengan calon mempelai pria disebut...</p>',
		question_number: 3,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Ijab dan Qabul (Akad Nikah)' },
			{ key: 'B', text: 'Khitbah (Lamaran)' },
			{ key: 'C', text: 'Walimatul \'Ursy' },
			{ key: 'D', text: 'Rujuk' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Ijab qabul adalah rukun inti terjadinya akad pernikahan.'
	},
	{
		id: 704,
		type: 'pilihan_ganda',
		subject: 'SKI',
		jenjang: 'MA',
		grade: 12,
		question_text: '<p>Tokoh pembaharu Islam dari Mesir yang menyerukan dibukanya pintu ijtihad dan pembaharuan sistem pendidikan Islam adalah...</p>',
		question_number: 4,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Muhammad Abduh' },
			{ key: 'B', text: 'Musthafa Kemal Ataturk' },
			{ key: 'C', text: 'Shah Waliullah' },
			{ key: 'D', text: 'Ali Jinnah' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Muhammad Abduh adalah mufti dan tokoh pembaharuan Islam Mesir.'
	},
	{
		id: 705,
		type: 'pilihan_ganda',
		subject: 'Bahasa Arab',
		jenjang: 'MA',
		grade: 12,
		question_text: '<p>Ilmu yang mempelajari kaidah keindahan susunan gaya bahasa Arab agar sesuai dengan situasi dan kondisi dinamakan ilmu...</p>',
		question_number: 5,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Balaghah' },
			{ key: 'B', text: 'Nahwu' },
			{ key: 'C', text: 'Sharaf' },
			{ key: 'D', text: 'Tajwid' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Ilmu Balaghah mencakup kajian Ma\'ani, Bayan, dan Badi\'.'
	},
	{
		id: 706,
		type: 'pilihan_ganda',
		subject: 'Matematika',
		jenjang: 'MA',
		grade: 12,
		question_text: '<p>Hasil dari integral tak tentu <strong>∫ (6x² - 4x + 3) dx</strong> adalah...</p>',
		question_number: 6,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: '2x³ - 2x² + 3x + C' },
			{ key: 'B', text: '3x³ - 2x² + 3x + C' },
			{ key: 'C', text: '2x³ - 4x² + 3x + C' },
			{ key: 'D', text: '6x³ - 2x² + 3x + C' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: '∫ 6x² dx = 2x³, ∫ -4x dx = -2x², ∫ 3 dx = 3x. Hasil: 2x³ - 2x² + 3x + C.'
	},
	{
		id: 707,
		type: 'pilihan_ganda',
		subject: 'Bahasa Indonesia',
		jenjang: 'MA',
		grade: 12,
		question_text: '<p>Artikel opini resmi yang ditulis oleh redaksi surat kabar untuk menanggapi suatu peristiwa aktual yang sedang hangat diperbincangkan disebut...</p>',
		question_number: 7,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Teks Editorial (Tajuk Rencana)' },
			{ key: 'B', text: 'Teks Iklan' },
			{ key: 'C', text: 'Teks Cerpen' },
			{ key: 'D', text: 'Teks Deskripsi' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Teks editorial adalah sikap dan pandangan resmi dewan redaksi media.'
	},
	{
		id: 708,
		type: 'pilihan_ganda',
		subject: 'IPA',
		jenjang: 'MA',
		grade: 12,
		question_text: '<p>Gelombang elektromagnetik yang memiliki frekuensi tertinggi dan daya tembus paling kuat sehingga dimanfaatkan dalam terapi kanker adalah...</p>',
		question_number: 8,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Sinar Gamma' },
			{ key: 'B', text: 'Sinar Inframerah' },
			{ key: 'C', text: 'Gelombang Mikro' },
			{ key: 'D', text: 'Gelombang Radio' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Sinar gamma memiliki energi foton dan frekuensi paling tinggi dalam spektrum EM.'
	},
	{
		id: 709,
		type: 'pilihan_ganda',
		subject: 'IPS',
		jenjang: 'MA',
		grade: 12,
		question_text: '<p>Kondisi terjadinya ketidakseimbangan atau jurang pemisah yang mencolok dalam pemenuhan hak dan fasilitas ekonomi antara kelompok kaya dan miskin disebut...</p>',
		question_number: 9,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Ketimpangan Sosial Ekonomi' },
			{ key: 'B', text: 'Integrasi Bangsa' },
			{ key: 'C', text: 'Asimilasi Budaya' },
			{ key: 'D', text: 'Akomodasi' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Ketimpangan sosial adalah disparitas nyata antarlapisan masyarakat.'
	},
	{
		id: 710,
		type: 'pilihan_ganda',
		subject: 'Akidah Akhlak',
		jenjang: 'MA',
		grade: 12,
		question_text: '<p>Konsep moderasi beragama dalam Islam yang menempatkan umat di jalan tengah yang adil, seimbang, dan tidak ekstrem dinamakan...</p>',
		question_number: 10,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Wasathiyah (Ummatan Wasathan)' },
			{ key: 'B', text: 'Ghulww (Ekstremisme)' },
			{ key: 'C', text: 'Ifrath' },
			{ key: 'D', text: 'Tafrith' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Wasathiyah adalah prinsip jalan tengah moderat rahmatan lil \'alamin.'
	},
	{
		id: 711,
		type: 'pilihan_ganda',
		subject: 'Matematika',
		jenjang: 'MA',
		grade: 12,
		question_text: '<p>Dari 5 orang calon pengurus madrasah, akan dipilih 3 orang anggota delegasi. Banyaknya cara pemilihan delegasi tersebut adalah...</p>',
		question_number: 11,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: '10' },
			{ key: 'B', text: '20' },
			{ key: 'C', text: '15' },
			{ key: 'D', text: '60' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Kombinasi C(5,3) = 5! / (3! × 2!) = (5 × 4) / 2 = 10 cara.'
	},
	{
		id: 712,
		type: 'pilihan_ganda',
		subject: 'Fikih',
		jenjang: 'MA',
		grade: 12,
		question_text: '<p>Menyamakan hukum suatu perkara baru yang belum ada nashnya dengan perkara yang sudah ada nash hukumnya karena kesamaan \'illat (alasan) hukum dinamakan...</p>',
		question_number: 12,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Qiyas' },
			{ key: 'B', text: 'Ijma\'' },
			{ key: 'C', text: 'Istihsan' },
			{ key: 'D', text: 'Maslahah Mursalah' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Qiyas adalah analogi hukum atas dasar kesamaan \'illat.'
	},
	{
		id: 713,
		type: 'pilihan_ganda',
		subject: 'IPA',
		jenjang: 'MA',
		grade: 12,
		question_text: '<p>Peristiwa terlepasnya elektron dari permukaan suatu logam akibat disinari radiasi cahaya berfrekuensi di atas frekuensi ambang dinamakan peristiwa...</p>',
		question_number: 13,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Efek Fotolistrik' },
			{ key: 'B', text: 'Efek Compton' },
			{ key: 'C', text: 'Difraksi Sinar-X' },
			{ key: 'D', text: 'Radiasi Benda Hitam' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Efek fotolistrik dibuktikan oleh Albert Einstein (penghargaan Nobel Fisika).'
	},
	{
		id: 714,
		type: 'pilihan_ganda',
		subject: 'Bahasa Arab',
		jenjang: 'MA',
		grade: 12,
		question_text: '<p>Susunan kalimat \'Adad Ma\'dud yang tepat untuk mengungkapkan <em>"tiga orang laki-laki"</em> dalam bahasa Arab adalah...</p>',
		question_number: 14,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'ثَلَاثَةُ رِجَالٍ' },
			{ key: 'B', text: 'ثَلَاثُ رِجَالٍ' },
			{ key: 'C', text: 'ثَلَاثَةُ نِسَاءٍ' },
			{ key: 'D', text: 'ثَلَاثُ امْرَأَةٍ' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Untuk bilangan 3-10, jenis \'adad berlawanan dengan mufrad ma\'dud (rijal mudzakkar maka adad muannats: tsalatsatu rijalin).'
	},
	{
		id: 715,
		type: 'pilihan_ganda',
		subject: 'SKI',
		jenjang: 'MA',
		grade: 12,
		question_text: '<p>Organisasi pergerakan Islam terbesar di Nusantara yang didirikan oleh para ulama pesantren di bawah kepemimpinan KH. Hasyim Asy\'ari pada tahun 1926 adalah...</p>',
		question_number: 15,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Nahdlatul Ulama (NU)' },
			{ key: 'B', text: 'Muhammadiyah' },
			{ key: 'C', text: 'Sarekat Islam' },
			{ key: 'D', text: 'Persatuan Islam (Persis)' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Nahdlatul Ulama didirikan pada 16 Rajab 1344 H / 31 Januari 1926 di Surabaya.'
	},
	{
		id: 716,
		type: 'pilihan_ganda_kompleks',
		subject: "Al-Qur'an Hadis",
		jenjang: 'MA',
		grade: 12,
		question_text: '<p>Berdasarkan <strong>Surah Ali \'Imran ayat 159</strong>, prinsip utama dalam bermusyawarah dan menyelesaikan masalah umat adalah... <em>(Pilih 2 jawaban)</em></p>',
		question_number: 16,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Bersikap lemah lembut dan tidak berhati kasar' },
			{ key: 'B', text: 'Memberi maaf dan memohonkan ampunan bagi sesama' },
			{ key: 'C', text: 'Memaksakan kehendak pribadi kepada orang lain' },
			{ key: 'D', text: 'Mementingkan keuntungan kelompok sendiri' }
		]),
		correct_answer: '["A","B"]',
		points: 4,
		explanation: 'QS Ali Imran: 159 memerintahkan lemah lembut, pemaaf, dan musyawarah.'
	},
	{
		id: 717,
		type: 'pilihan_ganda_kompleks',
		subject: 'IPA',
		jenjang: 'MA',
		grade: 12,
		question_text: '<p>Berikut ini yang merupakan contoh penerapan <strong>Bioteknologi Rekayasa Genetika</strong> modern di bidang kesehatan adalah... <em>(Pilih 2 jawaban)</em></p>',
		question_number: 17,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Pembuatan hormon insulin rekombinan dengan bakteri E. coli' },
			{ key: 'B', text: 'Produksi antibodi monoklonal untuk pengobatan tumor' },
			{ key: 'C', text: 'Pembuatan tapai ketan menggunakan ragi tradisional' },
			{ key: 'D', text: 'Pembuatan cuka makan dari fermentasi alkohol' }
		]),
		correct_answer: '["A","B"]',
		points: 4,
		explanation: 'Insulin rekombinan dan antibodi monoklonal adalah bioteknologi modern DNA.'
	},
	{
		id: 718,
		type: 'pilihan_ganda_kompleks',
		subject: 'IPS',
		jenjang: 'MA',
		grade: 12,
		question_text: '<p>Sikap kritis dan bijaksana yang harus dimiliki oleh generasi muda dalam menghadapi <strong>arus globalisasi</strong> adalah... <em>(Pilih 2 jawaban)</em></p>',
		question_number: 18,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Menyaring budaya asing dengan berpegang teguh pada nilai agama dan Pancasila' },
			{ key: 'B', text: 'Memanfaatkan kemajuan IPTEK dunia untuk kemajuan bangsa dan madrasah' },
			{ key: 'C', text: 'Menerima seluruh tren barat secara membabi buta' },
			{ key: 'D', text: 'Menutup diri total dari perkembangan dunia luar' }
		]),
		correct_answer: '["A","B"]',
		points: 4,
		explanation: 'Menyaring budaya secara kritis dan memanfaatkan kemajuan teknologi secara positif.'
	},
	{
		id: 719,
		type: 'benar_salah',
		subject: 'Fikih',
		jenjang: 'MA',
		grade: 12,
		question_text: '<p>Tentukan status kebenaran (<strong>Benar</strong> atau <strong>Salah</strong>) mengenai hukum pernikahan dan talak:</p>',
		question_number: 19,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ id: '1', statement: 'Mahar (mas kawin) merupakan hak murni milik mempelai wanita dan bukan milik orang tuanya.' },
			{ id: '2', statement: 'Suami yang menjatuhkan talak tiga (talak bain kubra) boleh langsung rujuk kembali kapan saja tanpa syarat.' }
		]),
		correct_answer: '{"1":"benar","2":"salah"}',
		points: 4,
		explanation: 'Mahar adalah hak mutlak istri (Benar). Talak tiga mensyaratkan muhallil sah agar boleh menikah kembali (Salah).'
	},
	{
		id: 720,
		type: 'benar_salah',
		subject: 'Matematika',
		jenjang: 'MA',
		grade: 12,
		question_text: '<p>Tentukan status kebenaran pernyataan matematika kaidah pencacahan berikut:</p>',
		question_number: 20,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ id: '1', statement: 'Nilai dari 5 faktorial (5!) adalah sama dengan 120.' },
			{ id: '2', statement: 'Rumus permutasi digunakan apabila urutan pemilihan objek tidak diperhatikan sama sekali.' }
		]),
		correct_answer: '{"1":"benar","2":"salah"}',
		points: 4,
		explanation: '5! = 5×4×3×2×1 = 120 (Benar). Permutasi memperhatikan urutan, yang tidak memperhatikan urutan adalah kombinasi (Salah).'
	},
	{
		id: 721,
		type: 'menjodohkan',
		subject: 'Matematika',
		jenjang: 'MA',
		grade: 12,
		question_text: '<p>Jodohkan nilai integral tentu berikut:</p>',
		question_number: 21,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify({
			left: [
				{ key: '1', text: '∫ (dari 0 sampai 2) 2x dx' },
				{ key: '2', text: '∫ (dari 0 sampai 1) 3x² dx' },
				{ key: '3', text: '∫ (dari 1 sampai 3) 2 dx' }
			],
			right: [
				{ key: 'A', text: '4' },
				{ key: 'B', text: '1' },
				{ key: 'C', text: '4' }
			]
		}),
		correct_answer: '{"1":"A","2":"B","3":"C"}',
		points: 4,
		explanation: '[x²](0->2) = 4; [x³](0->1) = 1; [2x](1->3) = 6 - 2 = 4.'
	},
	{
		id: 722,
		type: 'menjodohkan',
		subject: 'SKI',
		jenjang: 'MA',
		grade: 12,
		question_text: '<p>Jodohkan organisasi Islam di Indonesia berikut dengan tokoh pendirinya:</p>',
		question_number: 22,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify({
			left: [
				{ key: '1', text: 'Nahdlatul Ulama' },
				{ key: '2', text: 'Muhammadiyah' },
				{ key: '3', text: 'Sarekat Islam' }
			],
			right: [
				{ key: 'A', text: 'KH. Hasyim Asy\'ari' },
				{ key: 'B', text: 'KH. Ahmad Dahlan' },
				{ key: 'C', text: 'HOS Tjokroaminoto' }
			]
		}),
		correct_answer: '{"1":"A","2":"B","3":"C"}',
		points: 4,
		explanation: 'NU (KH Hasyim Asy\'ari), Muhammadiyah (KH Ahmad Dahlan), Sarekat Islam (HOS Tjokroaminoto).'
	},
	{
		id: 723,
		type: 'isian_singkat',
		subject: 'Matematika',
		jenjang: 'MA',
		grade: 12,
		question_text: '<p>Banyaknya susunan huruf yang dapat dibentuk dari kata <strong>"BUMI"</strong> tanpa pengulangan adalah ... <em>(Tuliskan angka jawabannya saja)</em></p>',
		question_number: 23,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: null,
		correct_answer: '24',
		points: 4,
		explanation: '4 huruf berbeda: 4! = 4 × 3 × 2 × 1 = 24 susunan.'
	},
	{
		id: 724,
		type: 'isian_singkat',
		subject: 'Bahasa Indonesia',
		jenjang: 'MA',
		grade: 12,
		question_text: '<p>Surat yang dibuat oleh pelamar yang ditujukan kepada instansi atau perusahaan dengan maksud memohon pekerjaan dinamakan surat...</p>',
		question_number: 24,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: null,
		correct_answer: 'lamaran pekerjaan',
		points: 4,
		explanation: 'Surat lamaran pekerjaan dibuat untuk mengajukan permohonan bekerja.'
	},
	{
		id: 725,
		type: 'essay',
		subject: 'Akidah Akhlak',
		jenjang: 'MA',
		grade: 12,
		question_text: '<p>Uraikan tiga pilar persaudaraan dalam ajaran Islam: <strong>Ukhuwah Islamiyah, Ukhuwah Wathaniyah, dan Ukhuwah Basyariyah</strong> dalam menjaga kerukunan bangsa Indonesia!</p>',
		question_number: 25,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: null,
		correct_answer: 'Ukhuwah Islamiyah adalah persaudaraan sesama muslim; Ukhuwah Wathaniyah adalah persaudaraan sebangsa dan setanah air meski berbeda suku dan agama; Ukhuwah Basyariyah adalah persaudaraan universal sesama umat manusia. Ketiganya menjadi pondasi kerukunan dan kedamaian NKRI.',
		points: 4,
		explanation: 'Jawaban mencakup konsep tiga dimensi persaudaraan dalam pemikiran moderasi Islam Indonesia.'
	}
];

// ==========================================
// FUNGSI PARSER TINGKAT KELAS & JENJANG
// ==========================================
export function parseGradeAndJenjang(
	schoolJenjang: unknown,
	schoolName: unknown,
	classLevel: unknown,
	className: unknown
): { jenjang: 'MI' | 'MTS' | 'MA'; grade: number; displayGrade: string } {
	let jenjang: 'MI' | 'MTS' | 'MA' = 'MTS';

	const normSchoolJenjang = String(schoolJenjang ?? '').trim().toUpperCase();
	const normSchoolName = String(schoolName ?? '').trim().toUpperCase();
	const normClassLevel = String(classLevel ?? '').trim().toUpperCase();
	const normClassName = String(className ?? '').trim().toUpperCase();

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
	const combined = ` ${normClassLevel} ${normClassName} `.toUpperCase();

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
	} else if (/\b(VI|6)\b/.test(combined) || /\b6[A-Z]?\b/.test(combined)) {
		grade = 6;
		if (!normSchoolJenjang && !normSchoolName) jenjang = 'MI';
	} else if (/\b(V|5)\b/.test(combined) || /\b5[A-Z]?\b/.test(combined)) {
		grade = 5;
		if (!normSchoolJenjang && !normSchoolName) jenjang = 'MI';
	} else if (/\b(IV|4)\b/.test(combined) || /\b4[A-Z]?\b/.test(combined)) {
		grade = 4;
		if (!normSchoolJenjang && !normSchoolName) jenjang = 'MI';
	} else if (/\b(III|3)\b/.test(combined) || /\b3[A-Z]?\b/.test(combined)) {
		grade = 3;
		if (!normSchoolJenjang && !normSchoolName) jenjang = 'MI';
	} else if (/\b(II|2)\b/.test(combined) || /\b2[A-Z]?\b/.test(combined)) {
		grade = 2;
		if (!normSchoolJenjang && !normSchoolName) jenjang = 'MI';
	} else if (/\b(I|1)\b/.test(combined) || /\b1[A-Z]?\b/.test(combined)) {
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
		// Siswa MI kelas 1-5 dan 6 mendapatkan 15 nomor khusus sesuai kelasnya
		if (grade === 1) return MI_QUESTIONS_GRADE_1;
		if (grade === 2) return MI_QUESTIONS_GRADE_2;
		if (grade === 3) return MI_QUESTIONS_GRADE_3;
		if (grade === 4) return MI_QUESTIONS_GRADE_4;
		if (grade === 5) return MI_QUESTIONS_GRADE_5;
		return MI_QUESTIONS_GRADE_6;
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
