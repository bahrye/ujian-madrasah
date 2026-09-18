import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDB } from '$lib/server/db';
import { verifyExamTokenSignature } from '$lib/server/auth';
import { parseDate } from '$lib/utils/date';

export const POST: RequestHandler = async ({ request, platform, locals, cookies }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const db = getDB(platform);

	let attemptId: number | null = null;
	let questionId: number | null = null;
	let answerGiven: string | null = null;
	let isDoubted = 0;

	const contentType = request.headers.get('content-type') || '';
	try {
		if (contentType.includes('application/json')) {
			const body = (await request.json()) as any;
			attemptId = parseInt(body.attempt_id, 10);
			questionId = parseInt(body.question_id, 10);
			if (body.answer_given !== undefined && body.answer_given !== null) {
				answerGiven = String(body.answer_given);
			}
			isDoubted = body.is_doubted ? 1 : 0;
		} else {
			const formData = await request.formData();
			attemptId = parseInt(formData.get('attempt_id')?.toString() || '', 10);
			questionId = parseInt(formData.get('question_id')?.toString() || '', 10);
			const ans = formData.get('answer_given');
			if (ans !== null && ans !== undefined) {
				answerGiven = ans.toString();
			}
			const doubted = formData.get('is_doubted');
			isDoubted = (doubted === 'true' || doubted === '1') ? 1 : 0;
		}
	} catch (e: any) {
		return json({ error: 'Format data tidak valid' }, { status: 400 });
	}

	if (!attemptId || isNaN(attemptId) || !questionId || isNaN(questionId)) {
		return json({ error: 'ID attempt atau soal tidak valid' }, { status: 400 });
	}

	// Verifikasi token session cookie
	const cookieVal = cookies.get('exam_token_verified_' + attemptId);
	const isVerified = await verifyExamTokenSignature(cookieVal, attemptId, locals.user.id);
	if (!isVerified) {
		return json({ error: 'Sesi token tidak valid' }, { status: 401 });
	}

	try {
		// Validasi status attempt
		const attempt = await db.prepare(`
			SELECT id, is_paused, status, end_time 
			FROM student_attempts 
			WHERE id = ? AND student_id = ?
		`).bind(attemptId, locals.user.id).first<any>();

		if (!attempt || attempt.status !== 'mengerjakan') {
			return json({ error: 'Sesi ujian tidak aktif' }, { status: 400 });
		}

		if (attempt.end_time) {
			const endTimeMs = parseDate(attempt.end_time).getTime();
			// 60-second grace period for network latency
			if (!isNaN(endTimeMs) && Date.now() > endTimeMs + 60000) {
				return json({ 
					error: 'Waktu ujian telah berakhir',
					is_time_up: true,
					status: 'waktu_habis',
					end_time: attempt.end_time
				}, { status: 403 });
			}
		}

		if (attempt.is_paused === 1) {
			return json({ 
				error: 'Ujian sedang dijeda oleh pengawas',
				is_paused: true,
				status: attempt.status,
				end_time: attempt.end_time
			}, { status: 403 });
		}

		// Simpan jawaban tunggal dan perbarui updated_at attempt
		const batchStmts = [
			db.prepare(`
				INSERT INTO student_answers (attempt_id, question_id, answer_given, is_doubted, answered_at)
				VALUES (?, ?, ?, ?, datetime('now'))
				ON CONFLICT(attempt_id, question_id) DO UPDATE SET
					answer_given = excluded.answer_given,
					is_doubted = excluded.is_doubted,
					answered_at = datetime('now')
			`).bind(attemptId, questionId, answerGiven, isDoubted),

			db.prepare(`
				UPDATE student_attempts 
				SET updated_at = datetime('now') 
				WHERE id = ? AND student_id = ?
			`).bind(attemptId, locals.user.id)
		];

		await db.batch(batchStmts);

		return json({ 
			success: true, 
			saved_at: Date.now(),
			is_paused: attempt.is_paused === 1,
			status: attempt.status,
			end_time: attempt.end_time
		});
	} catch (e: any) {
		console.error('Error saving single answer:', e);
		return json({ error: 'Gagal menyimpan jawaban: ' + (e?.message || '') }, { status: 500 });
	}
};
