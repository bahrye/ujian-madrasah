import type { LayoutServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load: LayoutServerLoad = async ({ locals, platform }) => {
	let userInfo: any = null;
	let schoolName = '';

	if (locals.user) {
		try {
			const db = getDB(platform);
			userInfo = {};

			let schoolId = locals.user.school_id;
			if (!schoolId) {
				const dbUser = await db.prepare('SELECT school_id FROM users WHERE id = ?')
					.bind(locals.user.id)
					.first<{ school_id: number | null }>();
				schoolId = dbUser?.school_id ?? null;
			}

			if (schoolId) {
				const school = await db.prepare('SELECT name FROM schools WHERE id = ?')
					.bind(schoolId)
					.first<{ name: string }>();
				if (school) {
					userInfo.school_name = school.name;
					schoolName = school.name;
				}
			} else {
				// Fallback jika user belum di-assign school_id secara eksplisit
				const firstSchool = await db.prepare('SELECT name FROM schools ORDER BY id ASC LIMIT 1')
					.first<{ name: string }>();
				if (firstSchool) {
					userInfo.school_name = firstSchool.name;
					schoolName = firstSchool.name;
				}
			}

			if (locals.user.role === 'siswa') {
				const student = await db.prepare('SELECT nisn, nomor_peserta, place_of_birth, date_of_birth FROM users WHERE id = ?')
					.bind(locals.user.id)
					.first<{ nisn: string | null; nomor_peserta: string | null; place_of_birth: string | null; date_of_birth: string | null }>();
				if (student) {
					userInfo.nisn = student.nisn;
					userInfo.nomor_peserta = student.nomor_peserta;
					userInfo.place_of_birth = student.place_of_birth;
					userInfo.date_of_birth = student.date_of_birth;
				}
			} else if (locals.user.role === 'guru' || locals.user.role === 'pengawas') {
				const staff = await db.prepare('SELECT nip FROM users WHERE id = ?')
					.bind(locals.user.id)
					.first<{ nip: string | null }>();
				if (staff?.nip) {
					userInfo.nip = staff.nip;
				}
			}
		} catch (e) {
			console.warn('Gagal memuat userInfo / schoolName di root layout:', e);
		}
	}

	return {
		user: locals.user,
		userInfo,
		schoolName
	};
};
