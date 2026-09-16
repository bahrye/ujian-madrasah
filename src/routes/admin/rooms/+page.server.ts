import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { ensureRoomsTable, type RoomItem } from '$lib/server/rooms';
import { recordActivityLog, getClientIp } from '$lib/server/activity-log';

export const load: PageServerLoad = async ({ platform, locals }) => {
	if (!locals.user) throw redirect(302, '/login');
	if (!['admin', 'superadmin', 'panitia'].includes(locals.user.role)) {
		throw redirect(302, '/');
	}

	const db = getDB(platform);
	await ensureRoomsTable(db);

	const rawSchoolId = locals.user.school_id;
	const userSchoolId = (rawSchoolId !== undefined && rawSchoolId !== null && !isNaN(Number(rawSchoolId))) 
		? Number(rawSchoolId) 
		: null;

	try {
		let query = `SELECT * FROM rooms WHERE 1=1`;
		const params: any[] = [];

		if (userSchoolId !== null) {
			query += ` AND school_id = ?`;
			params.push(userSchoolId);
		}

		query += ` ORDER BY name ASC`;

		const result = await db.prepare(query).bind(...params).all<RoomItem>();
		const rooms = result.results || [];

		return {
			rooms
		};
	} catch (e: any) {
		console.error('Error loading rooms:', e);
		return {
			rooms: [],
			error: e.message || String(e)
		};
	}
};

export const actions: Actions = {
	add: async ({ request, platform, locals, getClientAddress }) => {
		if (!locals.user) return fail(401, { error: 'Unauthorized' });
		const db = getDB(platform);
		await ensureRoomsTable(db);

		const formData = await request.formData();
		const name = formData.get('name')?.toString().trim();
		const location = formData.get('location')?.toString().trim() || null;
		const capacityStr = formData.get('capacity')?.toString().trim();
		const capacity = capacityStr ? parseInt(capacityStr, 10) : 30;

		if (!name) {
			return fail(400, { error: 'Nama ruang ujian wajib diisi.' });
		}

		const rawSchoolId = locals.user.school_id;
		const userSchoolId = (rawSchoolId !== undefined && rawSchoolId !== null && !isNaN(Number(rawSchoolId))) 
			? Number(rawSchoolId) 
			: null;

		if (userSchoolId === null) {
			return fail(400, { error: 'ID sekolah tidak valid.' });
		}

		try {
			// Periksa duplikasi nama ruang di sekolah yang sama
			const existing = await db.prepare(`
				SELECT id FROM rooms WHERE school_id = ? AND LOWER(name) = LOWER(?)
			`).bind(userSchoolId, name).first();

			if (existing) {
				return fail(400, { error: `Ruang ujian dengan nama "${name}" sudah ada.` });
			}

			await db.prepare(`
				INSERT INTO rooms (school_id, name, location, capacity, is_active, created_at, updated_at)
				VALUES (?, ?, ?, ?, 1, datetime('now'), datetime('now'))
			`).bind(userSchoolId, name, location, capacity).run();

			const ip = getClientIp(request, getClientAddress);
			await recordActivityLog(db, {
				schoolId: userSchoolId,
				userId: locals.user.id,
				userName: locals.user.name,
				userRole: locals.user.role,
				action: 'tambah ruang',
				detail: `Menambahkan ruang ujian: ${name}${location ? ` (${location})` : ''}`,
				ipAddress: ip
			});

			return { success: `Ruang ujian "${name}" berhasil ditambahkan.` };
		} catch (e: any) {
			console.error('Error adding room:', e);
			return fail(500, { error: e.message || 'Gagal menambahkan ruang ujian.' });
		}
	},

	edit: async ({ request, platform, locals, getClientAddress }) => {
		if (!locals.user) return fail(401, { error: 'Unauthorized' });
		const db = getDB(platform);
		await ensureRoomsTable(db);

		const formData = await request.formData();
		const idStr = formData.get('id')?.toString();
		const id = parseInt(idStr || '', 10);
		const name = formData.get('name')?.toString().trim();
		const location = formData.get('location')?.toString().trim() || null;
		const capacityStr = formData.get('capacity')?.toString().trim();
		const capacity = capacityStr ? parseInt(capacityStr, 10) : 30;

		if (isNaN(id) || !name) {
			return fail(400, { error: 'ID dan Nama ruang ujian wajib diisi.' });
		}

		const rawSchoolId = locals.user.school_id;
		const userSchoolId = (rawSchoolId !== undefined && rawSchoolId !== null && !isNaN(Number(rawSchoolId))) 
			? Number(rawSchoolId) 
			: null;

		if (userSchoolId === null) {
			return fail(400, { error: 'ID sekolah tidak valid.' });
		}

		try {
			// Periksa duplikasi nama pada ruang lain
			const duplicate = await db.prepare(`
				SELECT id FROM rooms WHERE school_id = ? AND LOWER(name) = LOWER(?) AND id != ?
			`).bind(userSchoolId, name, id).first();

			if (duplicate) {
				return fail(400, { error: `Ruang ujian dengan nama "${name}" sudah digunakan.` });
			}

			await db.prepare(`
				UPDATE rooms 
				SET name = ?, location = ?, capacity = ?, updated_at = datetime('now')
				WHERE id = ? AND school_id = ?
			`).bind(name, location, capacity, id, userSchoolId).run();

			const ip = getClientIp(request, getClientAddress);
			await recordActivityLog(db, {
				schoolId: userSchoolId,
				userId: locals.user.id,
				userName: locals.user.name,
				userRole: locals.user.role,
				action: 'edit ruang',
				detail: `Memperbarui ruang ujian: ${name}${location ? ` (${location})` : ''}`,
				ipAddress: ip
			});

			return { success: `Ruang ujian "${name}" berhasil diperbarui.` };
		} catch (e: any) {
			console.error('Error editing room:', e);
			return fail(500, { error: e.message || 'Gagal memperbarui ruang ujian.' });
		}
	},

	delete: async ({ request, platform, locals, getClientAddress }) => {
		if (!locals.user) return fail(401, { error: 'Unauthorized' });
		const db = getDB(platform);
		const formData = await request.formData();
		const idStr = formData.get('id')?.toString();
		const id = parseInt(idStr || '', 10);

		if (isNaN(id)) {
			return fail(400, { error: 'ID ruang ujian tidak valid.' });
		}

		const rawSchoolId = locals.user.school_id;
		const userSchoolId = (rawSchoolId !== undefined && rawSchoolId !== null && !isNaN(Number(rawSchoolId))) 
			? Number(rawSchoolId) 
			: null;

		if (userSchoolId === null) {
			return fail(400, { error: 'ID sekolah tidak valid.' });
		}

		try {
			const room = await db.prepare('SELECT name FROM rooms WHERE id = ? AND school_id = ?')
				.bind(id, userSchoolId)
				.first<{ name: string }>();

			if (!room) {
				return fail(404, { error: 'Data ruang ujian tidak ditemukan.' });
			}

			await db.prepare('DELETE FROM rooms WHERE id = ? AND school_id = ?')
				.bind(id, userSchoolId)
				.run();

			const ip = getClientIp(request, getClientAddress);
			await recordActivityLog(db, {
				schoolId: userSchoolId,
				userId: locals.user.id,
				userName: locals.user.name,
				userRole: locals.user.role,
				action: 'hapus ruang',
				detail: `Menghapus ruang ujian master: ${room.name}`,
				ipAddress: ip
			});

			return { success: `Ruang ujian "${room.name}" berhasil dihapus.` };
		} catch (e: any) {
			console.error('Error deleting room:', e);
			return fail(500, { error: e.message || 'Gagal menghapus ruang ujian.' });
		}
	}
};
