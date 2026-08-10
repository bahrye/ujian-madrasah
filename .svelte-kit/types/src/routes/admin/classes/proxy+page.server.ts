// @ts-nocheck
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load = async ({ locals, platform }: Parameters<PageServerLoad>[0]) => {
	const db = getDB(platform);

	const { results: classes } = await db.prepare(
		`SELECT c.*, COUNT(u.id) as student_count FROM classes c LEFT JOIN users u ON c.id = u.class_id WHERE c.school_id = ? GROUP BY c.id 
		ORDER BY CASE c.level
			WHEN 'I' THEN 1 WHEN 'II' THEN 2 WHEN 'III' THEN 3 WHEN 'IV' THEN 4 WHEN 'V' THEN 5 WHEN 'VI' THEN 6 WHEN 'VII' THEN 7 WHEN 'VIII' THEN 8 WHEN 'IX' THEN 9 WHEN 'X' THEN 10 WHEN 'XI' THEN 11 WHEN 'XII' THEN 12
			WHEN '1' THEN 1 WHEN '2' THEN 2 WHEN '3' THEN 3 WHEN '4' THEN 4 WHEN '5' THEN 5 WHEN '6' THEN 6 WHEN '7' THEN 7 WHEN '8' THEN 8 WHEN '9' THEN 9 WHEN '10' THEN 10 WHEN '11' THEN 11 WHEN '12' THEN 12
			ELSE 99 END ASC, c.name ASC`
	).bind(locals.user!.school_id).all();

	return { classes };
};

export const actions = {
	add: async ({ request, locals, platform }: import('./$types').RequestEvent) => {
		const db = getDB(platform);
		const data = await request.formData();
		const name = data.get('name')?.toString().trim();
		const level = data.get('level')?.toString().trim() || null;

		if (!name || !level) {
			return fail(400, { error: 'Nama dan Tingkat kelas wajib diisi' });
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

		if (isNaN(parsedId) || !name || !level) return fail(400, { error: 'ID, Nama, dan Tingkat kelas wajib diisi' });

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