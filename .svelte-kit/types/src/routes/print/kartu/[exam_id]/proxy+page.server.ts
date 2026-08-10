// @ts-nocheck
import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { error } from '@sveltejs/kit';

export const load = async ({ platform, params, locals }: Parameters<PageServerLoad>[0]) => {
	const db = getDB(platform);
	const examIdStr = params.exam_id;
	const examId = parseInt(examIdStr, 10);
	
	if (isNaN(examId)) throw error(400, 'ID Ujian tidak valid');

	// Get school info
	const school = await db.prepare('SELECT * FROM schools WHERE id = ?').bind(locals.user!.school_id).first();
	
	// Get exam info
	const exam = await db.prepare('SELECT e.*, s.name as subject_name, et.name as exam_type_name FROM exams e LEFT JOIN subjects s ON e.subject_id = s.id LEFT JOIN exam_types et ON e.exam_type_id = et.id WHERE e.id = ? AND e.school_id = ?').bind(examId, locals.user!.school_id).first();
	
	if (!exam) throw error(404, 'Ujian tidak ditemukan');

	// Get participants
	const participants = await db.prepare(`
		SELECT p.id as participant_id, u.id as user_id, u.name as student_name, u.username, u.nisn, u.nomor_peserta, u.photo, u.place_of_birth, u.date_of_birth, c.name as class_name
		FROM exam_participants p
		JOIN users u ON p.student_id = u.id
		LEFT JOIN classes c ON u.class_id = c.id
		WHERE p.exam_id = ?
		ORDER BY CASE c.level
			WHEN 'I' THEN 1 WHEN 'II' THEN 2 WHEN 'III' THEN 3 WHEN 'IV' THEN 4 WHEN 'V' THEN 5 WHEN 'VI' THEN 6 WHEN 'VII' THEN 7 WHEN 'VIII' THEN 8 WHEN 'IX' THEN 9 WHEN 'X' THEN 10 WHEN 'XI' THEN 11 WHEN 'XII' THEN 12
			WHEN '1' THEN 1 WHEN '2' THEN 2 WHEN '3' THEN 3 WHEN '4' THEN 4 WHEN '5' THEN 5 WHEN '6' THEN 6 WHEN '7' THEN 7 WHEN '8' THEN 8 WHEN '9' THEN 9 WHEN '10' THEN 10 WHEN '11' THEN 11 WHEN '12' THEN 12
			ELSE 99 END ASC, c.name ASC, u.name ASC
	`).bind(examId).all();

	// Calculate login info for each participant based on what's available
	const formattedParticipants = participants.results.map((p: any) => {
		const isNomorPesertaMode = p.username === p.nomor_peserta;
		
		return {
			...p,
			login_username: p.username,
			login_password: p.nisn, // Password is always NISN in this system
			login_mode_label: isNomorPesertaMode ? 'No. Peserta' : 'NISN',
			display_nisn: p.nisn,
			display_nomor_peserta: p.nomor_peserta || '-'
		};
	});

	return { 
		school,
		exam, 
		participants: formattedParticipants
	};
};
