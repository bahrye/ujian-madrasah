import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load: PageServerLoad = async ({ platform, params, locals }) => {
	const db = getDB(platform);
	const examId = params.examId;

	// Validasi kepemilikan ujian
	const exam = await db.prepare(`
		SELECT e.*, s.name as subject_name
		FROM exams e
		LEFT JOIN subjects s ON e.subject_id = s.id
		WHERE e.id = ? AND e.school_id = ? AND e.created_by = ?
	`).bind(examId, locals.user!.school_id, locals.user!.id).first();

	if (!exam) throw redirect(302, '/guru/remedial');

	// 1. Peserta Remedial
	const participants = await db.prepare(`
		SELECT ep.id as participant_id, u.username as nisn, u.name as student_name, c.name as class_name
		FROM exam_participants ep
		JOIN users u ON ep.student_id = u.id
		LEFT JOIN classes c ON u.class_id = c.id
		WHERE ep.exam_id = ?
		ORDER BY c.name, u.name
	`).bind(examId).all();

	// Ambil semua siswa di sekolah (untuk dropdown tambah peserta)
	const allStudents = await db.prepare(`
		SELECT u.id, u.username as nisn, u.name, c.name as class_name
		FROM users u
		LEFT JOIN classes c ON u.class_id = c.id
		WHERE u.school_id = ? AND u.role = 'siswa'
		ORDER BY c.name, u.name
	`).bind(locals.user!.school_id).all();

	// 2. Token Aktif
	const activeToken = await db.prepare(`
		SELECT id, token_code as token, expires_at, released_at
		FROM tokens
		WHERE exam_id = ? AND expires_at > datetime('now')
		ORDER BY expires_at DESC LIMIT 1
	`).bind(examId).first();

	// 3. Monitoring (Attempts)
	const rawAttempts = await db.prepare(`
		SELECT sa.id, sa.status, sa.created_at as start_time, sa.submit_time,
			   sa.violation_count, sa.violation_logs,
			   u.name as student_name, c.name as class_name,
			   (SELECT COUNT(*) FROM questions WHERE exam_id = ?) as question_count
		FROM student_attempts sa
		JOIN users u ON sa.student_id = u.id
		LEFT JOIN classes c ON u.class_id = c.id
		WHERE sa.exam_id = ?
		ORDER BY sa.created_at DESC
	`).bind(examId, examId).all();

	const kv = platform?.env?.EXAM_ANSWERS;
	const attempts = await Promise.all(rawAttempts.results.map(async (a: any) => {
		let answeredCount = 0;
		let warnings = 0;
		let warningLogs: any[] = [];
		if (a.status === 'mengerjakan') {
			if (kv) {
				const stored = await kv.get(`attempt_${a.id}_answers`);
				if (stored) {
					try {
						const data = JSON.parse(stored);
						if (data && data.answers) {
							answeredCount = Object.values(data.answers).filter(val => val !== null && val !== '').length;
						}
						if (data && data.warnings) warnings = data.warnings;
						if (data && data.warningLogs) warningLogs = data.warningLogs;
					} catch (e) {}
				}
			}
			if (answeredCount === 0) {
				const dbAnswers = await db.prepare('SELECT COUNT(*) as c FROM student_answers WHERE attempt_id = ? AND answer_given IS NOT NULL AND answer_given != ""').bind(a.id).first() as any;
				if (dbAnswers && dbAnswers.c) answeredCount = dbAnswers.c;
			}
		} else {
			warnings = a.violation_count || 0;
			try { warningLogs = a.violation_logs ? JSON.parse(a.violation_logs) : []; } catch(e) {}
			const dbAnswers = await db.prepare('SELECT COUNT(*) as c FROM student_answers WHERE attempt_id = ? AND answer_given IS NOT NULL AND answer_given != ""').bind(a.id).first() as any;
			if (dbAnswers && dbAnswers.c) answeredCount = dbAnswers.c;
		}
		return { ...a, answeredCount, warnings, warningLogs };
	}));

	return {
		exam,
		participants: participants.results,
		allStudents: allStudents.results,
		activeToken,
		attempts
	};
};

export const actions: Actions = {
	// ===================== PARTICIPANTS =====================
	addParticipants: async ({ request, platform, params, locals }) => {
		const db = getDB(platform);
		const form = await request.formData();
		const studentIds = form.getAll('student_ids');

		if (!studentIds.length) return fail(400, { error: 'Pilih minimal satu siswa.' });

		// Validasi kepemilikan
		const exam = await db.prepare('SELECT id FROM exams WHERE id = ? AND created_by = ?').bind(params.examId, locals.user!.id).first();
		if (!exam) return fail(403, { error: 'Akses ditolak.' });

		const stmt = db.prepare('INSERT INTO exam_participants (exam_id, student_id) VALUES (?, ?)');
		const batch = studentIds.map(id => stmt.bind(params.examId, id.toString()));

		try {
			await db.batch(batch);
			return { success: 'Peserta berhasil ditambahkan.' };
		} catch (e: any) {
			if (e.message.includes('UNIQUE')) {
				return fail(400, { error: 'Beberapa siswa sudah ada di daftar.' });
			}
			return fail(500, { error: 'Gagal menambahkan peserta.' });
		}
	},

	removeParticipant: async ({ request, platform, locals }) => {
		const db = getDB(platform);
		const form = await request.formData();
		const participantId = form.get('participant_id')?.toString();

		if (!participantId) return fail(400, { error: 'ID tidak valid.' });
		
		// Verifikasi kepemilikan ujian terkait participant ini
		const isOwner = await db.prepare(`
			SELECT 1 FROM exam_participants ep 
			JOIN exams e ON ep.exam_id = e.id 
			WHERE ep.id = ? AND e.created_by = ?
		`).bind(participantId, locals.user!.id).first();
		
		if (!isOwner) return fail(403, { error: 'Akses ditolak.' });

		await db.prepare('DELETE FROM exam_participants WHERE id = ?').bind(participantId).run();
		return { success: 'Peserta berhasil dihapus.' };
	},

	// ===================== TOKENS =====================
	generateToken: async ({ request, platform, params, locals }) => {
		const db = getDB(platform);
		await request.formData(); // Consume body to prevent Cloudflare Worker error
		
		// Validasi kepemilikan
		const exam = await db.prepare('SELECT id FROM exams WHERE id = ? AND created_by = ?').bind(params.examId, locals.user!.id).first();
		if (!exam) return fail(403, { error: 'Akses ditolak.' });

		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		let token = '';
		for (let i = 0; i < 6; i++) {
			token += chars.charAt(Math.floor(Math.random() * chars.length));
		}

		const now = Date.now();
		const expiresAt = new Date(now + 15 * 60 * 1000).toISOString();

		await db.prepare(`
			INSERT INTO tokens (school_id, exam_id, created_by, token_code, is_released, expires_at, released_at)
			VALUES (?, ?, ?, ?, 1, ?, datetime('now'))
		`).bind(locals.user!.school_id, params.examId, locals.user!.id, token, expiresAt).run();

		return { success: 'Token berhasil dibuat.', token };
	},

	deleteToken: async ({ request, platform, locals }) => {
		const db = getDB(platform);
		const form = await request.formData();
		const id = form.get('id')?.toString();

		if (!id) return fail(400, { error: 'ID Token tidak valid.' });
		
		const isOwner = await db.prepare(`
			SELECT 1 FROM tokens t 
			JOIN exams e ON t.exam_id = e.id 
			WHERE t.id = ? AND e.created_by = ?
		`).bind(id, locals.user!.id).first();
		
		if (!isOwner) return fail(403, { error: 'Akses ditolak.' });

		await db.prepare('DELETE FROM tokens WHERE id = ?').bind(id).run();
		return { success: 'Token berhasil dicabut.' };
	},

	// ===================== MONITORING =====================
	forceSubmit: async ({ request, platform, locals }) => {
		const db = getDB(platform);
		const form = await request.formData();
		const attemptId = form.get('attempt_id')?.toString();

		if (!attemptId) return fail(400, { error: 'ID Attempt tidak valid.' });
		
		const isOwner = await db.prepare(`
			SELECT 1 FROM student_attempts sa 
			JOIN exams e ON sa.exam_id = e.id 
			WHERE sa.id = ? AND e.created_by = ?
		`).bind(attemptId, locals.user!.id).first();
		
		if (!isOwner) return fail(403, { error: 'Akses ditolak.' });

		await db.prepare(`
			UPDATE student_attempts 
			SET status = 'waktu_habis', submit_time = datetime('now')
			WHERE id = ? AND status = 'mengerjakan'
		`).bind(attemptId).run();

		return { success: 'Ujian siswa berhasil diakhiri secara paksa.' };
	}
};
