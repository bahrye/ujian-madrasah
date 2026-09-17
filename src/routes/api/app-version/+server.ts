import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	// Endpoint informasi versi resmi aplikasi Exambro Android
	return json({
		versionCode: 6,
		versionName: '1.0.5',
		downloadUrl: 'https://github.com/bahrye/ujian-madrasah/releases/latest/download/ExambroMadrasah.apk',
		changelog: '1. Perbaikan stabilitas startup: Mengatasi force close / aplikasi tidak bisa dibuka saat pertama kali diinstal.\n2. Penguncian Kiosk Mode (LockTask): Tombol Home, Recent Apps, dan gesture keluar dinonaktifkan saat ujian aktif.\n3. Pemblokiran bilah status atas (hanya dapat dibuka jika ujian dijeda pengawas).\n4. Proteksi PIN Keluar Pengawas.\n5. Link unduh langsung file aplikasi resmi (.apk).'
	});
};
