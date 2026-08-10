// @ts-nocheck
import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { error } from '@sveltejs/kit';

export const load = async ({ platform, params, locals, url }: Parameters<PageServerLoad>[0]) => {
	const db = getDB(platform);
	const typeIdStr = params.typeId;
	const typeId = parseInt(typeIdStr, 10);
	
	if (isNaN(typeId)) throw error(400, 'ID Tipe Ujian tidak valid');

	// Get school info
	const school = await db.prepare('SELECT * FROM schools WHERE id = ?').bind(locals.user!.school_id).first();
	
	// Get exam type info
	const examType = await db.prepare('SELECT * FROM exam_types WHERE id = ? AND school_id = ?').bind(typeId, locals.user!.school_id).first();
	
	if (!examType) throw error(404, 'Tipe Ujian tidak ditemukan');

	// Get all active students for this school
	// Including both username (which can be NISN or Nomor Peserta) and the explicit fields
	const classIdStr = url.searchParams.get('class_id');
	const classId = parseInt(classIdStr || '', 10);
	let query = `
		SELECT u.id as user_id, u.name as student_name, u.username, u.nisn, u.nomor_peserta, u.photo, u.place_of_birth, u.date_of_birth, c.name as class_name
		FROM users u
		JOIN classes c ON u.class_id = c.id
		JOIN exam_type_classes etc ON etc.class_id = u.class_id
		WHERE u.school_id = ? AND u.role = 'siswa' AND u.is_active = 1 AND etc.exam_type_id = ?
	`;
	let paramsArr: any[] = [locals.user!.school_id, typeId];

	if (!isNaN(classId)) {
		query += ` AND u.class_id = ?`;
		paramsArr.push(classId);
	}

	query += ` ORDER BY CASE c.level
		WHEN 'I' THEN 1 WHEN 'II' THEN 2 WHEN 'III' THEN 3 WHEN 'IV' THEN 4 WHEN 'V' THEN 5 WHEN 'VI' THEN 6 WHEN 'VII' THEN 7 WHEN 'VIII' THEN 8 WHEN 'IX' THEN 9 WHEN 'X' THEN 10 WHEN 'XI' THEN 11 WHEN 'XII' THEN 12
		WHEN '1' THEN 1 WHEN '2' THEN 2 WHEN '3' THEN 3 WHEN '4' THEN 4 WHEN '5' THEN 5 WHEN '6' THEN 6 WHEN '7' THEN 7 WHEN '8' THEN 8 WHEN '9' THEN 9 WHEN '10' THEN 10 WHEN '11' THEN 11 WHEN '12' THEN 12
		ELSE 99 END ASC, c.name ASC, u.name ASC`;

	const participants = await db.prepare(query).bind(...paramsArr).all();

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
		examType, 
		participants: formattedParticipants
	};
};
