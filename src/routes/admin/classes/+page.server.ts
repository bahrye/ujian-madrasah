import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals, platform }) => {
	const db = getDB(platform);

	const { results: classes } = await db.prepare(
		'SELECT c.*, COUNT(u.id) as student_count FROM classes c LEFT JOIN users u ON c.id = u.class_id WHERE c.school_id = ? GROUP BY c.id ORDER BY c.level ASC, c.name ASC'
	).bind(locals.user!.school_id).all();

	return { classes };
};

export const actions: Actions = {
	add: async ({ request, locals, platform }) => {
		const db = getDB(platform);
		const data = await request.formData();
		const name = data.get('name')?.toString().trim();
		const level = data.get('level')?.toString().trim() || null;

		if (!name) {
			return fail(400, { error: 'Nama kelas wajib diisi' });
		}

		try {
			await db.prepare('INSERT INTO classes (school_id, name, level) VALUES (?, ?, ?)')
				.bind(locals.user!.school_id, name, level)
				.run();
			
			return { success: true };
		} catch (e) {
			return fail(500, { error: 'Gagal menambahkan kelas' });
		}
	},
	edit: async ({ request, locals, platform }) => {
		const db = getDB(platform);
		const data = await request.formData();
		const id = data.get('id')?.toString();
		const name = data.get('name')?.toString().trim();
		const level = data.get('level')?.toString().trim() || null;

		if (!id || !name) return fail(400, { error: 'ID dan Nama kelas wajib diisi' });

		try {
			await db.prepare('UPDATE classes SET name = ?, level = ?, updated_at = datetime("now") WHERE id = ? AND school_id = ?')
				.bind(name, level, id, locals.user!.school_id)
				.run();
			
			return { success: true };
		} catch (e) {
			return fail(500, { error: 'Gagal mengupdate kelas' });
		}
	},
	delete: async ({ request, locals, platform }) => {
		const db = getDB(platform);
		const data = await request.formData();
		const id = data.get('id')?.toString();

		if (!id) return fail(400, { error: 'ID tidak valid' });

		try {
			await db.prepare('DELETE FROM classes WHERE id = ? AND school_id = ?').bind(id, locals.user!.school_id).run();
			return { success: true };
		} catch (e) {
			return fail(500, { error: 'Gagal menghapus kelas' });
		}
	}
};
