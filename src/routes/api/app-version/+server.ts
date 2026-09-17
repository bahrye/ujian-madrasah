import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	// Endpoint informasi versi resmi aplikasi Exambro Android
	return json({
		versionCode: 5,
		versionName: '1.0.4',
		downloadUrl: 'https://github.com/bahrye/ujian-madrasah/releases',
		changelog: '1. Penguncian total Kiosk Mode (LockTask): Tombol Home, Recent Apps, dan gesture navigasi keluar dinonaktifkan total saat mengerjakan soal ujian.\n2. Pemblokiran mutlak tarikan bilah status/notifikasi atas (hanya dapat dibuka jika ujian dijeda sementara oleh pengawas).\n3. Proteksi PIN Keluar Pengawas: Siswa tidak bisa menutup atau mengecilkan aplikasi sebelum pengawas memasukkan PIN keluar.'
	});
};
