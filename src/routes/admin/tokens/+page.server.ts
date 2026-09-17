import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { generateTokenCode } from '$lib/server/auth';
import { checkSessionTimeWindow } from '$lib/utils/date';
import { formatExamTitle } from '$lib/utils/exam';
import { recordActivityLog, getClientIp } from '$lib/server/activity-log';

export interface ExamSessionItem {
	session_number: number;
	start_time: string | null;
	end_time: string | null;
}

export interface ExamSelectItem {
	id: number;
	title: string;
	start_time: string | null;
	end_time: string | null;
	sessions: ExamSessionItem[];
}

export const load: PageServerLoad = async ({ platform, locals }) => {
	if (!locals.user) throw redirect(302, '/login');
	const isSuperAdmin = locals.user.role === 'superadmin' || locals.user.school_id === null;

	const tokensRaw = await db.prepare(`
		SELECT t.*, e.title as exam_title, s.name as subject_name, et.code as exam_type_code, c.name as class_name,
		COALESCE((
			SELECT json_group_array(
				json_object(
					'id', u.id, 
					'name', u.name, 
					'username', u.username, 
					'start_time', sa.start_time,
					'status', sa.status
				)
			)
			FROM student_attempts sa
			JOIN users u ON sa.student_id = u.id
			WHERE sa.token_id = t.id
			   OR (sa.token_id IS NULL AND sa.exam_id = t.exam_id AND (t.session_number IS NULL OR t.session_number = COALESCE(u.session_number, 1)))
		), '[]') as used_by_students_json
		FROM tokens t 
		JOIN exams e ON t.exam_id = e.id
		LEFT JOIN subjects s ON e.subject_id = s.id
		LEFT JOIN exam_types et ON e.exam_type_id = et.id
		LEFT JOIN classes c ON e.class_id = c.id
		WHERE (? IS NULL OR t.school_id = ?)
		ORDER BY t.created_at DESC
	`).bind(locals.user.school_id, locals.user.school_id).all<any>();

	const examsRaw = await db.prepare(`
		SELECT e.id, e.title, e.start_time, e.end_time, s.name as subject_name, et.code as exam_type_code, c.name as class_name
		FROM exams e
		LEFT JOIN subjects s ON e.subject_id = s.id
		JOIN exam_types et ON e.exam_type_id = et.id
		LEFT JOIN classes c ON e.class_id = c.id
		WHERE e.is_active = 1 AND et.is_active = 1 AND e.school_id = ?
		ORDER BY e.title
	`).bind(locals.user.school_id).all<any>();

	const examIds = examsRaw.results.map((e: any) => e.id);
	let dbSessions: any[] = [];
	if (examIds.length > 0) {
		const placeholders = examIds.map(() => '?').join(',');
		const sessionsResult = await db.prepare(
			`SELECT exam_id, session_number, start_time, end_time FROM exam_sessions WHERE exam_id IN (${placeholders}) ORDER BY session_number`
		).bind(...examIds).all();
		dbSessions = sessionsResult.results;
	}

	const processedExams: ExamSelectItem[] = examsRaw.results.map((exam: any) => {
		const examDbSessions = dbSessions.filter((s: any) => s.exam_id === exam.id);
		let finalSessions: ExamSessionItem[] = [];

		if (examDbSessions.length > 0) {
			finalSessions = examDbSessions.map((s: any) => ({
				session_number: s.session_number,
				start_time: s.start_time || exam.start_time,
				end_time: s.end_time || exam.end_time
			}));
		} else {
			finalSessions = [{
				session_number: 1,
				start_time: exam.start_time,
				end_time: exam.end_time
			}];
		}

		return {
			id: exam.id,
			title: formatExamTitle({
				title: exam.title,
				examTypeCode: exam.exam_type_code,
				subjectName: exam.subject_name,
				className: exam.class_name
			}),
			start_time: exam.start_time,
			end_time: exam.end_time,
			sessions: finalSessions
		};
	});

	const processedTokens = (tokensRaw.results || []).map((t: any) => {
		let usedBy: any[] = [];
		try {
			usedBy = t.used_by_students_json ? JSON.parse(t.used_by_students_json) : [];
			if (Array.isArray(usedBy)) {
				usedBy = usedBy.filter((u: any) => u && u.id !== null);
			} else {
				usedBy = [];
			}
		} catch (e) {
			usedBy = [];
		}

		return {
			...t,
			exam_title: formatExamTitle({
				title: t.exam_title,
				examTypeCode: t.exam_type_code,
				subjectName: t.subject_name,
				className: t.class_name
			}),
			used_by_students: usedBy
		};
	});

	return { tokens: processedTokens, exams: processedExams };
};

export const actions: Actions = {
	generate: async ({ request, platform, locals, getClientAddress }) => {
		if (!locals.user) return fail(401, { error: 'Unauthorized' });
		const db = getDB(platform);

		const form = await request.formData();
		const examIdStr = form.get('exam_id')?.toString();
		const parsedExamId = parseInt(examIdStr || '', 10);
		const parsedSessionNumber = parseInt(form.get('session_number')?.toString() || '1', 10);
		const durationHours = parseInt(form.get('duration_hours')?.toString() || '2');

		if (isNaN(parsedExamId)) return fail(400, { error: 'Pilih ujian terlebih dahulu.' });
		if (isNaN(parsedSessionNumber) || parsedSessionNumber < 1) return fail(400, { error: 'Pilih sesi ujian terlebih dahulu.' });

		const exam = await db.prepare('SELECT id, title, start_time, end_time FROM exams WHERE id = ? AND school_id = ?').bind(parsedExamId, locals.user.school_id).first() as any;
		if (!exam) return fail(400, { error: 'Ujian tidak ditemukan.' });

		// Ambil waktu sesi dari exam_sessions jika ada
		const sessionRecord = await db.prepare(`
			SELECT start_time, end_time FROM exam_sessions WHERE exam_id = ? AND session_number = ?
		`).bind(parsedExamId, parsedSessionNumber).first<{ start_time: string | null; end_time: string | null }>();

		const tzOffsetStr = form.get('tz_offset')?.toString();
		const clientTzOffset = tzOffsetStr ? parseInt(tzOffsetStr, 10) : null;

		const startTimeStr = sessionRecord?.start_time || exam.start_time;
		const endTimeStr = sessionRecord?.end_time || exam.end_time;

		// Aturan 15 menit sebelum waktu sesi ujian
		const timeCheck = checkSessionTimeWindow(startTimeStr, endTimeStr, new Date(), clientTzOffset);
		if (!timeCheck.allowed) {
			if (timeCheck.reason === 'too_early') {
				return fail(400, { error: `Token Sesi ${parsedSessionNumber} baru dapat dibuat 15 menit sebelum waktu sesi ujian dimulai (mulai pukul ${timeCheck.timeFormatted}).` });
			} else if (timeCheck.reason === 'too_late') {
				return fail(400, { error: `Token tidak dapat dibuat karena Sesi ${parsedSessionNumber} telah berakhir.` });
			}
		}

		const nowIso = new Date().toISOString();

		// Check for active token per exam AND session_number
		const activeToken = await db.prepare(`
			SELECT token_code FROM tokens 
			WHERE exam_id = ? AND (session_number = ? OR session_number IS NULL) AND school_id = ? AND expires_at > ?
		`).bind(parsedExamId, parsedSessionNumber, locals.user.school_id, nowIso).first() as { token_code: string } | null;

		if (activeToken) {
			return fail(400, { error: `Gagal: Masih ada token aktif untuk Sesi ${parsedSessionNumber} ujian ini (${activeToken.token_code}). Harap hapus token tersebut dahulu jika ingin membuat yang baru.` });
		}

		const tokenCode = generateTokenCode();
		const expiresAt = new Date(Date.now() + durationHours * 60 * 60 * 1000).toISOString();

		try {
			// Hapus token lama yang kadaluwarsa dan tidak pernah digunakan oleh siswa
			await db.prepare(`
				DELETE FROM tokens 
				WHERE exam_id = ? AND (session_number = ? OR session_number IS NULL) AND school_id = ? 
				  AND id NOT IN (SELECT DISTINCT token_id FROM student_attempts WHERE exam_id = ? AND token_id IS NOT NULL)
			`).bind(parsedExamId, parsedSessionNumber, locals.user.school_id, parsedExamId).run();

			await db.prepare('INSERT INTO tokens (school_id, exam_id, session_number, token_code, is_released, released_at, created_by, expires_at) VALUES (?, ?, ?, ?, 1, datetime(\'now\'), ?, ?)')
				.bind(locals.user.school_id, parsedExamId, parsedSessionNumber, tokenCode, locals.user.id, expiresAt).run();

			const ip = getClientIp(request, getClientAddress);
			await recordActivityLog(db, {
				schoolId: locals.user.school_id,
				userId: locals.user.id,
				userName: locals.user.name,
				userRole: locals.user.role,
				action: 'generate token',
				detail: `Membuat token Sesi ${parsedSessionNumber}: ${tokenCode} (${exam.title || 'Ujian'})`,
				ipAddress: ip
			});

			return { success: `Token Sesi ${parsedSessionNumber} berhasil dibuat: ${tokenCode}` };
		} catch (e: any) {
			console.error(e);
			return fail(500, { error: e.message || 'Gagal membuat token' });
		}
	},

	release: async ({ request, platform, locals, getClientAddress }) => {
		if (!locals.user) return fail(401, { error: 'Unauthorized' });
		const db = getDB(platform);
		const form = await request.formData();
		const idStr = form.get('id')?.toString();
		const parsedId = parseInt(idStr || '', 10);
		if (isNaN(parsedId)) return fail(400, { error: 'ID tidak valid.' });

		try {
			await db.prepare('UPDATE tokens SET is_released = 1, released_at = datetime("now") WHERE id = ? AND school_id = ?').bind(parsedId, locals.user.school_id).run();

			const ip = getClientIp(request, getClientAddress);
			await recordActivityLog(db, {
				schoolId: locals.user.school_id,
				userId: locals.user.id,
				userName: locals.user.name,
				userRole: locals.user.role,
				action: 'rilis token',
				detail: `Merilis token ujian (ID: ${parsedId}) ke siswa`,
				ipAddress: ip
			});

			return { success: 'Token berhasil dirilis ke siswa. Token akan ditarik otomatis dalam 15 menit.' };
		} catch (e: any) {
			console.error(e);
			return fail(500, { error: e.message || 'Gagal merilis token' });
		}
	},

	revoke: async ({ request, platform, locals }) => {
		if (!locals.user) return fail(401, { error: 'Unauthorized' });
		const db = getDB(platform);
		const form = await request.formData();
		const idStr = form.get('id')?.toString();
		const parsedId = parseInt(idStr || '', 10);
		if (isNaN(parsedId)) return fail(400, { error: 'ID tidak valid.' });

		try {
			await db.prepare('UPDATE tokens SET is_released = 0 WHERE id = ? AND school_id = ?').bind(parsedId, locals.user.school_id).run();
			return { success: 'Token berhasil ditarik.' };
		} catch (e: any) {
			console.error(e);
			return fail(500, { error: e.message || 'Gagal menarik token' });
		}
	},

	delete: async ({ request, platform, locals }) => {
		if (!locals.user) return fail(401, { error: 'Unauthorized' });
		const db = getDB(platform);
		const form = await request.formData();
		const idStr = form.get('id')?.toString();
		const parsedId = parseInt(idStr || '', 10);
		if (isNaN(parsedId)) return fail(400, { error: 'ID tidak valid.' });

		try {
			const usage = await db.prepare('SELECT COUNT(*) as count FROM student_attempts WHERE token_id = ?').bind(parsedId).first() as {count: number};
			if (usage && usage.count > 0) {
				return fail(400, { error: 'Gagal dihapus: Token ini telah digunakan oleh peserta ujian.' });
			}
			
			await db.prepare('DELETE FROM tokens WHERE id = ? AND school_id = ?').bind(parsedId, locals.user.school_id).run();
			return { success: 'Token berhasil dihapus.' };
		} catch (err: any) {
			console.error('Delete token error:', err);
			return fail(500, { error: err.message || 'Terjadi kesalahan sistem saat menghapus token.' });
		}
	}
};

