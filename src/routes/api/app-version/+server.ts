import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	// Endpoint informasi versi resmi aplikasi Exambro Android
	return json({
		versionCode: 8,
		versionName: '1.0.7',
		downloadUrl: 'https://github.com/bahrye/ujian-madrasah/releases/latest/download/ExambroMadrasah.apk',
		changelog: '1. Fitur PIN Master Kustom: Administrator madrasah dapat mengubah PIN Master darurat melalui menu Pengaturan APK di web admin.\n2. Proteksi PIN Default: PIN default 12345 otomatis dinonaktifkan jika madrasah sudah menyetel PIN Master khusus.\n3. Sinkronisasi Instan: PIN Master langsung disinkronkan ke perangkat siswa saat ujian dimulai.\n4. Perbaikan penyematan aplikasi & polling status ujian.'
	});
};
