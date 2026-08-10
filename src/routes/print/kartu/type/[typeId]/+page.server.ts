import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ platform, params, locals }) => {
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
	const participants = await db.prepare(`
		SELECT u.id as user_id, u.name as student_name, u.username, u.nisn, u.nomor_peserta, u.photo, u.place_of_birth, u.date_of_birth, c.name as class_name
		FROM users u
		LEFT JOIN classes c ON u.class_id = c.id
		WHERE u.school_id = ? AND u.role = 'siswa' AND u.is_active = 1
		ORDER BY c.name, u.name
	`).bind(locals.user!.school_id).all();

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
