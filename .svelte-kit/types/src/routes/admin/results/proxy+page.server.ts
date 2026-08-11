// @ts-nocheck
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getDB } from '$lib/server/db';
import { deleteFromCloudinary } from '$lib/server/cloudinary';
import { env } from '$env/dynamic/private';

export const load = async ({ platform, url, locals }: Parameters<PageServerLoad>[0]) => {
	if (!locals.user) throw redirect(302, '/login');
	const db = getDB(platform);
	const examFilterStr = url.searchParams.get('exam_id') || '';
	const examFilter = parseInt(examFilterStr, 10);

	const exams = await db.prepare('SELECT id, title FROM exams WHERE school_id = ? ORDER BY title').bind(locals.user.school_id).all();

	let query = `
		SELECT sa.*, u.name as student_name, e.title as exam_title, s.name as subject
		FROM student_attempts sa
		JOIN users u ON sa.student_id = u.id
		JOIN exams e ON sa.exam_id = e.id
		LEFT JOIN subjects s ON e.subject_id = s.id
		WHERE sa.status IN ('selesai', 'waktu_habis') AND e.school_id = ?
	`;
	const params: any[] = [locals.user.school_id];

	if (!isNaN(examFilter)) {
		query += ' AND e.id = ?';
		params.push(examFilter);
	}

	query += ' ORDER BY sa.submit_time DESC';

	const results = await db.prepare(query).bind(...params).all();

	return { results: results.results, exams: exams.results, examFilter };
};

export const actions = {
	delete: async ({ request, platform, locals }: import('./$types').RequestEvent) => {
		if (!locals.user) return fail(401, { error: 'Unauthorized' });
		const db = getDB(platform);
		const form = await request.formData();
		const attemptIdStr = form.get('attempt_id')?.toString();
		const parsedId = parseInt(attemptIdStr || '', 10);

		if (isNaN(parsedId)) {
			return fail(400, { error: 'ID tidak valid' });
		}

		try {
			// Verifikasi attempt milik sekolah ini
			const attemptCheck = await db.prepare(`
				SELECT sa.id, sa.signature FROM student_attempts sa
				JOIN exams e ON sa.exam_id = e.id
				WHERE sa.id = ? AND e.school_id = ?
			`).bind(parsedId, locals.user.school_id).first<{id: number, signature: string | null}>();

			if (!attemptCheck) {
				return fail(403, { error: 'Data hasil ujian tidak ditemukan atau bukan milik sekolah Anda.' });
			}

			// Delete signature from Cloudinary if exists
			if (attemptCheck.signature && attemptCheck.signature.includes('res.cloudinary.com')) {
				await deleteFromCloudinary(attemptCheck.signature, env);
			}

			// Hapus data answers dan attempt dalam batch
			await db.batch([
				db.prepare('DELETE FROM student_answers WHERE attempt_id = ?').bind(parsedId),
				db.prepare('DELETE FROM student_attempts WHERE id = ?').bind(parsedId)
			]);

			return { success: true };
		} catch (e: any) {
			console.error('Error deleting attempt:', e);
			return fail(500, { error: e.message || 'Terjadi kesalahan saat menghapus data ujian.' });
		}
	}
};
;null as any as Actions;