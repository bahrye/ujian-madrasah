export interface SimulationQuestion {
	id: number;
	type: 'pilihan_ganda' | 'pilihan_ganda_kompleks' | 'benar_salah' | 'menjodohkan' | 'isian_singkat' | 'essay';
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

export const SIMULATION_QUESTIONS: SimulationQuestion[] = [
	// 1. Pilihan Ganda
	{
		id: 1,
		type: 'pilihan_ganda',
		question_text: '<p>Meyakini adanya para Malaikat Allah SWT yang senantiasa taat dan tidak pernah membangkang merupakan rukun iman yang ke-...</p>',
		question_number: 1,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Pertama' },
			{ key: 'B', text: 'Kedua' },
			{ key: 'C', text: 'Ketiga' },
			{ key: 'D', text: 'Keempat' }
		]),
		correct_answer: 'B',
		points: 4,
		explanation: 'Rukun Iman yang kedua adalah Iman kepada Malaikat-malaikat Allah.'
	},
	// 2. Pilihan Ganda
	{
		id: 2,
		type: 'pilihan_ganda',
		question_text: '<p>Surah Al-Fatihah disebut juga sebagai <em>Ummul Qur\'an</em> atau <em>Ummul Kitab</em> karena...</p>',
		question_number: 2,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Merupakan surah yang diturunkan di kota Mekkah' },
			{ key: 'B', text: 'Merupakan surah pertama yang memuat intisari seluruh ajaran Al-Qur\'an' },
			{ key: 'C', text: 'Memiliki jumlah ayat yang paling sedikit di dalam Al-Qur\'an' },
			{ key: 'D', text: 'Wajib dibaca oleh imam dan makmum dalam shalat jenazah saja' }
		]),
		correct_answer: 'B',
		points: 4,
		explanation: 'Al-Fatihah disebut Ummul Qur\'an karena kandungannya merangkum prinsip-prinsip pokok seluruh isi Al-Qur\'an.'
	},
	// 3. Pilihan Ganda
	{
		id: 3,
		type: 'pilihan_ganda',
		question_text: '<p>Kewajiban menunaikan Zakat Fitrah bagi setiap muslim bertujuan untuk menyucikan jiwa dan membantu fakir miskin, yang batas akhir pembayarannya adalah sebelum...</p>',
		question_number: 3,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Malam takbiran dimulai' },
			{ key: 'B', text: 'Shalat Idul Fitri dilaksanakan' },
			{ key: 'C', text: 'Tenggelamnya matahari 1 Syawal' },
			{ key: 'D', text: 'Bulan Ramadhan berakhir' }
		]),
		correct_answer: 'B',
		points: 4,
		explanation: 'Zakat fitrah wajib ditunaikan sebelum pelaksanaan shalat Idul Fitri.'
	},
	// 4. Pilihan Ganda
	{
		id: 4,
		type: 'pilihan_ganda',
		question_text: '<p>Peristiwa agung Isra\' Mi\'raj Nabi Muhammad SAW dari Masjidil Haram ke Masjidil Aqsha hingga ke Sidratul Muntaha menghasilkan perintah ibadah pokok, yaitu...</p>',
		question_number: 4,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Shalat lima waktu sehari semalam' },
			{ key: 'B', text: 'Puasa di bulan suci Ramadhan' },
			{ key: 'C', text: 'Melaksanakan ibadah haji ke Baitullah' },
			{ key: 'D', text: 'Membayar zakat mal dan zakat fitrah' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Dalam peristiwa Isra\' Mi\'raj, Nabi Muhammad SAW menerima langsung perintah shalat fardhu lima waktu.'
	},
	// 5. Pilihan Ganda
	{
		id: 5,
		type: 'pilihan_ganda',
		question_text: '<p>Sikap saling menghormati dan menghargai perbedaan antar sesama manusia dalam ajaran Islam dikenal dengan istilah...</p>',
		question_number: 5,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Tasamuh (Toleransi)' },
			{ key: 'B', text: 'Tawadhu\' (Rendah Hati)' },
			{ key: 'C', text: 'Ta\'awun (Tolong Menolong)' },
			{ key: 'D', text: 'Takaful (Saling Menjamin)' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Tasamuh berarti toleransi, yaitu sikap saling menghargai perbedaan suku, agama, dan pandangan.'
	},
	// 6. Pilihan Ganda
	{
		id: 6,
		type: 'pilihan_ganda',
		question_text: '<p>Berdasarkan sabda Rasulullah SAW, terdapat dua bangkai hewan yang halal dimakan tanpa perlu disembelih terlebih dahulu, yaitu...</p>',
		question_number: 6,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Ikan dan Belalang' },
			{ key: 'B', text: 'Ayam dan Burung' },
			{ key: 'C', text: 'Kambing dan Sapi' },
			{ key: 'D', text: 'Unta dan Kuda' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Rasulullah SAW bersabda: "Dihalalkan bagi kita dua bangkai dan dua darah. Dua bangkai itu adalah ikan dan belalang..." (HR. Ahmad & Ibnu Majah).'
	},
	// 7. Pilihan Ganda
	{
		id: 7,
		type: 'pilihan_ganda',
		question_text: '<p>Sumber energi utama dan terbesar yang menggerakkan siklus kehidupan, fotosintesis tumbuhan, serta cuaca di bumi adalah...</p>',
		question_number: 7,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Energi Panas Bumi (Geotermal)' },
			{ key: 'B', text: 'Matahari' },
			{ key: 'C', text: 'Bahan Bakar Minyak Bumi' },
			{ key: 'D', text: 'Angin dan Arus Laut' }
		]),
		correct_answer: 'B',
		points: 4,
		explanation: 'Matahari merupakan sumber energi primer terbesar di tata surya bagi kehidupan bumi.'
	},
	// 8. Pilihan Ganda
	{
		id: 8,
		type: 'pilihan_ganda',
		question_text: '<p>Ibukota Negara Kesatuan Republik Indonesia saat ini berdasarkan Undang-Undang adalah...</p>',
		question_number: 8,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'DKI Jakarta' },
			{ key: 'B', text: 'Surabaya' },
			{ key: 'C', text: 'Bandung' },
			{ key: 'D', text: 'Yogyakarta' }
		]),
		correct_answer: 'A',
		points: 4,
		explanation: 'Ibukota Negara Indonesia saat ini adalah DKI Jakarta.'
	},
	// 9. Pilihan Ganda
	{
		id: 9,
		type: 'pilihan_ganda',
		question_text: '<p>Hasil perhitungan matematika dari operasi perpangkatan dan perkalian $2^3 \\times 5$ adalah...</p>',
		question_number: 9,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: '30' },
			{ key: 'B', text: '40' },
			{ key: 'C', text: '50' },
			{ key: 'D', text: '80' }
		]),
		correct_answer: 'B',
		points: 4,
		explanation: '2 pangkat 3 = 8. Kemudian 8 x 5 = 40.'
	},
	// 10. Pilihan Ganda
	{
		id: 10,
		type: 'pilihan_ganda',
		question_text: '<p>Candi Borobudur yang merupakan mahakarya arsitektur sejarah dan situs warisan dunia UNESCO berada di wilayah provinsi...</p>',
		question_number: 10,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Jawa Timur' },
			{ key: 'B', text: 'Jawa Tengah' },
			{ key: 'C', text: 'Jawa Barat' },
			{ key: 'D', text: 'Daerah Khusus Ibukota Jakarta' }
		]),
		correct_answer: 'B',
		points: 4,
		explanation: 'Candi Borobudur berlokasi di Magelang, Jawa Tengah.'
	},

	// 11. Pilihan Ganda Kompleks
	{
		id: 11,
		type: 'pilihan_ganda_kompleks',
		question_text: '<p>Di antara pernyataan di bawah ini, manakah yang termasuk <strong>Rukun Khutbah Jumat</strong> yang sah? <em>(Pilihlah lebih dari satu jawaban yang benar)</em></p>',
		question_number: 11,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Memuji Allah SWT (Hamdalah) pada kedua khutbah' },
			{ key: 'B', text: 'Membaca shalawat atas Nabi Muhammad SAW pada kedua khutbah' },
			{ key: 'C', text: 'Berwasiat taqwa kepada Allah SWT pada kedua khutbah' },
			{ key: 'D', text: 'Menggunakan bahasa Arab seluruhnya saat menerangkan isi materi khutbah' }
		]),
		correct_answer: JSON.stringify(['A', 'B', 'C']),
		points: 4,
		explanation: 'Rukun khutbah Jumat meliputi memuji Allah (hamdalah), bershalawat kepada Nabi, berwasiat taqwa, membaca satu ayat Al-Qur\'an, dan mendoakan kaum mukminin.'
	},
	// 12. Pilihan Ganda Kompleks
	{
		id: 12,
		type: 'pilihan_ganda_kompleks',
		question_text: '<p>Berikut adalah pasangan nama Malaikat dan tugas pokoknya. Pilihlah pernyataan yang <strong>benar</strong>! <em>(Pilihan bisa lebih dari satu)</em></p>',
		question_number: 12,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Malaikat Jibril bertugas menyampaikan wahyu kepada para Nabi dan Rasul' },
			{ key: 'B', text: 'Malaikat Mikail bertugas membagikan rezeki dan menurunkan hujan' },
			{ key: 'C', text: 'Malaikat Israfil bertugas meniup sangkakala pada hari kiamat' },
			{ key: 'D', text: 'Malaikat Malik bertugas menjaga dan menyambut penghuni pintu Surga' }
		]),
		correct_answer: JSON.stringify(['A', 'B', 'C']),
		points: 4,
		explanation: 'Malaikat Malik bertugas menjaga Neraka, sedangkan penjaga pintu Surga adalah Malaikat Ridwan.'
	},
	// 13. Pilihan Ganda Kompleks
	{
		id: 13,
		type: 'pilihan_ganda_kompleks',
		question_text: '<p>Manakah dari pilihan berikut ini yang merupakan <strong>ciri-ciri makhluk hidup</strong>? <em>(Pilihlah lebih dari satu jawaban yang benar)</em></p>',
		question_number: 13,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Bernapas (Respirasi)' },
			{ key: 'B', text: 'Memerlukan nutrisi / makanan' },
			{ key: 'C', text: 'Berkembang biak (Reproduksi)' },
			{ key: 'D', text: 'Mengalami pertumbuhan dan perkembangan' }
		]),
		correct_answer: JSON.stringify(['A', 'B', 'C', 'D']),
		points: 4,
		explanation: 'Semua pilihan di atas adalah ciri-ciri mendasar dari makhluk hidup.'
	},
	// 14. Pilihan Ganda Kompleks
	{
		id: 14,
		type: 'pilihan_ganda_kompleks',
		question_text: '<p>Dalam ilmu Bahasa Indonesia, manakah yang termasuk ke dalam <strong>unsur intrinsik</strong> suatu karya cerita fiksi (cerpen/novel)? <em>(Pilihan bisa lebih dari satu)</em></p>',
		question_number: 14,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify([
			{ key: 'A', text: 'Tema dan Amanat' },
			{ key: 'B', text: 'Latar / Setting (waktu, tempat, suasana)' },
			{ key: 'C', text: 'Alur cerita (Plot) dan Penokohan' },
			{ key: 'D', text: 'Kondisi ekonomi penerbit buku' }
		]),
		correct_answer: JSON.stringify(['A', 'B', 'C']),
		points: 4,
		explanation: 'Kondisi ekonomi penerbit bukan unsur intrinsik cerita.'
	},

	// 15. Benar / Salah
	{
		id: 15,
		type: 'benar_salah',
		question_text: '<p>Perhatikan pernyataan mengenai ketentuan <strong>Ibadah Puasa Ramadhan</strong> berikut. Tentukan apakah masing-masing pernyataan bernilai <strong>Benar</strong> atau <strong>Salah</strong>!</p>',
		question_number: 15,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify({
			statements: [
				'Niat berpuasa Ramadhan wajib dilakukan pada malam hari sebelum fajar terbit.',
				'Makan atau minum karena benar-benar lupa membatalkan ibadah puasa dan wajib diqadha.',
				'Orang yang sedang sakit atau musafir diperbolehkan tidak berpuasa dan wajib menggantinya di hari lain.'
			]
		}),
		correct_answer: JSON.stringify({ '0': 'benar', '1': 'salah', '2': 'benar' }),
		points: 4,
		explanation: 'Makan/minum karena lupa tidak membatalkan puasa (merupakan rezeki dari Allah).'
	},
	// 16. Benar / Salah
	{
		id: 16,
		type: 'benar_salah',
		question_text: '<p>Tentukan nilai kebenaran hukum bacaan <strong>Ilmu Tajwid</strong> pada tabel pernyataan berikut!</p>',
		question_number: 16,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify({
			statements: [
				'Nun sukun (نْ) bertemu huruf ba (ب) dibaca dengan hukum Iqlab.',
				'Huruf Qalqalah berjumlah 5 huruf yang disingkat baju di toko (ب، ج، د، ط، ق).',
				'Hukum bacaan Idgham Bighunnah dibaca terang dan jelas tanpa dengungan.'
			]
		}),
		correct_answer: JSON.stringify({ '0': 'benar', '1': 'benar', '2': 'salah' }),
		points: 4,
		explanation: 'Idgham Bighunnah dibaca melebur disertai dengung (ghunnah), bukan tanpa dengung.'
	},
	// 17. Benar / Salah
	{
		id: 17,
		type: 'benar_salah',
		question_text: '<p>Tentukan kebenaran pernyataan seputar <strong>Sains & Alam</strong> di bawah ini!</p>',
		question_number: 17,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify({
			statements: [
				'Tumbuhan hijau melepaskan gas Oksigen (O₂) sebagai produk fotosintesis pada siang hari.',
				'Bulan merupakan benda langit bercahaya sendiri seperti halnya matahari.',
				'Air murni mendidih pada suhu 100 derajat Celsius pada tekanan udara standar 1 atmosfer.'
			]
		}),
		correct_answer: JSON.stringify({ '0': 'benar', '1': 'salah', '2': 'benar' }),
		points: 4,
		explanation: 'Bulan tidak memiliki cahaya sendiri; cahaya bulan adalah pantulan dari sinar matahari.'
	},
	// 18. Benar / Salah
	{
		id: 18,
		type: 'benar_salah',
		question_text: '<p>Tentukan kebenaran peristiwa dalam <strong>Sejarah Kebudayaan Islam (SKI)</strong> berikut!</p>',
		question_number: 18,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify({
			statements: [
				'Khalifah pertama pengganti kepemimpinan umat Islam setelah Rasulullah wafat adalah Abu Bakar Ash-Shiddiq RA.',
				'Kota Madinah sebelum masa hijrah Nabi Muhammad SAW bernama Yatsrib.',
				'Perang Badar Al-Kubra terjadi pada tahun ke-10 Hijriyah.'
			]
		}),
		correct_answer: JSON.stringify({ '0': 'benar', '1': 'benar', '2': 'salah' }),
		points: 4,
		explanation: 'Perang Badar terjadi pada tanggal 17 Ramadhan tahun ke-2 Hijriyah.'
	},

	// 19. Menjodohkan
	{
		id: 19,
		type: 'menjodohkan',
		question_text: '<p>Jodohkanlah nama-nama <strong>Nabi dan Rasul</strong> di kolom sebelah kiri dengan <strong>Mukjizat Utamanya</strong> yang tepat di kolom sebelah kanan!</p>',
		question_number: 19,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify({
			left: ['Nabi Musa AS', 'Nabi Isa AS', 'Nabi Ibrahim AS', 'Nabi Muhammad SAW'],
			right: ['Tongkat membelah lautan', 'Menyembuhkan orang buta atas izin Allah', 'Tidak terbakar kobaran api Raja Namrud', 'Kitab Suci Al-Qur\'an']
		}),
		correct_answer: JSON.stringify({ '0': '0', '1': '1', '2': '2', '3': '3' }),
		points: 4,
		explanation: 'Musa (tongkat lautan), Isa (menyembuhkan buta), Ibrahim (kebal api), Muhammad (Al-Qur\'an).'
	},
	// 20. Menjodohkan
	{
		id: 20,
		type: 'menjodohkan',
		question_text: '<p>Jodohkan istilah <strong>Hukum Tajwid</strong> berikut dengan kaidah cara membacanya yang tepat!</p>',
		question_number: 20,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify({
			left: ['Idzhar Halqi', 'Ikhfa Haqiqi', 'Iqlab', 'Qalqalah'],
			right: ['Dibaca jelas tanpa dengung', 'Dibaca samar antara idzhar dan idgham', 'Mengganti bunyi nun sukun menjadi mim', 'Memantulkan bunyi huruf saat sukun']
		}),
		correct_answer: JSON.stringify({ '0': '0', '1': '1', '2': '2', '3': '3' }),
		points: 4,
		explanation: 'Idzhar (jelas), Ikhfa (samar), Iqlab (menjadi mim), Qalqalah (memantul).'
	},
	// 21. Menjodohkan
	{
		id: 21,
		type: 'menjodohkan',
		question_text: '<p>Jodohkan nama <strong>Pahlawan Nasional Indonesia</strong> berikut dengan daerah perjuangan asalnya!</p>',
		question_number: 21,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: JSON.stringify({
			left: ['Pangeran Diponegoro', 'Sultan Hasanuddin', 'Tuanku Imam Bonjol', 'Cut Nyak Dien'],
			right: ['Yogyakarta & Jawa Tengah', 'Makassar (Sulawesi Selatan)', 'Minangkabau (Sumatera Barat)', 'Aceh']
		}),
		correct_answer: JSON.stringify({ '0': '0', '1': '1', '2': '2', '3': '3' }),
		points: 4,
		explanation: 'Diponegoro (Jawa), Hasanuddin (Makassar), Imam Bonjol (Minangkabau), Cut Nyak Dien (Aceh).'
	},

	// 22. Isian Singkat
	{
		id: 22,
		type: 'isian_singkat',
		question_text: '<p>Kitab suci Al-Qur\'an terdiri dari 114 surah dan terbagi ke dalam <strong>...</strong> juz. <em>(Ketikkan jawaban berupa angka bilangan bulat)</em></p>',
		question_number: 22,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: null,
		correct_answer: '30',
		points: 4,
		explanation: 'Al-Qur\'an terbagi ke dalam 30 Juz.'
	},
	// 23. Isian Singkat
	{
		id: 23,
		type: 'isian_singkat',
		question_text: '<p>Sahabat Nabi Muhammad SAW yang terkenal sangat tegas, pemberani, dan mendapat julukan <em>"Al-Faruq"</em> (pembeda antara yang haq dan yang bathil) adalah khalifah...</p>',
		question_number: 23,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: null,
		correct_answer: 'Umar bin Khattab',
		points: 4,
		explanation: 'Sahabat yang bergelar Al-Faruq adalah Umar bin Khattab RA.'
	},

	// 24. Essay
	{
		id: 24,
		type: 'essay',
		question_text: '<p>Jelaskan pengertian sikap <strong>Jujur (Shiddiq)</strong> dalam ajaran Islam, dan sebutkan minimal 2 (dua) contoh penerapannya ketika Anda mengikuti ujian di madrasah!</p>',
		question_number: 24,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: null,
		correct_answer: 'Jujur adalah kesesuaian antara ucapan, perbuatan, dan kenyataan hati nurani. Contoh di madrasah: tidak mencontek saat ujian, mengakui kesalahan sendiri.',
		points: 4,
		explanation: 'Jawaban dinilai dari kejelasan definisi jujur dan contoh nyata saat pelaksanaan ujian.'
	},
	// 25. Essay
	{
		id: 25,
		type: 'essay',
		question_text: '<p>Mengapa ajaran Islam sangat menekankan kewajiban berbakti kepada kedua orang tua (<strong>Birrul Walidain</strong>)? Uraikan hikmah atau alasan utamanya!</p>',
		question_number: 25,
		media_type: null,
		media_url: null,
		audio_max_plays: 0,
		options_json: null,
		correct_answer: 'Karena orang tua telah melahirkan, mengasuh, mendidik dengan penuh pengorbanan dan kasih sayang. Ridha Allah bergantung pada ridha kedua orang tua.',
		points: 4,
		explanation: 'Jawaban mencakup pengorbanan orang tua dan kedudukan ridha Allah yang berkaitan erat dengan ridha orang tua.'
	}
];
