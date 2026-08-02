import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals, platform }) => {
	const db = getDB(platform);

	const { results: subjects } = await db.prepare(
		'SELECT * FROM subjects WHERE school_id = ? ORDER BY name ASC'
	).bind(locals.user!.school_id).all();

	return { subjects };
};

export const actions: Actions = {
	add: async ({ request, locals, platform }) => {
		const db = getDB(platform);
		const data = await request.formData();
		const name = data.get('name')?.toString().trim();
		const code = data.get('code')?.toString().trim() || null;

		if (!name) {
			return fail(400, { error: 'Nama mata pelajaran wajib diisi' });
		}

		try {
			await db.prepare('INSERT INTO subjects (school_id, name, code) VALUES (?, ?, ?)')
				.bind(locals.user!.school_id, name, code)
				.run();
			
			return { success: true };
		} catch (e) {
			return fail(500, { error: 'Gagal menambahkan mata pelajaran' });
		}
	},
	edit: async ({ request, locals, platform }) => {
		const db = getDB(platform);
		const data = await request.formData();
		const id = data.get('id')?.toString();
		const name = data.get('name')?.toString().trim();
		const code = data.get('code')?.toString().trim() || null;

		if (!id || !name) return fail(400, { error: 'ID dan Nama wajib diisi' });

		try {
			await db.prepare('UPDATE subjects SET name = ?, code = ?, updated_at = datetime("now") WHERE id = ? AND school_id = ?')
				.bind(name, code, id, locals.user!.school_id)
				.run();
			
			return { success: true };
		} catch (e) {
			return fail(500, { error: 'Gagal mengupdate mata pelajaran' });
		}
	},
	delete: async ({ request, locals, platform }) => {
		const db = getDB(platform);
		const data = await request.formData();
		const id = data.get('id')?.toString();

		if (!id) return fail(400, { error: 'ID tidak valid' });

		try {
			await db.prepare('DELETE FROM subjects WHERE id = ? AND school_id = ?').bind(id, locals.user!.school_id).run();
			return { success: true };
		} catch (e) {
			return fail(500, { error: 'Gagal menghapus mata pelajaran' });
		}
	}
};
