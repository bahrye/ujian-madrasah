import { h as head, i as ensure_array_like, e as escape_html, k as attr, j as attr_class, c as stringify, a as attr_style } from "../../../../chunks/index.js";
import { Q as QuestionRenderer } from "../../../../chunks/QuestionRenderer.js";
import { h as html } from "../../../../chunks/html.js";
function _page($$renderer) {
  let activeBadge = 0;
  let currentSlide = 0;
  const slides = [
    {
      id: 1,
      title: "Tampilan Utama Soal (No. 1 - 10)",
      subtitle: "Penjelasan antarmuka navigasi, soal, dan timer saat mengerjakan.",
      image: "/panduan-ui-ujian.jpeg",
      badges: [
        { no: 1, top: "3%", left: "3%" },
        { no: 2, top: "3%", left: "52%" },
        { no: 3, top: "3%", left: "90%" },
        { no: 4, top: "15%", left: "90%" },
        { no: 5, top: "30%", left: "3%" },
        { no: 6, top: "55%", left: "3%" },
        { no: 7, top: "85%", left: "3%" },
        { no: 8, top: "85%", left: "40%" },
        { no: 9, top: "85%", left: "88%" },
        { no: 10, top: "91%", left: "91%" }
      ],
      items: [
        {
          no: 1,
          title: "Judul Ujian",
          desc: "Menampilkan nama mata pelajaran ujian yang sedang dikerjakan."
        },
        {
          no: 2,
          title: "Indikator Pelanggaran",
          desc: "Menampilkan jumlah peringatan jika Anda terdeteksi keluar dari layar penuh/membuka aplikasi lain."
        },
        {
          no: 3,
          title: "Sisa Waktu",
          desc: "Menunjukkan batas waktu pengerjaan. Ujian otomatis berakhir jika waktu habis."
        },
        {
          no: 4,
          title: "Tombol Ragu-ragu",
          desc: "Tandai soal dengan ini jika Anda belum yakin dengan jawaban yang dipilih."
        },
        {
          no: 5,
          title: "Teks Soal",
          desc: "Area utama yang menampilkan pertanyaan ujian yang harus dijawab."
        },
        {
          no: 6,
          title: "Pilihan Jawaban",
          desc: "Pilih jawaban yang paling tepat. Jawaban akan langsung tersimpan ke sistem."
        },
        {
          no: 7,
          title: "Navigasi Soal",
          desc: "Membuka panel berisi daftar seluruh nomor soal untuk memudahkan berpindah nomor."
        },
        {
          no: 8,
          title: "Tombol Muat Ulang",
          desc: "Gunakan tombol ini untuk memuat ulang halaman tanpa keluar dari ujian jika terjadi kendala/error jaringan."
        },
        {
          no: 9,
          title: "Informasi Progres",
          desc: "Melihat ringkasan berapa soal yang sudah dijawab dan yang masih kosong."
        },
        {
          no: 10,
          title: "Tombol Navigasi (Sebelumnya/Selanjutnya)",
          desc: "Digunakan untuk beralih ke soal sebelum atau soal sesudahnya."
        }
      ]
    },
    {
      id: 2,
      title: "Tombol Selesai & Kumpulkan (No. 11)",
      subtitle: "Tampilan di nomor soal terakhir untuk menyelesaikan ujian.",
      image: "/panduan-ui-ujian-2.jpeg",
      badges: [{ no: 11, top: "90%", left: "88%" }],
      items: [
        {
          no: 11,
          title: "Tombol Selesai & Kumpulkan",
          desc: 'Tombol berwarna hijau ini akan muncul menggantikan tombol "Selanjutnya" saat Anda berada pada nomor soal terakhir. Klik tombol ini jika sudah selesai mengerjakan seluruh soal.'
        }
      ]
    },
    {
      id: 3,
      title: "Konfirmasi Pengumpulan Jawaban (No. 12)",
      subtitle: "Kotak dialog verifikasi sebelum lembar jawaban dikirim secara permanen.",
      image: "/panduan-ui-ujian-3.jpeg",
      badges: [{ no: 12, top: "64%", left: "86%" }],
      items: [
        {
          no: 12,
          title: "Konfirmasi Pengumpulan Jawaban",
          desc: 'Kotak dialog ini merangkum total soal yang sudah terjawab, ragu-ragu, dan belum dijawab. Klik "Ya, Kumpulkan" untuk menyelesaikan ujian, atau klik "Kembali" jika masih ingin memeriksa jawaban.'
        }
      ]
    }
  ];
  let activeTypeTab = "pilihan_ganda";
  let demoAnswers = {
    pilihan_ganda: "",
    pilihan_ganda_kompleks: "",
    benar_salah_tunggal: "",
    benar_salah_multi: "",
    menjodohkan: "",
    isian_singkat: "",
    essay: ""
  };
  const questionTypes = [
    {
      id: "pilihan_ganda",
      name: "Pilihan Ganda",
      badge: "Tunggal",
      badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
      icon: "🔘",
      desc: "Tipe soal dengan memilih 1 jawaban yang paling tepat di antara opsi yang tersedia (A, B, C, D, atau E).",
      tips: [
        "Klik pada salah satu kotak pilihan jawaban.",
        "Opsi yang dipilih akan ditandai dengan warna ungu/biru terang.",
        "Pilihan dapat diganti kapan saja dengan mengklik opsi lain."
      ],
      sampleQuestion: {
        id: 101,
        type: "pilihan_ganda",
        question_number: 1,
        points: 1,
        media_type: null,
        media_url: null,
        audio_max_plays: 3,
        question_text: "<p>Ibukota negara Republik Indonesia yang baru adalah...</p>",
        options_json: JSON.stringify(["Jakarta", "Nusantara (IKN)", "Surabaya", "Bandung"])
      }
    },
    {
      id: "pilihan_ganda_kompleks",
      name: "Pilihan Ganda Kompleks",
      badge: "Centang Banyak",
      badgeColor: "bg-indigo-100 text-indigo-700 border-indigo-200",
      icon: "☑️",
      desc: "Soal yang memiliki lebih dari satu jawaban benar. Peserta dapat mencentang beberapa opsi yang sesuai.",
      tips: [
        "Klik kotak opsi untuk mencentang. Klik kembali untuk membatalkan.",
        "Pilihlah seluruh opsi yang Anda anggap benar.",
        "Gunakan ketelitian karena bisa terdapat 2 atau lebih jawaban yang tepat."
      ],
      sampleQuestion: {
        id: 102,
        type: "pilihan_ganda_kompleks",
        question_number: 1,
        points: 1,
        media_type: null,
        media_url: null,
        audio_max_plays: 3,
        question_text: "<p>Manakah dari pernyataan berikut yang merupakan rukun Islam? <i>(Pilih semua yang benar)</i></p>",
        options_json: JSON.stringify([
          "Membaca Dua Kalimat Syahadat",
          "Mendirikan Shalat 5 Waktu",
          "Menuntut Ilmu ke Luar Negeri",
          "Menunaikan Zakat"
        ])
      }
    },
    {
      id: "benar_salah_tunggal",
      name: "Benar / Salah (Tunggal)",
      badge: "B / S Tunggal",
      badgeColor: "bg-amber-100 text-amber-700 border-amber-200",
      icon: "⚖️",
      desc: 'Menentukan kebenaran dari sebuah pernyataan tunggal dengan memilih tombol "Benar" atau "Salah".',
      tips: [
        "Pahami isi teks pertanyaan dengan cermat.",
        "Tekan tombol <b>Benar</b> jika sesuai fakta, atau <b>Salah</b> jika tidak sesuai.",
        "Tombol akan berubah warna saat aktif dipilih."
      ],
      sampleQuestion: {
        id: 103,
        type: "benar_salah",
        question_number: 1,
        points: 1,
        media_type: null,
        media_url: null,
        audio_max_plays: 3,
        question_text: "<p>Matahari terbit dari sebelah barat dan tenggelam di sebelah timur.</p>",
        options_json: JSON.stringify([])
      }
    },
    {
      id: "benar_salah_multi",
      name: "Benar / Salah (Banyak Pernyataan)",
      badge: "Tabel B / S",
      badgeColor: "bg-teal-100 text-teal-700 border-teal-200",
      icon: "📋",
      desc: "Terdapat beberapa baris pernyataan dalam bentuk tabel. Tentukan Benar (B) atau Salah (S) untuk setiap baris.",
      tips: [
        "Di ponsel, tombol diringkas menjadi <b>B</b> (Benar) dan <b>S</b> (Salah) agar muat tanpa digeser.",
        "Pastikan setiap nomor baris pernyataan sudah memiliki pilihan (B atau S).",
        "Masing-masing baris pernyataan memiliki bobot nilai tersendiri (penilaian parsial)."
      ],
      sampleQuestion: {
        id: 104,
        type: "benar_salah",
        question_number: 1,
        points: 1,
        media_type: null,
        media_url: null,
        audio_max_plays: 3,
        question_text: "<p>Tentukan Benar atau Salah untuk setiap pernyataan matematika di bawah ini:</p>",
        options_json: JSON.stringify({
          statements: [
            "Hasil dari $5 + 3 \\times 2$ adalah $11$.",
            "Bilangan $-8$ lebih besar daripada $-2$.",
            "Nilai dari $25\\%$ dari $80$ adalah $20$."
          ]
        })
      }
    },
    {
      id: "menjodohkan",
      name: "Menjodohkan (Matching)",
      badge: "Tarik Garis",
      badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
      icon: "🔗",
      desc: "Menghubungkan pernyataan di Kolom Kiri dengan jawaban di Kolom Kanan menggunakan garis berwarna otomatis.",
      tips: [
        "Klik salah satu kartu di <b>Kolom Kiri</b>, lalu klik kartu pasangannya di <b>Kolom Kanan</b>.",
        "Garis dan warna kartu otomatis sama dan tersambung.",
        "Di kolom kanan dapat memuat pilihan pengecoh (jumlah pilihan lebih banyak daripada soal).",
        "Klik tombol silang <b>[✕]</b> pada kartu jika ingin melepas atau mengganti pasangan."
      ],
      sampleQuestion: {
        id: 105,
        type: "menjodohkan",
        question_number: 1,
        points: 1,
        media_type: null,
        media_url: null,
        audio_max_plays: 3,
        question_text: "<p>Jodohkan nama surah dalam Al-Qur'an dengan artinya yang tepat:</p>",
        options_json: JSON.stringify({
          left: ["Al-Fatihah", "Al-Ikhlas", "Al-Falaq"],
          right: [
            "Pembukaan",
            "Waktu Subuh",
            "Kemurnian Keesaan Allah",
            "Manusia",
            "Hari Kiamat"
          ]
        })
      }
    },
    {
      id: "isian_singkat",
      name: "Isian Singkat",
      badge: "Teks Pendek",
      badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
      icon: "✏️",
      desc: "Menjawab pertanyaan dengan mengetikkan jawaban singkat berupa satu kata, frasa pendek, atau angka.",
      tips: [
        "Ketikkan jawaban Anda pada kolom isian yang disediakan.",
        "Pastikan ejaan kata atau angka sudah benar sebelum berpindah nomor.",
        "Jawaban akan langsung tersimpan ke sistem saat Anda mengetik."
      ],
      sampleQuestion: {
        id: 106,
        type: "isian_singkat",
        question_number: 1,
        points: 1,
        media_type: null,
        media_url: null,
        audio_max_plays: 3,
        question_text: "<p>Berapa jumlah rukun iman dalam ajaran agama Islam?</p>",
        options_json: JSON.stringify([])
      }
    },
    {
      id: "essay",
      name: "Uraian / Essay",
      badge: "Teks Panjang",
      badgeColor: "bg-rose-100 text-rose-700 border-rose-200",
      icon: "📝",
      desc: "Menjawab soal berupa penjelasan panjang, uraian konsep, atau langkah pengerjaan secara terperinci.",
      tips: [
        "Tuliskan uraian jawaban secara jelas dan terstruktur.",
        "Area ketik dapat diperluas dengan menarik handle di pojok kanan bawah.",
        "Jawaban uraian akan dikoreksi dan dinilai langsung oleh Guru pengampu."
      ],
      sampleQuestion: {
        id: 107,
        type: "essay",
        question_number: 1,
        points: 1,
        media_type: null,
        media_url: null,
        audio_max_plays: 3,
        question_text: "<p>Jelaskan secara singkat hikmah puasa di bulan Ramadhan bagi pembentukan karakter seorang muslim!</p>",
        options_json: JSON.stringify([])
      }
    }
  ];
  head("17ilvk", $$renderer, ($$renderer2) => {
    $$renderer2.title(($$renderer3) => {
      $$renderer3.push(`<title>Tata Tertib Ujian — Ujian Online Madrasah</title>`);
    });
  });
  $$renderer.push(`<div class="space-y-8 animate-in pb-10"><div class="relative rounded-3xl overflow-hidden bg-slate-900 shadow-xl"><div class="absolute inset-0"><img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&amp;auto=format&amp;fit=crop&amp;w=1400&amp;q=80" alt="Exam Preparation" class="w-full h-full object-cover opacity-30"/> <div class="absolute inset-0 bg-gradient-to-r from-indigo-900/90 to-transparent"></div></div> <div class="relative p-8 md:p-12 z-10"><span class="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-100 text-sm font-medium border border-indigo-400/30 mb-4 backdrop-blur-sm"><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Penting untuk dibaca</span> <h1 class="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">Tata Tertib &amp; Panduan Ujian</h1> <p class="text-indigo-100 max-w-2xl text-lg opacity-90 leading-relaxed">Harap membaca seluruh tata tertib dan panduan pengerjaan dengan saksama sebelum Anda memulai ujian untuk memastikan kelancaran proses evaluasi.</p></div></div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-8"><div class="lg:col-span-2 space-y-6"><div class="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm relative overflow-hidden"><div class="absolute top-0 right-0 p-8 opacity-5"><svg class="w-48 h-48" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg></div> <div class="flex items-center gap-4 mb-6 relative z-10"><div class="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg></div> <h2 class="text-2xl font-bold text-slate-800">Tata Tertib Peserta Ujian</h2></div> <ul class="space-y-4 relative z-10"><!--[-->`);
  const each_array = ensure_array_like([
    "Peserta wajib login paling lambat 15 menit sebelum ujian dimulai.",
    "Peserta dilarang keras membuka tab baru, browser lain, atau aplikasi lain selama ujian berlangsung (sistem mendeteksi perpindahan tab).",
    "Menjaga ketenangan dan tidak berkomunikasi dengan peserta lain selama ujian.",
    "Dilarang melakukan kecurangan dalam bentuk apapun. Akun yang terdeteksi melakukan kecurangan akan diblokir.",
    "Bagi peserta yang terlambat login, waktu pengerjaan tidak akan ditambah.",
    'Klik tombol "Selesai" jika sudah yakin dengan semua jawaban sebelum waktu habis.'
  ]);
  for (let i = 0, $$length = each_array.length; i < $$length; i++) {
    let rule = each_array[i];
    $$renderer.push(`<li class="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-colors"><span class="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold mt-0.5">${escape_html(i + 1)}</span> <span class="text-slate-700 leading-relaxed">${escape_html(rule)}</span></li>`);
  }
  $$renderer.push(`<!--]--></ul></div></div> <div class="space-y-6"><div class="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 md:p-8 text-white shadow-lg overflow-hidden relative"><div class="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div> <div class="absolute bottom-0 left-0 w-24 h-24 bg-purple-900/20 rounded-full blur-xl"></div> <div class="relative z-10"><div class="flex items-center gap-3 mb-6"><div class="p-2 bg-white/20 rounded-lg backdrop-blur-sm"><svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg></div> <h3 class="text-xl font-bold">Barang yang Dibawa</h3></div> <p class="text-indigo-100 text-sm mb-5 leading-relaxed">Hanya perlengkapan berikut yang boleh dibawa masuk / berada di meja ujian Anda:</p> <div class="space-y-3"><!--[-->`);
  const each_array_1 = ensure_array_like([
    {
      name: "Kartu Peserta",
      desc: "(Identitas Resmi)",
      icon: "M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h3"
    },
    {
      name: "Alat Tulis Dasar",
      desc: "(Pensil, Pena, Penghapus)",
      icon: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
    },
    {
      name: "Air Minum",
      desc: "(Botol transparan)",
      icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
    },
    {
      name: "Kertas Buram",
      desc: "(Disediakan pengawas)",
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    }
  ]);
  for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
    let item = each_array_1[$$index_1];
    $$renderer.push(`<div class="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 flex items-center gap-3"><div class="bg-white/20 p-2 rounded-lg text-white"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${attr("d", item.icon)}></path></svg></div> <div><div class="font-semibold text-sm">${escape_html(item.name)}</div> `);
    if (item.desc) {
      $$renderer.push("<!--[0-->");
      $$renderer.push(`<div class="text-xs text-indigo-200">${escape_html(item.desc)}</div>`);
    } else {
      $$renderer.push("<!--[-1-->");
    }
    $$renderer.push(`<!--]--></div></div>`);
  }
  $$renderer.push(`<!--]--></div></div></div></div></div> <div class="bg-white rounded-3xl p-6 md:p-10 border border-slate-200 shadow-sm relative overflow-hidden"><div class="text-center max-w-2xl mx-auto mb-12 relative z-10"><span class="text-indigo-600 font-semibold tracking-wider uppercase text-sm mb-2 block">Prosedur Ujian</span> <h2 class="text-3xl font-bold text-slate-800 mb-4">Alur Pengerjaan Ujian</h2> <p class="text-slate-500">Ikuti langkah-langkah berikut untuk memastikan kelancaran dalam mengerjakan ujian secara online di sistem ini.</p></div> <div class="relative z-10"><div class="hidden md:block absolute top-[40px] left-[10%] right-[10%] h-0.5 bg-slate-100 z-0"></div> <div class="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10"><!--[-->`);
  const each_array_2 = ensure_array_like([
    {
      title: "Persiapan",
      desc: "Login ke akun, pastikan koneksi internet stabil.",
      icon: "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1",
      color: "text-sky-500",
      bg: "bg-sky-50"
    },
    {
      title: "Masuk Jadwal",
      desc: "Pilih menu Jadwal Ujian, klik Buka Halaman Ujian.",
      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
      color: "text-indigo-500",
      bg: "bg-indigo-50"
    },
    {
      title: "Mengerjakan",
      desc: "Masukkan token dari pengawas, lalu kerjakan soal.",
      icon: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z",
      color: "text-purple-500",
      bg: "bg-purple-50"
    },
    {
      title: "Selesai",
      desc: "Pastikan semua terjawab, klik Selesai Ujian.",
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "text-emerald-500",
      bg: "bg-emerald-50"
    }
  ]);
  for (let i = 0, $$length = each_array_2.length; i < $$length; i++) {
    let step = each_array_2[i];
    $$renderer.push(`<div class="relative flex flex-col items-center text-center group bg-white pt-2"><div${attr_class(`w-20 h-20 rounded-2xl ${stringify(step.bg)} ${stringify(step.color)} flex items-center justify-center mb-5 shadow-sm border border-white ring-4 ring-slate-50 group-hover:scale-110 transition-transform duration-300 relative z-10`)}><svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", step.icon)}></path></svg> <div class="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-sm font-bold shadow-lg">${escape_html(i + 1)}</div></div> <h3 class="font-bold text-slate-800 text-lg mb-2">${escape_html(step.title)}</h3> <p class="text-sm text-slate-500 px-4 leading-relaxed">${escape_html(step.desc)}</p></div>`);
  }
  $$renderer.push(`<!--]--></div></div></div> <div class="bg-white rounded-3xl p-6 md:p-10 border border-slate-200 shadow-sm relative overflow-hidden"><div class="text-center max-w-2xl mx-auto mb-8 relative z-10"><span class="text-indigo-600 font-semibold tracking-wider uppercase text-sm mb-2 block">Panduan Antarmuka</span> <h2 class="text-3xl font-bold text-slate-800 mb-3">Mengenal Halaman Ujian</h2> <p class="text-slate-500 text-sm md:text-base">Geser gambar atau pilih tab di bawah untuk mempelajari setiap bagian antarmuka pengerjaan hingga proses pengumpulan ujian.</p> <div class="flex items-center justify-center gap-2 mt-6 flex-wrap"><!--[-->`);
  const each_array_3 = ensure_array_like(slides);
  for (let idx = 0, $$length = each_array_3.length; idx < $$length; idx++) {
    let slide = each_array_3[idx];
    $$renderer.push(`<button type="button"${attr_class(`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center gap-2 border ${currentSlide === idx ? "bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-600/20 ring-2 ring-indigo-500/20" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"}`)}><span${attr_class(`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${currentSlide === idx ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"}`)}>${escape_html(idx + 1)}</span> <span>${escape_html(slide.title)}</span></button>`);
  }
  $$renderer.push(`<!--]--></div></div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start"><div class="flex flex-col items-center space-y-4"><div class="relative mx-auto w-full max-w-sm rounded-2xl overflow-hidden border-4 border-slate-100 shadow-xl bg-slate-900 select-none touch-pan-y"><img${attr("src", slides[currentSlide].image)}${attr("alt", slides[currentSlide].title)} class="w-full h-auto block object-cover transition-opacity duration-300"/> <!--[-->`);
  const each_array_4 = ensure_array_like(slides[currentSlide].badges);
  for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
    let badge = each_array_4[$$index_4];
    $$renderer.push(`<button type="button"${attr_class(`absolute w-5 h-5 md:w-6 md:h-6 rounded-full ring-2 ring-white text-white flex items-center justify-center text-[10px] md:text-xs font-bold shadow-md hover:scale-125 transition-all ${activeBadge === badge.no ? "bg-rose-500 scale-125 z-10 animate-bounce" : "bg-indigo-600/95 cursor-pointer"}`)}${attr_style(`top: ${stringify(badge.top)}; left: ${stringify(badge.left)};`)}${attr("title", `Klik untuk melihat penjelasan nomor ${stringify(badge.no)}`)}>${escape_html(badge.no)}</button>`);
  }
  $$renderer.push(`<!--]--> <button type="button" class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-xs flex items-center justify-center transition-all shadow-md" title="Gambar Sebelumnya">‹</button> <button type="button" class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-xs flex items-center justify-center transition-all shadow-md" title="Gambar Selanjutnya">›</button></div> <div class="flex items-center justify-between w-full max-w-sm px-1 text-xs text-slate-400"><span>👆 Geser atau tekan panah</span> <div class="flex items-center gap-2"><div class="flex items-center gap-1.5"><!--[-->`);
  const each_array_5 = ensure_array_like(slides);
  for (let i = 0, $$length = each_array_5.length; i < $$length; i++) {
    each_array_5[i];
    $$renderer.push(`<button type="button"${attr_class(`w-2 h-2 rounded-full transition-all ${currentSlide === i ? "w-5 bg-indigo-600" : "bg-slate-300 hover:bg-slate-400"}`)}${attr("title", `Slide ${stringify(i + 1)}`)}></button>`);
  }
  $$renderer.push(`<!--]--></div> <span class="font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full text-[11px]">${escape_html(currentSlide + 1)} / ${escape_html(slides.length)}</span></div></div></div> <div class="space-y-2"><div class="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl mb-3"><h3 class="font-bold text-indigo-900 text-sm">${escape_html(slides[currentSlide].title)}</h3> <p class="text-indigo-700 text-xs mt-0.5">${escape_html(slides[currentSlide].subtitle)}</p></div> <!--[-->`);
  const each_array_6 = ensure_array_like(slides[currentSlide].items);
  for (let $$index_6 = 0, $$length = each_array_6.length; $$index_6 < $$length; $$index_6++) {
    let item = each_array_6[$$index_6];
    $$renderer.push(`<div${attr("id", `badge-desc-${stringify(item.no)}`)}${attr_class(`flex items-start gap-3.5 p-3 rounded-xl transition-all border cursor-pointer ${activeBadge === item.no ? "bg-indigo-50 border-indigo-200 shadow-sm ring-1 ring-indigo-200" : "hover:bg-slate-50 border-slate-100 bg-white"}`)}><div${attr_class(`shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold text-xs md:text-sm transition-colors ${activeBadge === item.no ? "bg-indigo-600 text-white" : "bg-indigo-100 text-indigo-700"}`)}>${escape_html(item.no)}</div> <div class="flex-1 min-w-0"><h4${attr_class(`font-bold text-slate-800 text-sm transition-colors ${activeBadge === item.no ? "text-indigo-700" : ""}`)}>${escape_html(item.title)}</h4> <p class="text-slate-500 text-xs mt-1 leading-relaxed">${escape_html(item.desc)}</p></div></div>`);
  }
  $$renderer.push(`<!--]--></div></div></div> <div class="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 md:p-10 border border-slate-200 shadow-sm relative overflow-hidden space-y-6"><div class="text-center max-w-2xl mx-auto relative z-10"><span class="text-indigo-600 font-semibold tracking-wider uppercase text-xs sm:text-sm mb-1.5 block">Format Soal</span> <h2 class="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Mengenal Tipe-Tipe Soal Ujian</h2> <p class="text-slate-500 text-xs sm:text-sm md:text-base">Pelajari karakteristik 7 model tipe soal yang digunakan dalam ujian madrasah serta coba simulasinya secara langsung.</p> <div class="flex items-center justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6 flex-wrap"><!--[-->`);
  const each_array_7 = ensure_array_like(questionTypes);
  for (let idx = 0, $$length = each_array_7.length; idx < $$length; idx++) {
    let qType = each_array_7[idx];
    $$renderer.push(`<button type="button"${attr_class(`px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs md:text-sm font-semibold transition-all flex items-center gap-1.5 border ${activeTypeTab === qType.id ? "bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-600/20 ring-2 ring-indigo-500/20" : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300"}`)}><span>${escape_html(qType.icon)}</span> <span>${escape_html(qType.name)}</span></button>`);
  }
  $$renderer.push(`<!--]--></div></div> <!--[-->`);
  const each_array_8 = ensure_array_like(questionTypes);
  for (let idx = 0, $$length = each_array_8.length; idx < $$length; idx++) {
    let qType = each_array_8[idx];
    if (activeTypeTab === qType.id) {
      $$renderer.push("<!--[0-->");
      $$renderer.push(`<div class="space-y-4 sm:space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto"><div class="grid grid-cols-1 md:grid-cols-12 gap-4 p-3.5 sm:p-5 md:p-6 bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/40 rounded-xl sm:rounded-2xl border border-indigo-100 shadow-xs items-center"><div class="md:col-span-5 space-y-2"><div class="flex items-center gap-2"><span class="text-2xl sm:text-3xl">${escape_html(qType.icon)}</span> <div><h3 class="text-base sm:text-lg font-bold text-slate-900">${escape_html(qType.name)}</h3> <span${attr_class(`inline-block px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold border mt-0.5 ${stringify(qType.badgeColor)}`)}>${escape_html(qType.badge)}</span></div></div> <p class="text-slate-600 text-xs sm:text-sm leading-relaxed">${escape_html(qType.desc)}</p></div> <div class="md:col-span-7 bg-white/95 p-3 sm:p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-1.5"><h4 class="text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5"><span>💡</span> <span>Petunjuk &amp; Cara Mengerjakan:</span></h4> <ul class="space-y-1"><!--[-->`);
      const each_array_9 = ensure_array_like(qType.tips);
      for (let $$index_8 = 0, $$length2 = each_array_9.length; $$index_8 < $$length2; $$index_8++) {
        let tip = each_array_9[$$index_8];
        $$renderer.push(`<li class="flex items-start gap-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed"><span class="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5"></span> <span>${html(tip)}</span></li>`);
      }
      $$renderer.push(`<!--]--></ul></div></div> <div class="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs overflow-hidden"><div class="flex items-center justify-between px-3 sm:px-5 py-2.5 border-b border-slate-200 bg-slate-50/80"><div class="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-slate-800"><span>🎮</span> <span>Simulasi Interaktif: Coba Jawab Soal</span></div> <span class="text-[10px] sm:text-xs font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200">✓ Coba Langsung</span></div> <div class="p-3 sm:p-6 md:p-8">`);
      QuestionRenderer($$renderer, {
        question: qType.sampleQuestion,
        answer: demoAnswers[qType.id] || ""
      });
      $$renderer.push(`<!----></div></div> <div class="flex items-center justify-between gap-2 pt-1 w-full"><button type="button" class="px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-semibold text-xs sm:text-sm transition-all flex items-center gap-1.5 shadow-xs shrink-0"><svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg> <span class="hidden sm:inline">Tipe</span> <span>Sebelumnya</span></button> <div class="text-[11px] sm:text-xs font-bold text-slate-600 bg-slate-100 px-2.5 sm:px-3.5 py-1.5 rounded-full border border-slate-200 whitespace-nowrap text-center"><span class="hidden sm:inline">Tipe Soal</span>${escape_html(idx + 1)} / ${escape_html(questionTypes.length)}</div> <button type="button" class="px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-1.5 shadow-sm shadow-indigo-600/20 shrink-0"><span class="hidden sm:inline">Tipe</span> <span>Selanjutnya</span> <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></button></div></div>`);
    } else {
      $$renderer.push("<!--[-1-->");
    }
    $$renderer.push(`<!--]-->`);
  }
  $$renderer.push(`<!--]--></div> <div class="rounded-3xl overflow-hidden shadow-md relative h-48 md:h-64 mt-8 group"><img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&amp;auto=format&amp;fit=crop&amp;w=1200&amp;q=80" alt="Sukses Ujian" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"/> <div class="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent flex flex-col items-center justify-end pb-8 text-center px-4"><h3 class="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-md">Semoga Berhasil!</h3> <p class="text-slate-200 md:text-lg drop-shadow">Kejujuran adalah kunci kesuksesan yang sesungguhnya.</p></div></div></div>`);
}
export {
  _page as default
};
