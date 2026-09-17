import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	// Endpoint informasi versi resmi aplikasi Exambro Android
	return json({
		versionCode: 4,
		versionName: '1.0.3',
		downloadUrl: 'https://github.com/bahrye/ujian-madrasah/releases',
		changelog: '1. Mode layar penuh langsung aktif otomatis di lembar soal ujian tanpa terblokir tombol.\n2. Blokir bilah status & tarikan notifikasi atas saat ujian (otomatis dibuka saat ujian dijeda pengawas untuk menyalakan data/WiFi).\n3. Konfirmasi kembali ke Beranda saat tombol kembali ditekan di halaman login setelah keluar akun.\n4. Integrasi PIN keluar ujian acak per ujian.'
	});
};
