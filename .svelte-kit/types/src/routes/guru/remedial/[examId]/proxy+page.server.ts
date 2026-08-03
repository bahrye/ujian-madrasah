// @ts-nocheck
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load = async ({ platform, params, locals }: Parameters<PageServerLoad>[0]) => {
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
		SELECT ep.id as participant_id, u.nisn, u.name as student_name, c.name as class_name
		FROM exam_participants ep
		JOIN users u ON ep.student_id = u.id
		LEFT JOIN classes c ON u.class_id = c.id
		WHERE ep.exam_id = ?
		ORDER BY c.name, u.name
	`).bind(examId).all();

	// Ambil semua siswa di sekolah (untuk dropdown tambah peserta)
	const allStudents = await db.prepare(`
		SELECT u.id, u.nisn, u.name, c.name as class_name
		FROM users u
		LEFT JOIN classes c ON u.class_id = c.id
		WHERE u.school_id = ? AND u.role = 'siswa'
		ORDER BY c.name, u.name
	`).bind(locals.user!.school_id).all();

	// 2. Token Aktif
	const activeToken = await db.prepare(`
		SELECT id, token, expires_at, released_at
		FROM exam_tokens
		WHERE exam_id = ? AND expires_at > datetime('now')
		ORDER BY expires_at DESC LIMIT 1
	`).bind(examId).first();

	// 3. Monitoring (Attempts)
	const attempts = await db.prepare(`
		SELECT sa.id, sa.status, sa.created_at as start_time, sa.submit_time,
			   u.name as student_name, c.name as class_name
		FROM student_attempts sa
		JOIN users u ON sa.student_id = u.id
		LEFT JOIN classes c ON u.class_id = c.id
		WHERE sa.exam_id = ?
		ORDER BY sa.created_at DESC
	`).bind(examId).all();

	return {
		exam,
		participants: participants.results,
		allStudents: allStudents.results,
		activeToken,
		attempts: attempts.results
	};
};

export const actions = {
	// ===================== PARTICIPANTS =====================
	addParticipants: async ({ request, platform, params, locals }: import('./$types').RequestEvent) => {
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

	removeParticipant: async ({ request, platform, locals }: import('./$types').RequestEvent) => {
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
	generateToken: async ({ request, platform, params, locals }: import('./$types').RequestEvent) => {
		const db = getDB(platform);
		const form = await request.formData();
		const durationHours = parseFloat(form.get('duration_hours')?.toString() || '2');
		
		// Validasi kepemilikan
		const exam = await db.prepare('SELECT id FROM exams WHERE id = ? AND created_by = ?').bind(params.examId, locals.user!.id).first();
		if (!exam) return fail(403, { error: 'Akses ditolak.' });

		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		let token = '';
		for (let i = 0; i < 6; i++) {
			token += chars.charAt(Math.floor(Math.random() * chars.length));
		}

		const now = Date.now();
		const expiresAt = new Date(now + durationHours * 60 * 60 * 1000).toISOString();
		const releasedAt = new Date(now).toISOString();

		await db.prepare(`
			INSERT INTO exam_tokens (exam_id, proctor_id, token, expires_at, released_at)
			VALUES (?, ?, ?, ?, ?)
		`).bind(params.examId, locals.user!.id, token, expiresAt, releasedAt).run();

		return { success: 'Token berhasil dibuat.', token };
	},

	deleteToken: async ({ request, platform, locals }: import('./$types').RequestEvent) => {
		const db = getDB(platform);
		const form = await request.formData();
		const id = form.get('id')?.toString();

		if (!id) return fail(400, { error: 'ID Token tidak valid.' });
		
		const isOwner = await db.prepare(`
			SELECT 1 FROM exam_tokens et 
			JOIN exams e ON et.exam_id = e.id 
			WHERE et.id = ? AND e.created_by = ?
		`).bind(id, locals.user!.id).first();
		
		if (!isOwner) return fail(403, { error: 'Akses ditolak.' });

		await db.prepare('DELETE FROM exam_tokens WHERE id = ?').bind(id).run();
		return { success: 'Token berhasil dicabut.' };
	},

	// ===================== MONITORING =====================
	forceSubmit: async ({ request, platform, locals }: import('./$types').RequestEvent) => {
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
;null as any as Actions;