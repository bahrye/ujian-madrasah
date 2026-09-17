import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	// Mengarahkan langsung ke direct download link file APK resmi Exambro Madrasah
	throw redirect(302, 'https://github.com/bahrye/ujian-madrasah/releases/latest/download/ExambroMadrasah.apk');
};
