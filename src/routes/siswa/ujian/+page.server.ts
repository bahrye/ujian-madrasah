import { parseDate } from '$lib/utils/date';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { signExamToken } from '$lib/server/auth';
import { uploadToCloudinary } from '$lib/server/cloudinary';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async ({ platform, locals, url }) => {
	const db = getDB(platform);



	const examIdStr = url.searchParams.get('exam_id');
	const parsedExamId = parseInt(examIdStr || '', 10);
	if (isNaN(parsedExamId)) throw redirect(302, '/siswa/jadwal');

	try {
		const exam = await db.prepare(`
		SELECT e.id, e.title, e.duration_minutes, e.start_time, e.end_time, s.name as subject,
			COALESCE(
				(
					SELECT GROUP_CONCAT(u.name, ', ')
					FROM exam_proctors epr
					JOIN users u ON epr.proctor_id = u.id
					WHERE epr.exam_id = e.id
				),
				(
					SELECT u.name FROM users u WHERE u.id = e.created_by AND u.role = 'guru'
				)
			) as proctors,
			(SELECT COUNT(*) FROM questions WHERE exam_id = e.id) as question_count
		FROM exams e 
		LEFT JOIN subjects s ON e.subject_id = s.id 
		JOIN exam_types et ON e.exam_type_id = et.id
		WHERE e.id = ? AND e.school_id = ? AND et.is_active = 1
	`).bind(parsedExamId, locals.user!.school_id).first();

		if (!exam) throw redirect(302, '/siswa/jadwal');

		return { exam };
	} catch (e: any) {
		console.error("Load Error in siswa ujian:", e);
		throw redirect(302, '/siswa/jadwal');
	}
};

export const actions: Actions = {
	validateToken: async ({ request, platform, locals, cookies }) => {
		const db = getDB(platform);
		const form = await request.formData();
		const tokenCode = form.get('token')?.toString().trim().toUpperCase();
		const examIdStr = form.get('exam_id')?.toString();
		const parsedExamId = parseInt(examIdStr || '', 10);

		if (!tokenCode || isNaN(parsedExamId)) return fail(400, { error: 'Data tidak lengkap.' });

		try {
			const token = await db.prepare(`
				SELECT t.*, e.id as exam_id, e.title, e.duration_minutes, e.is_active
				FROM tokens t 
				JOIN exams e ON t.exam_id = e.id
				JOIN exam_types et ON e.exam_type_id = et.id
				WHERE t.token_code = ? AND t.exam_id = ? AND et.is_active = 1
			`).bind(tokenCode, parsedExamId).first<any>();

			if (!token) {
				return fail(400, { error: 'Token tidak valid untuk ujian ini.' });
			}

			// Validasi keaktifan dan status rilis token terlebih dahulu
			if (!token.is_active) {
				return fail(400, { error: 'Ujian saat ini tidak aktif.' });
			}
			if (!token.is_released) {
				return fail(400, { error: 'Token ujian ini sudah ditarik atau belum dirilis oleh pengawas.' });
			}
			if (token.released_at) {
				const releasedAt = parseDate(token.released_at).getTime();
				const now = new Date().getTime();
				if (now - releasedAt > 15 * 60 * 1000) {
					return fail(400, { error: 'Token sudah kedaluwarsa / ditarik otomatis (melewati batas waktu 15 menit).' });
				}
			} else {
				return fail(400, { error: 'Status rilis token tidak valid.' });
			}
			if (parseDate(token.expires_at) < new Date()) {
				return fail(400, { error: 'Token sudah kedaluwarsa.' });
			}

			// Setelah token terbukti sah & masih dirilis, cek apakah siswa melanjutkan attempt yang ada
			const existingAttempt = await db.prepare(`SELECT id, status FROM student_attempts WHERE student_id = ? AND exam_id = ?`)
				.bind(locals.user!.id, token.exam_id).first<{ id: number; status: string }>();

			if (existingAttempt) {
				if (existingAttempt.status === 'mengerjakan') {
					const signedCookie = await signExamToken(existingAttempt.id, locals.user!.id);
					cookies.set('exam_token_verified_' + existingAttempt.id, signedCookie, { path: '/', httpOnly: true, sameSite: 'lax' });
					throw redirect(302, `/siswa/ujian/${existingAttempt.id}`);
				}
				return fail(400, { error: 'Anda sudah pernah mengerjakan ujian ini.' });
			}

			return { success: true, tokenCode, examId: parsedExamId };
		} catch (e: any) {
			if (e.status === 302) throw e;
			console.error(e);
			return fail(500, { error: e.message || 'Gagal memvalidasi token.' });
		}
	},

	startExam: async ({ request, platform, locals, cookies }) => {
		const db = getDB(platform);
		const form = await request.formData();
		const tokenCode = form.get('token')?.toString().trim().toUpperCase();
		const examIdStr = form.get('exam_id')?.toString();
		const parsedExamId = parseInt(examIdStr || '', 10);

		if (!tokenCode || isNaN(parsedExamId)) return fail(400, { error: 'Data tidak lengkap.' });

		try {
			const token = await db.prepare(`
				SELECT t.*, e.id as exam_id, e.title, e.duration_minutes, e.is_active
				FROM tokens t 
				JOIN exams e ON t.exam_id = e.id
				JOIN exam_types et ON e.exam_type_id = et.id
				WHERE t.token_code = ? AND t.exam_id = ? AND et.is_active = 1
			`).bind(tokenCode, parsedExamId).first<any>();

			if (!token) {
				return fail(400, { error: 'Token tidak valid untuk ujian ini.' });
			}

			// Validasi keaktifan dan status rilis token terlebih dahulu
			if (!token.is_active) {
				return fail(400, { error: 'Ujian saat ini tidak aktif.' });
			}
			if (!token.is_released) {
				return fail(400, { error: 'Token ujian ini sudah ditarik atau belum dirilis oleh pengawas.' });
			}
			if (token.released_at) {
				const releasedAt = parseDate(token.released_at).getTime();
				const now = new Date().getTime();
				if (now - releasedAt > 15 * 60 * 1000) {
					return fail(400, { error: 'Token sudah kedaluwarsa / ditarik otomatis (melewati batas waktu 15 menit).' });
				}
			} else {
				return fail(400, { error: 'Status rilis token tidak valid.' });
			}
			if (parseDate(token.expires_at) < new Date()) {
				return fail(400, { error: 'Token sudah kedaluwarsa.' });
			}

			const existingAttempt = await db.prepare(`SELECT id, status FROM student_attempts WHERE student_id = ? AND exam_id = ?`)
				.bind(locals.user!.id, token.exam_id).first<{ id: number; status: string }>();

			if (existingAttempt) {
				if (existingAttempt.status === 'mengerjakan') {
					const signedCookie = await signExamToken(existingAttempt.id, locals.user!.id);
					cookies.set('exam_token_verified_' + existingAttempt.id, signedCookie, { path: '/', httpOnly: true, sameSite: 'lax' });
					throw redirect(302, `/siswa/ujian/${existingAttempt.id}`);
				}
				return fail(400, { error: 'Anda sudah pernah mengerjakan ujian ini.' });
			}

			const endTime = new Date(Date.now() + token.duration_minutes * 60 * 1000).toISOString();

			let signatureStr = form.get('signature')?.toString() || '';
			
			// Insert the base64 signature immediately to allow the student to start the exam instantly.
			const result = await db.prepare(`INSERT INTO student_attempts (student_id, exam_id, token_id, end_time, status, signature) VALUES (?, ?, ?, ?, 'mengerjakan', ?)`)
				.bind(locals.user!.id, token.exam_id, token.id, endTime, signatureStr).run();

			const attemptId = result.meta.last_row_id;

			// Background task to upload signature to Cloudinary
			if (signatureStr.startsWith('data:image/')) {
				const mergedEnv = platform?.env || env;
				
				const backgroundUpload = async () => {
					try {
						const uploadResult = await uploadToCloudinary(signatureStr, mergedEnv);
						if (uploadResult.success && uploadResult.url) {
							// Update DB with the secure Cloudinary URL, replacing the heavy base64 string
							await db.prepare(`UPDATE student_attempts SET signature = ? WHERE id = ?`)
								.bind(uploadResult.url, attemptId).run();
							console.log('Background upload success for attempt', attemptId);
						} else {
							console.error('Background upload failed for attempt', attemptId, 'Error:', uploadResult.error);
						}
					} catch (err) {
						console.error('Background upload exception:', err);
					}
				};

				// Use Cloudflare's waitUntil to run after response, or fire-and-forget in Node dev
				if (platform?.context?.waitUntil) {
					platform.context.waitUntil(backgroundUpload());
				} else {
					backgroundUpload();
				}
			}

			const signedCookie = await signExamToken(attemptId, locals.user!.id);
			cookies.set('exam_token_verified_' + attemptId, signedCookie, { path: '/', httpOnly: true, sameSite: 'lax' });
			throw redirect(302, `/siswa/ujian/${attemptId}`);
		} catch (e: any) {
			if (e.status === 302) throw e;
			console.error(e);
			return fail(500, { error: e.message || 'Gagal memulai ujian.' });
		}
	}
};
