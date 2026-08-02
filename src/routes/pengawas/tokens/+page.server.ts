import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { generateTokenCode } from '$lib/server/auth';

export const load: PageServerLoad = async ({ platform, locals }) => {
	const db = getDB(platform);

	const tokens = await db.prepare(`
		SELECT t.*, e.title as exam_title
		FROM tokens t JOIN exams e ON t.exam_id = e.id
		WHERE t.school_id = ?
		ORDER BY t.created_at DESC
	`).bind(locals.user!.school_id).all();

	const exams = await db.prepare('SELECT id, title FROM exams WHERE is_active = 1 AND school_id = ? ORDER BY title').bind(locals.user!.school_id).all();

	return { tokens: tokens.results, exams: exams.results };
};

export const actions: Actions = {
	generate: async ({ request, platform, locals }) => {
		const db = getDB(platform);
		const form = await request.formData();

		const examId = form.get('exam_id')?.toString();
		const durationHours = parseInt(form.get('duration_hours')?.toString() || '2');

		if (!examId) return fail(400, { error: 'Pilih ujian terlebih dahulu.' });

		const tokenCode = generateTokenCode(6);
		const expiresAt = new Date(Date.now() + durationHours * 60 * 60 * 1000).toISOString();

		await db.prepare('INSERT INTO tokens (school_id, exam_id, token_code, created_by, expires_at) VALUES (?, ?, ?, ?, ?)')
			.bind(locals.user!.school_id, examId, tokenCode, locals.user?.id, expiresAt).run();

		return { success: `Token berhasil dibuat: ${tokenCode}` };
	},

	release: async ({ request, platform, locals }) => {
		const db = getDB(platform);
		const form = await request.formData();
		const id = form.get('id')?.toString();
		if (!id) return fail(400, { error: 'ID tidak valid.' });

		await db.prepare('UPDATE tokens SET is_released = 1 WHERE id = ? AND school_id = ?').bind(id, locals.user!.school_id).run();
		return { success: 'Token berhasil dirilis ke siswa.' };
	},

	revoke: async ({ request, platform, locals }) => {
		const db = getDB(platform);
		const form = await request.formData();
		const id = form.get('id')?.toString();
		if (!id) return fail(400, { error: 'ID tidak valid.' });

		await db.prepare('UPDATE tokens SET is_released = 0 WHERE id = ? AND school_id = ?').bind(id, locals.user!.school_id).run();
		return { success: 'Token berhasil ditarik.' };
	},

	delete: async ({ request, platform, locals }) => {
		const db = getDB(platform);
		const form = await request.formData();
		const id = form.get('id')?.toString();
		if (!id) return fail(400, { error: 'ID tidak valid.' });

		await db.prepare('DELETE FROM tokens WHERE id = ? AND school_id = ?').bind(id, locals.user!.school_id).run();
		return { success: 'Token berhasil dihapus.' };
	}
};
