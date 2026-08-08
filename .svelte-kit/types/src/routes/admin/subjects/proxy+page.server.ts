// @ts-nocheck
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load = async ({ locals, platform }: Parameters<PageServerLoad>[0]) => {
	const db = getDB(platform);

	const { results: subjects } = await db.prepare(
		'SELECT * FROM subjects WHERE school_id = ? ORDER BY name ASC'
	).bind(locals.user!.school_id).all();

	return { subjects };
};

export const actions = {
	add: async ({ request, locals, platform }: import('./$types').RequestEvent) => {
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
		} catch (e: any) {
			console.error(e);
			return fail(500, { error: e.message || 'Gagal menambahkan mata pelajaran' });
		}
	},
	edit: async ({ request, locals, platform }: import('./$types').RequestEvent) => {
		const db = getDB(platform);
		const data = await request.formData();
		const idStr = data.get('id')?.toString();
		const name = data.get('name')?.toString().trim();
		const code = data.get('code')?.toString().trim() || null;
		const parsedId = parseInt(idStr || '', 10);

		if (isNaN(parsedId) || !name) return fail(400, { error: 'ID dan Nama wajib diisi' });

		try {
			// Ambil nama lama untuk cek apakah berubah
			const oldSubject = await db.prepare('SELECT name FROM subjects WHERE id = ? AND school_id = ?')
				.bind(parsedId, locals.user!.school_id)
				.first<{ name: string }>();

			await db.prepare('UPDATE subjects SET name = ?, code = ?, updated_at = datetime("now") WHERE id = ? AND school_id = ?')
				.bind(name, code, parsedId, locals.user!.school_id)
				.run();

			// Otomatis perbarui title semua ujian yang terhubung jika nama mapel berubah
			if (oldSubject && oldSubject.name !== name) {
				// Ambil semua ujian yang memakai mapel ini beserta kode tipe ujiannya
				const linkedExams = await db.prepare(`
					SELECT e.id, et.code as type_code
					FROM exams e
					LEFT JOIN exam_types et ON e.exam_type_id = et.id
					WHERE e.subject_id = ?
				`).bind(parsedId).all<{ id: number; type_code: string | null }>();

				if (linkedExams.results.length > 0) {
					const updateBatch = linkedExams.results.map(exam =>
						db.prepare(`UPDATE exams SET title = ?, updated_at = datetime('now') WHERE id = ?`)
							.bind(`${exam.type_code || 'Ujian'} - ${name}`, exam.id)
					);
					await db.batch(updateBatch);
				}
			}

			return { success: true };
		} catch (e: any) {
			console.error(e);
			return fail(500, { error: e.message || 'Gagal mengupdate mata pelajaran' });
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
				db.prepare('UPDATE exams SET subject_id = NULL WHERE subject_id = ? AND school_id = ?').bind(parsedId, locals.user!.school_id),
				db.prepare('DELETE FROM subjects WHERE id = ? AND school_id = ?').bind(parsedId, locals.user!.school_id)
			]);
			return { success: true };
		} catch (e: any) {
			console.error(e);
			return fail(500, { error: e.message || 'Gagal menghapus mata pelajaran' });
		}
	}
};
;null as any as Actions;