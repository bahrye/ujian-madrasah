# 📱 Exambro Madrasah (Exam Browser Android)

Aplikasi klien Android resmi untuk **Ujian Online Madrasah**, dirancang dengan sistem keamanan **Kiosk / Anti-Kecurangan** untuk mencegah siswa membuka aplikasi lain selama ujian berlangsung.

---

## 🛡️ Fitur Keamanan Anti-Kecurangan

1. **Anti-Screenshot & Layar Hitam (`FLAG_SECURE`)**:
   - Mencegah siswa mengambil tangkapan layar (*screenshot*) atau merekam layar (*screen recording*).
   - Tampilan *recent tasks preview* otomatis disamarkan oleh sistem Android.
2. **Kiosk Mode / Immersive Fullscreen**:
   - Status bar (jam, baterai, notifikasi) dan tombol navigasi (*Back*, *Home*, *Recent Apps*) disembunyikan secara otomatis.
3. **Cegah Tombol Keluar (Back Intercept)**:
   - Menekan tombol *Back* tidak akan menutup ujian. Diperlukan **PIN Pengawas** untuk keluar dari aplikasi.
4. **Deteksi Keluar Aplikasi (Home / Recent / Floating Apps)**:
   - Jika siswa berhasil meminimalisir aplikasi atau membuka aplikasi lain (seperti WhatsApp, Google, ChatGPT), sistem akan mencatat pelanggaran dan menampilkan dialog peringatan resmi saat siswa kembali ke aplikasi ujian.
5. **Dukungan Kamera (QR Scanner)**:
   - WebView sudah dikonfigurasi untuk mengizinkan akses kamera perangkat secara langsung demi kelancaran fitur scan QR Code token ujian.
6. **Custom User-Agent**:
   - Browser mengirimkan header `ExambroMadrasah/1.0` ke server ujian.

---

## ⚙️ Pengaturan Default

* **URL Ujian Default**: `https://ujian-madrasah.vercel.app`
* **PIN Pengawas Default**: `12345`

### Cara Mengubah URL Server di Aplikasi (Oleh Pengawas):
1. Jika server ujian berpindah domain atau menggunakan IP Wi-Fi lokal madrasah:
2. **Ketuk 3 kali cepat** pada pojok kanan atas layar (atau klik tombol **Pengaturan URL** saat layar koneksi error muncul).
3. Masukkan PIN Pengawas (`12345`).
4. Masukkan URL baru, lalu tekan **Simpan & Muat Ulang**.
5. Di menu ini pengawas juga bisa melihat atau mereset jumlah pelanggaran siswa.

---

## 🚀 Cara Menghasilkan File APK (2 Cara)

### Opsi 1: Build Otomatis via GitHub Actions (Paling Mudah, Tanpa Install Apapun di Laptop)

Jika proyek ini terhubung dengan repositori GitHub Anda:
1. Lakukan `git push` ke GitHub.
2. Buka repositori Anda di browser GitHub.
3. Klik tab **Actions**.
4. Pilih workflow **Build Android Exambro APK** di sisi kiri.
5. Setelah build selesai (sekitar 1-2 menit), klik hasil workflow tersebut.
6. Pada bagian **Artifacts** di bagian bawah, unduh file zip bernama **`Exambro-Madrasah-APK`**.
7. Ekstrak zip tersebut untuk mendapatkan file `app-debug.apk` yang siap diinstal di ponsel Android siswa.

---

### Opsi 2: Build Menggunakan Android Studio (Lokal di Laptop)

1. Unduh dan buka **Android Studio**.
2. Pilih menu **File** > **Open**, lalu arahkan ke folder:
   `ujian-madrasah/android-exambro`
3. Tunggu hingga proses Gradle Sync selesai secara otomatis.
4. Untuk menghasilkan file APK:
   - Klik menu **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
5. Setelah selesai, klik notifikasi **locate** untuk mengambil file `app-debug.apk`.
6. Bagikan file `.apk` tersebut kepada siswa melalui flashdisk, WhatsApp, atau link Google Drive.
