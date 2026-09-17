import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	// Endpoint informasi versi resmi aplikasi Exambro Android
	return json({
		versionCode: 2,
		versionName: '1.0.1',
		downloadUrl: 'https://github.com/bahrye/ujian-madrasah/actions',
		changelog: '1. Tanda tangan resmi rilis agar tidak terdeteksi sebagai aplikasi palsu.\n2. Mendukung pembaruan langsung tanpa harus menghapus aplikasi lama.\n3. Peningkatan kestabilan dan proteksi ujian.'
	});
};
