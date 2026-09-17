import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	// Endpoint informasi versi resmi aplikasi Exambro Android
	return json({
		versionCode: 7,
		versionName: '1.0.6',
		downloadUrl: 'https://github.com/bahrye/ujian-madrasah/releases/latest/download/ExambroMadrasah.apk',
		changelog: '1. Perbaikan PIN Pengawas: PIN keluar ujian kini diambil langsung dari server setiap 15 detik (tidak bergantung pada injeksi web), sehingga PIN di dialog APK selalu cocok dengan PIN di halaman Monitoring Pengawas.\n2. Perbaikan Penyematan saat Ditahan: Saat ujian ditahan pengawas, aplikasi dapat dicabut dari mode penyematan (LockTask dilepas, bilah status muncul).\n3. Perbaikan PIN salah tidak memicu pelanggaran saat ujian ditahan.\n4. Perbaikan stabilitas startup (v1.0.5).'
	});
};
