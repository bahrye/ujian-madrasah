import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	// Endpoint informasi versi resmi aplikasi Exambro Android
	return json({
		versionCode: 3,
		versionName: '1.0.2',
		downloadUrl: 'https://github.com/bahrye/ujian-madrasah/actions',
		changelog: '1. Menu Beranda Awal (Masuk Ujian, Cek Update, Tentang Kami).\n2. Informasi profil pembuat & kontak WhatsApp pembuat.\n3. Tanda tangan resmi rilis bebas deteksi aplikasi palsu.\n4. Pembaruan langsung tanpa harus hapus aplikasi lama.'
	});
};
