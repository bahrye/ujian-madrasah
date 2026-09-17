import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals, platform }) => {
	if (!locals.user) throw redirect(302, '/login');
	if (locals.user.role !== 'admin' && locals.user.role !== 'superadmin') {
		throw redirect(302, '/');
	}

	const db = getDB(platform);
	const school = await db
		.prepare('SELECT id, name, npsn, require_exambro FROM schools WHERE id = ?')
		.bind(locals.user.school_id)
		.first<{ id: number; name: string; npsn: string; require_exambro: number }>();

	return {
		school: school || { id: locals.user.school_id, name: '', npsn: '', require_exambro: 0 }
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

		try {
			await db
				.prepare(`UPDATE schools SET require_exambro = ?, updated_at = datetime('now') WHERE id = ?`)
				.bind(require_exambro, locals.user.school_id)
				.run();

			return {
				success: true,
				message: require_exambro === 1
					? 'Pengaturan berhasil disimpan: Siswa WAJIB menggunakan aplikasi Exambro Madrasah.'
					: 'Pengaturan berhasil disimpan: Siswa dapat menggunakan browser web biasa maupun aplikasi Exambro.'
			};
		} catch (e: any) {
			console.error('Error updating require_exambro:', e);
			return fail(500, { error: 'Gagal menyimpan pengaturan APK: ' + (e.message || String(e)) });
		}
	}
};
