import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ platform, params, locals }) => {
	const db = getDB(platform);
	const examIdStr = params.exam_id;
	const examId = parseInt(examIdStr, 10);
	
	if (isNaN(examId)) throw error(400, 'ID Ujian tidak valid');

	// Get school info
	const school = await db.prepare('SELECT * FROM schools WHERE id = ?').bind(locals.user!.school_id).first();
	
	// Get exam info
	const exam = await db.prepare('SELECT e.*, s.name as subject_name, et.name as exam_type_name FROM exams e LEFT JOIN subjects s ON e.subject_id = s.id LEFT JOIN exam_types et ON e.exam_type_id = et.id WHERE e.id = ? AND e.school_id = ?').bind(examId, locals.user!.school_id).first();
	
	if (!exam) throw error(404, 'Ujian tidak ditemukan');

	// Get participants grouped by class (actually just ordered by class)
	const participants = await db.prepare(`
		SELECT p.id as participant_id, u.id as user_id, u.name as student_name, u.username, u.nisn, u.nomor_peserta, c.name as class_name, sa.signature
		FROM exam_participants p
		JOIN users u ON p.student_id = u.id
		LEFT JOIN classes c ON u.class_id = c.id
		LEFT JOIN student_attempts sa ON sa.student_id = u.id AND sa.exam_id = p.exam_id
		WHERE p.exam_id = ?
		ORDER BY c.name, u.name
	`).bind(examId).all();

	// Check login mode
	const sample = await db.prepare("SELECT username, nisn, nomor_peserta FROM users WHERE school_id = ? AND role = 'siswa' AND nomor_peserta IS NOT NULL LIMIT 1").bind(locals.user!.school_id).first();
	const isNomorPesertaMode = (sample && sample.username === sample.nomor_peserta);

	// Group participants by class
	const results = participants.results as any[];
	const participantsByClass = results.reduce<Record<string, any[]>>((acc, p) => {
		const className = p.class_name || 'Tanpa Kelas';
		if (!acc[className]) {
			acc[className] = [];
		}
		acc[className].push(p);
		return acc;
	}, {});

	return { 
		school,
		exam, 
		participantsByClass,
		isNomorPesertaMode
	};
};
