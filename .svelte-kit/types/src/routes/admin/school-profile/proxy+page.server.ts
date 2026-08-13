// @ts-nocheck
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load = async ({ locals, platform }: Parameters<PageServerLoad>[0]) => {
	const db = getDB(platform);
	const school = await db
		.prepare('SELECT * FROM schools WHERE id = ?')
		.bind(locals.user!.school_id)
		.first();

	return { school };
};

export const actions = {
	// Simpan logo saja — dipanggil segera setelah upload ke Cloudinary berhasil
	saveLogo: async ({ request, locals, platform }: import('./$types').RequestEvent) => {
		const db = getDB(platform);
		const data = await request.formData();
		const logo_url = data.get('logo_url')?.toString().trim() || null;

		try {
			await db
				.prepare(`UPDATE schools SET logo_url = ?, updated_at = datetime('now') WHERE id = ?`)
				.bind(logo_url, locals.user!.school_id)
				.run();

			return { success: true, message: 'Logo berhasil disimpan.' };
		} catch (e) {
			console.error(e);
			return fail(500, { error: 'Gagal menyimpan logo.' });
		}
	},

	update: async ({ request, locals, platform }: import('./$types').RequestEvent) => {
		const db = getDB(platform);
		const data = await request.formData();

		const name = data.get('name')?.toString().trim();
		const principal_name = data.get('principal_name')?.toString().trim() || null;
		const principal_nip = data.get('principal_nip')?.toString().trim() || null;
		const npsn = data.get('npsn')?.toString().trim() || null;
		const phone = data.get('phone')?.toString().trim() || null;
		const email = data.get('email')?.toString().trim() || null;
		const address = data.get('address')?.toString().trim() || null;
		const province = data.get('province')?.toString().trim() || null;
		const city = data.get('city')?.toString().trim() || null;
		const district = data.get('district')?.toString().trim() || null;
		const village = data.get('village')?.toString().trim() || null;
		const postal_code = data.get('postal_code')?.toString().trim() || null;
		const accreditation = data.get('accreditation')?.toString().trim() || null;
		const website = data.get('website')?.toString().trim() || null;
		const logo_url = data.get('logo_url')?.toString().trim() || null;

		if (!name) {
			return fail(400, { error: 'Nama sekolah wajib diisi.' });
		}

		try {
			await db
				.prepare(
					`UPDATE schools SET
						name = ?, principal_name = ?, principal_nip = ?, npsn = ?, phone = ?, email = ?,
						address = ?, province = ?, city = ?, district = ?, village = ?, postal_code = ?,
						accreditation = ?, website = ?, logo_url = ?,
						updated_at = datetime('now')
					WHERE id = ?`
				)
				.bind(
					name,
					principal_name,
					principal_nip,
					npsn,
					phone,
					email,
					address,
					province,
					city,
					district,
					village,
					postal_code,
					accreditation,
					website,
					logo_url,
					locals.user!.school_id
				)
				.run();

			return { success: true, message: 'Profil sekolah berhasil disimpan.' };
		} catch (e) {
			console.error(e);
			return fail(500, { error: 'Gagal menyimpan profil sekolah.' });
		}
	}
};
;null as any as Actions;