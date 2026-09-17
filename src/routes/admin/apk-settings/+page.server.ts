import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals, platform, url }) => {
	if (!locals.user) throw redirect(302, '/login');
	if (locals.user.role !== 'admin' && locals.user.role !== 'superadmin') {
		throw redirect(302, '/');
	}

	const db = getDB(platform);

	// Pastikan kolom master_exit_pin tersedia di database (PostgreSQL Neon & SQLite D1)
	try {
		await db.prepare('ALTER TABLE schools ADD COLUMN IF NOT EXISTS master_exit_pin TEXT').run();
	} catch (_) {
		try {
			await db.prepare('ALTER TABLE schools ADD COLUMN master_exit_pin TEXT').run();
		} catch (_) {}
	}

	let schoolId = locals.user.school_id;
	if (!schoolId) {
		const u = await db.prepare('SELECT school_id FROM users WHERE id = ?')
			.bind(locals.user.id)
			.first<{ school_id: number | null }>();
		schoolId = u?.school_id ?? null;
	}

	const isSuperAdmin = locals.user.role === 'superadmin' || locals.user.school_id === null;
	let allSchools: { id: number; name: string; npsn: string | null; require_exambro: number; master_exit_pin: string | null }[] = [];

	if (isSuperAdmin) {
		try {
			const schoolsRes = await db.prepare('SELECT id, name, npsn, require_exambro, master_exit_pin FROM schools ORDER BY id ASC').all<any>();
			allSchools = schoolsRes.results || [];
		} catch (_) {
			const schoolsRes = await db.prepare('SELECT id, name, npsn, require_exambro FROM schools ORDER BY id ASC').all<any>();
			allSchools = (schoolsRes.results || []).map((s: any) => ({ ...s, master_exit_pin: null }));
		}
		
		const requestedSchoolId = url.searchParams.get('school_id');
		if (requestedSchoolId) {
			const parsed = parseInt(requestedSchoolId, 10);
			if (!isNaN(parsed) && allSchools.some(s => s.id === parsed)) {
				schoolId = parsed;
			}
		}
	}

	if (!schoolId && allSchools.length > 0) {
		schoolId = allSchools[0].id;
	}

	let school = null;
	if (schoolId) {
		try {
			school = await db
				.prepare('SELECT id, name, npsn, require_exambro, master_exit_pin FROM schools WHERE id = ?')
				.bind(schoolId)
				.first<{ id: number; name: string; npsn: string; require_exambro: number; master_exit_pin: string | null }>();
		} catch (_) {
			school = await db
				.prepare('SELECT id, name, npsn, require_exambro FROM schools WHERE id = ?')
				.bind(schoolId)
				.first<any>();
			if (school) school.master_exit_pin = null;
		}
	}

	if (!school) {
		try {
			const firstSchool = await db.prepare('SELECT id, name, npsn, require_exambro, master_exit_pin FROM schools ORDER BY id ASC LIMIT 1').first<any>();
			school = firstSchool;
		} catch (_) {
			const firstSchool = await db.prepare('SELECT id, name, npsn, require_exambro FROM schools ORDER BY id ASC LIMIT 1').first<any>();
			school = firstSchool;
			if (school) school.master_exit_pin = null;
		}
	}

	return {
		school: school || { id: 1, name: 'Madrasah', npsn: '', require_exambro: 0, master_exit_pin: null },
		allSchools,
		isSuperAdmin,
		selectedSchoolId: school?.id || schoolId || 1
	};
};

export const actions: Actions = {
	update: async ({ request, locals, platform }) => {
		if (!locals.user) return fail(401, { error: 'Unauthorized' });
		if (locals.user.role !== 'admin' && locals.user.role !== 'superadmin') {
			return fail(403, { error: 'Hanya administrator yang dapat mengubah pengaturan ini.' });
		}

		const db = getDB(platform);
		const data = await request.formData();
		const require_exambro = data.get('require_exambro') === '1' ? 1 : 0;
		const applyAll = data.get('apply_all') === '1';

		let targetSchoolId = locals.user.school_id;
		const formSchoolId = data.get('school_id')?.toString();
		if (formSchoolId) {
			const parsed = parseInt(formSchoolId, 10);
			if (!isNaN(parsed) && (locals.user.role === 'superadmin' || locals.user.school_id === parsed || locals.user.school_id === null)) {
				targetSchoolId = parsed;
			}
		}

		if (!targetSchoolId && locals.user.role === 'superadmin') {
			const firstSchool = await db.prepare('SELECT id FROM schools ORDER BY id ASC LIMIT 1').first<{ id: number }>();
			targetSchoolId = firstSchool?.id ?? null;
		}

		if (!targetSchoolId && !applyAll) {
			return fail(400, { error: 'Sekolah sasaran tidak ditemukan.' });
		}

		try {
			if (locals.user.role === 'superadmin' && applyAll) {
				await db
					.prepare(`UPDATE schools SET require_exambro = ?, updated_at = datetime('now')`)
					.bind(require_exambro)
					.run();

				return {
					success: true,
					require_exambro,
					message: require_exambro === 1
						? 'Pengaturan berhasil disimpan untuk SEMUA madrasah: Siswa WAJIB menggunakan aplikasi Exambro.'
						: 'Pengaturan berhasil disimpan untuk SEMUA madrasah: Mode bebas (Web & APK) aktif.'
				};
			} else {
				await db
					.prepare(`UPDATE schools SET require_exambro = ?, updated_at = datetime('now') WHERE id = ?`)
					.bind(require_exambro, targetSchoolId)
					.run();

				return {
					success: true,
					require_exambro,
					message: require_exambro === 1
						? 'Pengaturan berhasil disimpan: Siswa WAJIB menggunakan aplikasi Exambro Madrasah.'
						: 'Pengaturan berhasil disimpan: Siswa dapat menggunakan browser web biasa maupun aplikasi Exambro.'
				};
			}
		} catch (e: any) {
			console.error('Error updating require_exambro:', e);
			return fail(500, { error: 'Gagal menyimpan pengaturan APK: ' + (e.message || String(e)) });
		}
	},

	update_pin: async ({ request, locals, platform }) => {
		if (!locals.user) return fail(401, { error: 'Unauthorized' });
		if (locals.user.role !== 'admin' && locals.user.role !== 'superadmin') {
			return fail(403, { error: 'Hanya administrator yang dapat mengubah PIN master.' });
		}

		const db = getDB(platform);
		const data = await request.formData();
		const newPin = data.get('master_exit_pin')?.toString().trim() || '';

		// Validasi: hanya angka, panjang 4-8 digit
		if (!/^\d{4,8}$/.test(newPin)) {
			return fail(400, { error: 'PIN Master harus berupa angka dengan panjang 4 hingga 8 digit.' });
		}

		let targetSchoolId = locals.user.school_id;
		const formSchoolId = data.get('school_id')?.toString();
		if (formSchoolId) {
			const parsed = parseInt(formSchoolId, 10);
			if (!isNaN(parsed) && (locals.user.role === 'superadmin' || locals.user.school_id === parsed || locals.user.school_id === null)) {
				targetSchoolId = parsed;
			}
		}

		if (!targetSchoolId) {
			const firstSchool = await db.prepare('SELECT id FROM schools ORDER BY id ASC LIMIT 1').first<{ id: number }>();
			targetSchoolId = firstSchool?.id ?? null;
		}

		if (!targetSchoolId) return fail(400, { error: 'Sekolah tidak ditemukan.' });

		try {
			// Tambahkan kolom jika belum ada (untuk kompatibilitas database lama)
			try {
				await db.prepare(`ALTER TABLE schools ADD COLUMN master_exit_pin TEXT`).run();
			} catch (_) { /* kolom sudah ada */ }

			await db
				.prepare(`UPDATE schools SET master_exit_pin = ?, updated_at = datetime('now') WHERE id = ?`)
				.bind(newPin, targetSchoolId)
				.run();

			return {
				success_pin: true,
				master_exit_pin: newPin,
				message: `PIN Master Pengawas berhasil diperbarui menjadi: ${newPin}`
			};
		} catch (e: any) {
			console.error('Error updating master_exit_pin:', e);
			return fail(500, { error: 'Gagal menyimpan PIN Master: ' + (e.message || String(e)) });
		}
	}
};
