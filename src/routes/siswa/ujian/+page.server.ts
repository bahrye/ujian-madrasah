import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load: PageServerLoad = async ({ platform, locals }) => {
	const db = getDB(platform);

	// Cek apakah ada ujian yang sedang dikerjakan
	const activeAttempt = await db.prepare(`
		SELECT sa.id FROM student_attempts sa
		WHERE sa.student_id = ? AND sa.status = 'mengerjakan' LIMIT 1
	`).bind(locals.user!.id).first<{ id: number }>();

	if (activeAttempt) {
		throw redirect(302, `/siswa/ujian/${activeAttempt.id}`);
	}

	return {};
};

export const actions: Actions = {
	default: async ({ request, platform, locals }) => {
		const db = getDB(platform);
		const form = await request.formData();
		const tokenCode = form.get('token')?.toString().trim().toUpperCase();

		if (!tokenCode) {
			return fail(400, { error: 'Token ujian wajib diisi.' });
		}

		// Validasi token
		const token = await db.prepare(`
			SELECT t.*, e.id as exam_id, e.title, e.duration_minutes, e.is_active
			FROM tokens t JOIN exams e ON t.exam_id = e.id
			WHERE t.token_code = ? AND t.is_released = 1
		`).bind(tokenCode).first<any>();

		if (!token) {
			return fail(400, { error: 'Token tidak valid atau belum dirilis oleh pengawas.' });
		}

		if (!token.is_active) {
			return fail(400, { error: 'Ujian tidak aktif.' });
		}

		if (new Date(token.expires_at) < new Date()) {
			return fail(400, { error: 'Token sudah kedaluwarsa.' });
		}

		// Cek apakah sudah pernah mengerjakan
		const existingAttempt = await db.prepare(`
			SELECT id, status FROM student_attempts
			WHERE student_id = ? AND exam_id = ?
		`).bind(locals.user!.id, token.exam_id).first<{ id: number; status: string }>();

		if (existingAttempt) {
			if (existingAttempt.status === 'mengerjakan') {
				throw redirect(302, `/siswa/ujian/${existingAttempt.id}`);
			}
			return fail(400, { error: 'Anda sudah pernah mengerjakan ujian ini.' });
		}

		// Hitung waktu selesai
		const endTime = new Date(Date.now() + token.duration_minutes * 60 * 1000).toISOString();

		// Buat attempt baru
		const result = await db.prepare(`
			INSERT INTO student_attempts (student_id, exam_id, token_id, end_time, status)
			VALUES (?, ?, ?, ?, 'mengerjakan')
		`).bind(locals.user!.id, token.exam_id, token.id, endTime).run();

		const attemptId = result.meta.last_row_id;

		// Buat record jawaban kosong untuk semua soal
		const questions = await db.prepare('SELECT id FROM questions WHERE exam_id = ? ORDER BY question_number')
			.bind(token.exam_id).all<{ id: number }>();

		if (questions.results.length > 0) {
			const stmts = questions.results.map(q =>
				db.prepare('INSERT INTO student_answers (attempt_id, question_id) VALUES (?, ?)').bind(attemptId, q.id)
			);
			await db.batch(stmts);
		}

		throw redirect(302, `/siswa/ujian/${attemptId}`);
	}
};
