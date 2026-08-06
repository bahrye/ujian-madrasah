// @ts-nocheck
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load = async ({ locals, platform }: Parameters<PageServerLoad>[0]) => {
	const db = getDB(platform);

	const { results: classes } = await db.prepare(
		'SELECT c.*, COUNT(u.id) as student_count FROM classes c LEFT JOIN users u ON c.id = u.class_id WHERE c.school_id = ? GROUP BY c.id ORDER BY c.level ASC, c.name ASC'
	).bind(locals.user!.school_id).all();

	return { classes };
};

export const actions = {
	add: async ({ request, locals, platform }: import('./$types').RequestEvent) => {
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
		} catch (e: any) {
			console.error(e);
			return fail(500, { error: e.message || 'Gagal menambahkan kelas' });
		}
	},
	edit: async ({ request, locals, platform }: import('./$types').RequestEvent) => {
		const db = getDB(platform);
		const data = await request.formData();
		const idStr = data.get('id')?.toString();
		const name = data.get('name')?.toString().trim();
		const level = data.get('level')?.toString().trim() || null;
		const parsedId = parseInt(idStr || '', 10);

		if (isNaN(parsedId) || !name) return fail(400, { error: 'ID dan Nama kelas wajib diisi' });

		try {
			await db.prepare('UPDATE classes SET name = ?, level = ?, updated_at = datetime("now") WHERE id = ? AND school_id = ?')
				.bind(name, level, parsedId, locals.user!.school_id)
				.run();
			
			return { success: true };
		} catch (e: any) {
			console.error(e);
			return fail(500, { error: e.message || 'Gagal mengupdate kelas' });
		}
	},
	delete: async ({ request, locals, platform }: import('./$types').RequestEvent) => {
		const db = getDB(platform);
		const data = await request.formData();
		const idStr = data.get('id')?.toString();
		const parsedId = parseInt(idStr || '', 10);

		if (isNaN(parsedId)) return fail(400, { error: 'ID tidak valid' });

		try {
			await db.batch([
				db.prepare('UPDATE users SET class_id = NULL WHERE class_id = ? AND school_id = ?').bind(parsedId, locals.user!.school_id),
				db.prepare('DELETE FROM classes WHERE id = ? AND school_id = ?').bind(parsedId, locals.user!.school_id)
			]);
			return { success: true };
		} catch (e: any) {
			console.error(e);
			return fail(500, { error: e.message || 'Gagal menghapus kelas' });
		}
	}
};
;null as any as Actions;