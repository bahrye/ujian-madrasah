# 📝 Ujian Online Madrasah

Aplikasi ujian online modern untuk Madrasah, dibangun dengan **SvelteKit** + **Cloudflare Pages** + **Cloudflare D1**.

## 🚀 Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | SvelteKit 2 (Svelte 4) |
| Styling | Tailwind CSS 3 |
| Database | Cloudflare D1 (SQLite at Edge) |
| Auth | JWT (jose) + HttpOnly Cookie |
| Deployment | Cloudflare Pages |

## 📋 Fitur

### 4 Role dengan Hak Akses Berbeda

- **Admin** — Manajemen pengguna, ujian, dan hasil
- **Guru** — Bank soal (5 tipe), penilaian essay/isian
- **Pengawas** — Generate & rilis token, monitoring real-time
- **Siswa** — Dashboard ujian, input token, pengerjaan soal

### 5 Tipe Soal
1. Pilihan Ganda
2. Isian Singkat
3. Essay / Uraian
4. Benar / Salah
5. Menjodohkan (Matching Pair)

### Fitur Ujian
- Timer countdown (berubah warna saat kritis)
- Navigasi nomor soal dengan status warna
- Tandai ragu-ragu
- Auto-save jawaban
- Audio player kustom dengan batasan putar
- Koreksi otomatis (objektif) + manual (essay)

## 🛠️ Setup & Deployment

### Prerequisites
- Node.js 18+
- Wrangler CLI (`npm i -g wrangler`)
- Akun Cloudflare

### 1. Install Dependencies
```bash
cd ujian-madrasah
npm install
```

### 2. Buat Database D1
```bash
npm run db:create
```

Salin `database_id` dari output ke `wrangler.toml`.

### 3. Jalankan Migrasi
```bash
# Lokal
npm run db:migrate:local

# Remote (production)
npm run db:migrate
```

### 4. Development Lokal
```bash
npm run dev
```

Buka `http://localhost:5173`.

### 5. Inisialisasi Data Dummy
Kunjungi `/api/setup` di browser untuk membuat data awal (hanya bisa dijalankan sekali).

### 6. Multi-Hosting Deployment

Aplikasi ini mendukung **Dual/Multi-Hosting** secara simultan di **Cloudflare Pages** dan **Vercel** (`.vercel.app`) tanpa konflik:

#### A. Deploy ke Cloudflare Pages
1. Build & deploy langsung via CLI:
   ```bash
   npm run deploy
   ```
2. Atau jika dihubungkan dengan Git di Cloudflare Pages Dashboard:
   - **Framework Preset**: SvelteKit
   - **Build command**: `npm run build`
   - **Build output directory**: `.svelte-kit/cloudflare`
   - **Environment Variables**: Masukkan `DATABASE_URL` (Neon PostgreSQL) dan variabel lainnya.

#### B. Deploy ke Vercel (vercel.app)
1. Hubungkan repository Git ke **Vercel Dashboard** (atau gunakan `vercel` CLI).
2. Vercel akan otomatis mengenali framework SvelteKit.
3. **Environment Variables**: Masukkan variabel berikut di menu **Settings -> Environment Variables** di Vercel:
   - `DATABASE_URL` — String koneksi Neon PostgreSQL Serverless Anda.
   - `JWT_SECRET` — Kunci enkripsi sesi (opsional).
   - `PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — Kredensial media Cloudinary (opsional).
4. Klik **Deploy**. SvelteKit secara otomatis mendeteksi runtime Vercel dan menggunakan `@sveltejs/adapter-vercel` dengan region serverless Singapura (`sin1`).

#### Skrip Build Manual (Lokal)
- Uji build untuk Cloudflare: `npm run build:cf` (atau default `npm run build`)
- Uji build untuk Vercel: `npm run build:vercel`

## 🔐 Kredensial Default

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Guru | `guru1` | `guru123` |
| Pengawas | `pengawas1` | `pengawas123` |
| Siswa | `siswa1` | `siswa123` |
| Siswa | `siswa2` | `siswa123` |
| Siswa | `siswa3` | `siswa123` |

> ⚠️ **Ganti password default sebelum digunakan di production!**

## 📁 Struktur Proyek

```
ujian-madrasah/
├── src/
│   ├── lib/
│   │   ├── server/          # Auth, DB helpers
│   │   ├── components/      # Svelte components
│   │   │   ├── layout/      # AppShell, Sidebar, Navbar
│   │   │   ├── exam/        # Timer, AudioPlayer, QuestionRenderer
│   │   │   ├── dashboard/   # StatCard
│   │   │   └── ui/          # Toast
│   │   ├── stores/          # Svelte stores
│   │   └── utils/           # Constants, helpers
│   ├── routes/
│   │   ├── admin/           # Admin pages
│   │   ├── guru/            # Guru pages
│   │   ├── pengawas/        # Pengawas pages
│   │   ├── siswa/           # Siswa pages
│   │   ├── api/             # API endpoints
│   │   └── login/           # Login page
│   ├── app.html             # HTML shell
│   ├── app.css              # Tailwind + custom styles
│   └── hooks.server.ts      # Auth middleware
├── schema.sql               # Database schema
├── wrangler.toml             # Cloudflare config
└── package.json
```

## 📄 Lisensi

MIT License
