import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load: LayoutServerLoad = async ({ locals, platform, request, url }) => {
	if (!locals.user || locals.user.role !== 'siswa') throw redirect(302, '/login');

	const isExambroNoticePage = url.pathname === '/siswa/wajib-exambro';
	const userAgent = request.headers.get('user-agent') || '';
	const isExambroApp = userAgent.includes('ExambroMadrasah');

	let schoolName = '';
	let userInfo: any = {};
	let requireExambro = 0;

	try {
		const db = getDB(platform);
		let schoolId = locals.user.school_id;
		if (!schoolId) {
			const u = await db.prepare('SELECT school_id FROM users WHERE id = ?')
				.bind(locals.user.id)
				.first<{ school_id: number | null }>();
			schoolId = u?.school_id ?? null;
		}
		if (schoolId) {
			const school = await db.prepare('SELECT name, require_exambro FROM schools WHERE id = ?').bind(schoolId).first<{ name: string; require_exambro: number }>();
			schoolName = school?.name || '';
			requireExambro = school?.require_exambro || 0;
		} else {
			const firstSchool = await db.prepare('SELECT name, require_exambro FROM schools ORDER BY id ASC LIMIT 1').first<{ name: string; require_exambro: number }>();
			schoolName = firstSchool?.name || '';
			requireExambro = firstSchool?.require_exambro || 0;
		}
		userInfo.school_name = schoolName;

		const student = await db.prepare('SELECT nisn, nomor_peserta, place_of_birth, date_of_birth FROM users WHERE id = ?')
			.bind(locals.user.id)
			.first<{ nisn: string | null; nomor_peserta: string | null; place_of_birth: string | null; date_of_birth: string | null }>();
		if (student) {
			userInfo.nisn = student.nisn;
			userInfo.nomor_peserta = student.nomor_peserta;
			userInfo.place_of_birth = student.place_of_birth;
			userInfo.date_of_birth = student.date_of_birth;
		}
	} catch (e) {
		console.warn('Failed to load siswa school/student data:', e);
	}

	if (requireExambro === 1) {
		if (!isExambroApp && !isExambroNoticePage) {
			throw redirect(302, '/siswa/wajib-exambro');
		} else if (isExambroApp && isExambroNoticePage) {
			throw redirect(302, '/siswa');
		}
	}

	return { user: locals.user, schoolName, userInfo, isExambroApp, requireExambro };
};

