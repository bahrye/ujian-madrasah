// @ts-nocheck
import { parseDate, isStudentExamTimeActive } from '$lib/utils/date';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { signExamToken } from '$lib/server/auth';
import { uploadToCloudinary } from '$lib/server/cloudinary';
import { env } from '$env/dynamic/private';

export const load = async ({ platform, locals, url }: Parameters<PageServerLoad>[0]) => {
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

export const actions = {
	validateToken: async ({ request, platform, locals, cookies }: import('./$types').RequestEvent) => {
		const db = getDB(platform);
		const form = await request.formData();
		const tokenCode = form.get('token')?.toString().trim().toUpperCase();
		const examIdStr = form.get('exam_id')?.toString();
		const parsedExamId = parseInt(examIdStr || '', 10);
		const tzOffsetStr = form.get('tz_offset')?.toString();
		const clientTzOffset = tzOffsetStr ? parseInt(tzOffsetStr, 10) : null;

		if (!tokenCode || isNaN(parsedExamId)) return fail(400, { error: 'Data tidak lengkap.' });

		try {
			const token = await db.prepare(`
				SELECT t.*, e.id as exam_id, e.title, e.duration_minutes, e.is_active,
				e.start_time as exam_start_time, e.end_time as exam_end_time, e.max_attempts,
				u.session_number as student_session_number, t.session_number as token_session_number
				FROM tokens t 
				JOIN exams e ON t.exam_id = e.id
				JOIN exam_types et ON e.exam_type_id = et.id
				JOIN users u ON u.id = ?
				WHERE t.token_code = ? AND t.exam_id = ? AND et.is_active = 1
			`).bind(locals.user!.id, tokenCode, parsedExamId).first<any>();

			if (!token) {
				return fail(400, { error: 'Token tidak valid untuk ujian ini.' });
			}

			// Validasi kesesuaian sesi token dengan sesi siswa
			const studentSession = token.student_session_number || 1;
			const tokenSession = token.token_session_number;
			if (tokenSession && tokenSession !== studentSession) {
				return fail(400, { error: `Token ini khusus untuk Sesi ${tokenSession}. Sesi Anda adalah Sesi ${studentSession}.` });
			}

			// Validasi keaktifan ujian
			if (!token.is_active) {
				return fail(400, { error: 'Ujian saat ini tidak aktif.' });
			}
			
			// Validasi sesi dan waktu ujian
			let sessionRecord = null;
			try {
				sessionRecord = await db.prepare('SELECT start_time, end_time FROM exam_sessions WHERE exam_id = ? AND session_number = ?')
					.bind(parsedExamId, studentSession).first<{ start_time: string | null, end_time: string | null }>();
			} catch (e: any) {
				console.warn('Failed to fetch exam_sessions:', e.message);
			}
			
			const startTimeStr = sessionRecord?.start_time || token.exam_start_time;
			const endTimeStr = sessionRecord?.end_time || token.exam_end_time;
			
			const timeCheck = isStudentExamTimeActive(startTimeStr, endTimeStr, new Date(), clientTzOffset);
			if (!timeCheck.allowed) {
				if (timeCheck.reason === 'too_early') {
					return fail(400, { error: 'Waktu ujian belum dimulai untuk sesi Anda.' });
				} else if (timeCheck.reason === 'too_late') {
					return fail(400, { error: 'Waktu ujian telah berakhir untuk sesi Anda.' });
				}
			}

			if (!token.is_released) {
				return fail(400, { error: 'Token ujian ini belum dirilis oleh pengawas.' });
			}
			if (token.released_at) {
				const releasedAt = parseDate(token.released_at).getTime();
				const nowMs = Date.now();
				if (nowMs - releasedAt > 15 * 60 * 1000) {
					return fail(400, { error: 'Token sudah kedaluwarsa (melewati batas waktu 15 menit).' });
				}
			}
			if (parseDate(token.expires_at) < new Date()) {
				return fail(400, { error: 'Token sudah kedaluwarsa.' });
			}

			// Setelah token terbukti sah & masih dirilis, cek apakah siswa melanjutkan attempt yang ada
			const allAttempts = await db.prepare(`SELECT id, status FROM student_attempts WHERE student_id = ? AND exam_id = ?`)
				.bind(locals.user!.id, token.exam_id).all<{ id: number; status: string }>();

			if (allAttempts.results && allAttempts.results.length > 0) {
				const mengerjakanAttempt = allAttempts.results.find((a) => a.status === 'mengerjakan');
				if (mengerjakanAttempt) {
					const signedCookie = await signExamToken(mengerjakanAttempt.id, locals.user!.id);
					cookies.set('exam_token_verified_' + mengerjakanAttempt.id, signedCookie, { path: '/', httpOnly: true, sameSite: 'lax' });
					throw redirect(302, `/siswa/ujian/${mengerjakanAttempt.id}`);
				}
				
				if (allAttempts.results.length >= (token.max_attempts || 1)) {
					return fail(400, { error: 'Anda sudah mencapai batas maksimal pengerjaan ujian ini.' });
				}
			}

			return { success: true, tokenCode, examId: parsedExamId };
		} catch (e: any) {
			if (e.status === 302) throw e;
			console.error(e);
			return fail(500, { error: e.message || 'Gagal memvalidasi token.' });
		}
	},

	startExam: async ({ request, platform, locals, cookies }: import('./$types').RequestEvent) => {
		const db = getDB(platform);
		const form = await request.formData();
		const tokenCode = form.get('token')?.toString().trim().toUpperCase();
		const examIdStr = form.get('exam_id')?.toString();
		const parsedExamId = parseInt(examIdStr || '', 10);
		const tzOffsetStr = form.get('tz_offset')?.toString();
		const clientTzOffset = tzOffsetStr ? parseInt(tzOffsetStr, 10) : null;

		if (!tokenCode || isNaN(parsedExamId)) return fail(400, { error: 'Data tidak lengkap.' });

		try {
			const token = await db.prepare(`
				SELECT t.*, e.id as exam_id, e.title, e.duration_minutes, e.is_active,
				e.start_time as exam_start_time, e.end_time as exam_end_time, e.max_attempts,
				u.session_number as student_session_number, t.session_number as token_session_number
				FROM tokens t 
				JOIN exams e ON t.exam_id = e.id
				JOIN exam_types et ON e.exam_type_id = et.id
				JOIN users u ON u.id = ?
				WHERE t.token_code = ? AND t.exam_id = ? AND et.is_active = 1
			`).bind(locals.user!.id, tokenCode, parsedExamId).first<any>();

			if (!token) {
				return fail(400, { error: 'Token tidak valid untuk ujian ini.' });
			}

			// Validasi kesesuaian sesi token dengan sesi siswa
			const studentSession = token.student_session_number || 1;
			const tokenSession = token.token_session_number;
			if (tokenSession && tokenSession !== studentSession) {
				return fail(400, { error: `Token ini khusus untuk Sesi ${tokenSession}. Sesi Anda adalah Sesi ${studentSession}.` });
			}

			// Validasi keaktifan ujian
			if (!token.is_active) {
				return fail(400, { error: 'Ujian saat ini tidak aktif.' });
			}

			// Validasi sesi dan waktu ujian
			let sessionRecord = null;
			try {
				sessionRecord = await db.prepare('SELECT start_time, end_time FROM exam_sessions WHERE exam_id = ? AND session_number = ?')
					.bind(parsedExamId, studentSession).first<{ start_time: string | null, end_time: string | null }>();
			} catch (e: any) {
				console.warn('Failed to fetch exam_sessions:', e.message);
			}
			
			const startTimeStr = sessionRecord?.start_time || token.exam_start_time;
			const endTimeStr = sessionRecord?.end_time || token.exam_end_time;
			
			const timeCheck = isStudentExamTimeActive(startTimeStr, endTimeStr, new Date(), clientTzOffset);
			if (!timeCheck.allowed) {
				if (timeCheck.reason === 'too_early') {
					return fail(400, { error: 'Waktu ujian belum dimulai untuk sesi Anda.' });
				} else if (timeCheck.reason === 'too_late') {
					return fail(400, { error: 'Waktu ujian telah berakhir untuk sesi Anda.' });
				}
			}

			if (!token.is_released) {
				return fail(400, { error: 'Token ujian ini belum dirilis oleh pengawas.' });
			}
			if (token.released_at) {
				const releasedAt = parseDate(token.released_at).getTime();
				const nowMs = Date.now();
				if (nowMs - releasedAt > 15 * 60 * 1000) {
					return fail(400, { error: 'Token sudah kedaluwarsa (melewati batas waktu 15 menit).' });
				}
			}
			if (parseDate(token.expires_at) < new Date()) {
				return fail(400, { error: 'Token sudah kedaluwarsa.' });
			}

			const allAttempts = await db.prepare(`SELECT id, status FROM student_attempts WHERE student_id = ? AND exam_id = ?`)
				.bind(locals.user!.id, token.exam_id).all<{ id: number; status: string }>();

			if (allAttempts.results && allAttempts.results.length > 0) {
				const mengerjakanAttempt = allAttempts.results.find((a) => a.status === 'mengerjakan');
				if (mengerjakanAttempt) {
					const signedCookie = await signExamToken(mengerjakanAttempt.id, locals.user!.id);
					cookies.set('exam_token_verified_' + mengerjakanAttempt.id, signedCookie, { path: '/', httpOnly: true, sameSite: 'lax' });
					throw redirect(302, `/siswa/ujian/${mengerjakanAttempt.id}`);
				}
				
				if (allAttempts.results.length >= (token.max_attempts || 1)) {
					return fail(400, { error: 'Anda sudah mencapai batas maksimal pengerjaan ujian ini.' });
				}
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
;null as any as Actions;