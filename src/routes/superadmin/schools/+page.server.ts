import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load: PageServerLoad = async ({ platform }) => {
	const db = getDB(platform);
	const { results: schools } = await db.prepare('SELECT * FROM schools ORDER BY name ASC').all();

	return { schools };
};

export const actions: Actions = {
	add: async ({ request, platform }) => {
		const db = getDB(platform);
		const data = await request.formData();
		const name = data.get('name')?.toString().trim();
		const address = data.get('address')?.toString().trim() || null;

		if (!name) {
			return fail(400, { error: 'Nama sekolah wajib diisi', name, address });
		}

		try {
			await db.prepare('INSERT INTO schools (name, address) VALUES (?, ?)')
				.bind(name, address)
				.run();
			
			return { success: true };
		} catch (e) {
			return fail(500, { error: 'Gagal menambahkan sekolah', name, address });
		}
	},
	toggleStatus: async ({ request, platform }) => {
		const db = getDB(platform);
		const data = await request.formData();
		const id = data.get('id')?.toString();
		const currentStatus = data.get('is_active')?.toString();

		if (!id || !currentStatus) return fail(400, { error: 'Data tidak valid' });

		const newStatus = currentStatus === '1' ? 0 : 1;

		try {
			await db.prepare('UPDATE schools SET is_active = ?, updated_at = datetime("now") WHERE id = ?')
				.bind(newStatus, id)
				.run();
			
			return { success: true };
		} catch (e) {
			return fail(500, { error: 'Gagal merubah status sekolah' });
		}
	},
	edit: async ({ request, platform }) => {
		const db = getDB(platform);
		const data = await request.formData();
		const id = data.get('id')?.toString();
		const name = data.get('name')?.toString().trim();
		const address = data.get('address')?.toString().trim() || null;

		if (!id || !name) {
			return fail(400, { error: 'ID dan Nama sekolah wajib diisi', name, address });
		}

		try {
			await db.prepare('UPDATE schools SET name = ?, address = ?, updated_at = datetime("now") WHERE id = ?')
				.bind(name, address, id)
				.run();
			
			return { success: true };
		} catch (e) {
			return fail(500, { error: 'Gagal mengupdate sekolah', name, address });
		}
	},
	delete: async ({ request, platform }) => {
		const db = getDB(platform);
		const data = await request.formData();
		const id = data.get('id')?.toString();

		if (!id) return fail(400, { error: 'ID tidak valid' });

		try {
			await db.prepare('DELETE FROM schools WHERE id = ?').bind(id).run();
			return { success: true };
		} catch (e) {
			return fail(500, { error: 'Gagal menghapus sekolah' });
		}
	}
};
