import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load: PageServerLoad = async ({ platform, locals }) => {
	const db = getDB(platform);
	const examTypes = await db.prepare(`
		SELECT et.*, 
			(SELECT COUNT(*) FROM exams WHERE exam_type_id = et.id) as exam_count
		FROM exam_types et
		WHERE et.school_id = ?
		ORDER BY et.created_at DESC
	`).bind(locals.user!.school_id).all();

	return { examTypes: examTypes.results };
};

export const actions: Actions = {
	create: async ({ request, platform, locals }) => {
		const db = getDB(platform);
		const form = await request.formData();

		const code = form.get('code')?.toString().trim();
		const name = form.get('name')?.toString().trim();
		const description = form.get('description')?.toString().trim() || '';
		const startTime = form.get('start_time')?.toString() || null;
		const endTime = form.get('end_time')?.toString() || null;
		const isActive = form.get('is_active')?.toString() === '1' ? 1 : 0;

		if (!code || !name) return fail(400, { error: 'Kode dan Nama Tipe Ujian wajib diisi.' });

		try {
			await db.prepare(`INSERT INTO exam_types (school_id, code, name, description, start_time, end_time, is_active)
				VALUES (?, ?, ?, ?, ?, ?, ?)`)
				.bind(locals.user!.school_id, code, name, description, startTime, endTime, isActive)
				.run();
			return { success: 'Tipe Ujian berhasil dibuat.' };
		} catch (e) {
			return fail(500, { error: 'Gagal membuat tipe ujian. Mungkin kode sudah digunakan.' });
		}
	},

	update: async ({ request, platform, locals }) => {
		const db = getDB(platform);
		const form = await request.formData();

		const id = form.get('id')?.toString();
		const code = form.get('code')?.toString().trim();
		const name = form.get('name')?.toString().trim();
		const description = form.get('description')?.toString().trim() || '';
		const startTime = form.get('start_time')?.toString() || null;
		const endTime = form.get('end_time')?.toString() || null;
		const isActive = form.get('is_active')?.toString() === '1' ? 1 : 0;

		if (!id || !code || !name) return fail(400, { error: 'Data tidak lengkap.' });

		try {
			await db.prepare(`UPDATE exam_types SET code=?, name=?, description=?, start_time=?, end_time=?, is_active=? WHERE id=? AND school_id=?`)
				.bind(code, name, description, startTime, endTime, isActive, id, locals.user!.school_id)
				.run();

			// Otomatis nonaktifkan ujian yang rentang waktunya keluar dari tipe ujian yang baru
			if (startTime && endTime) {
				await db.prepare(`
					UPDATE exams 
					SET is_active = 0 
					WHERE exam_type_id = ? 
					AND (
						(start_time IS NOT NULL AND start_time < ?) OR 
						(end_time IS NOT NULL AND end_time > ?)
					)
				`).bind(id, startTime, endTime).run();
			}
			return { success: 'Tipe Ujian berhasil diperbarui.' };
		} catch (e) {
			return fail(500, { error: 'Gagal memperbarui tipe ujian.' });
		}
	},

	delete: async ({ request, platform, locals }) => {
		const db = getDB(platform);
		const form = await request.formData();
		const id = form.get('id')?.toString();

		if (!id) return fail(400, { error: 'ID tidak valid.' });

		try {
			const exams = await db.prepare('SELECT COUNT(*) as count FROM exams WHERE exam_type_id = ?').bind(id).first() as { count: number };
			if (exams && exams.count > 0) {
				return fail(400, { error: 'Gagal dihapus: Masih ada ujian yang terikat pada tipe ini.' });
			}
			
			await db.prepare('DELETE FROM exam_types WHERE id = ? AND school_id = ?').bind(id, locals.user!.school_id).run();
			return { success: 'Tipe Ujian berhasil dihapus.' };
		} catch (e: any) {
			return fail(500, { error: 'Gagal menghapus tipe ujian.' });
		}
	},

	toggleActive: async ({ request, platform, locals }) => {
		const db = getDB(platform);
		const form = await request.formData();
		const id = form.get('id')?.toString();

		if (!id) return fail(400, { error: 'ID tidak valid.' });

		await db.prepare(`UPDATE exam_types SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END WHERE id = ? AND school_id = ?`)
			.bind(id, locals.user!.school_id).run();

		return { success: 'Status tipe ujian berhasil diperbarui.' };
	}
};
