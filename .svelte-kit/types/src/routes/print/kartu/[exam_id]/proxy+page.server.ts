// @ts-nocheck
import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { error } from '@sveltejs/kit';

import { formatExamTitle } from '$lib/utils/exam';

export const load = async ({ platform, params, locals }: Parameters<PageServerLoad>[0]) => {
	const db = getDB(platform);
	const examIdStr = params.exam_id;
	const examId = parseInt(examIdStr, 10);
	
	if (isNaN(examId)) throw error(400, 'ID Ujian tidak valid');

	// Get school info
	const school = await db.prepare('SELECT * FROM schools WHERE id = ?').bind(locals.user!.school_id).first();
	
	const exam = await db.prepare(`
		SELECT e.*, s.name as subject_name, et.code as exam_type_code, et.name as exam_type_name, c.name as class_name,
			COALESCE(
				(
					SELECT GROUP_CONCAT(u.name, '||')
					FROM exam_proctors epr
					JOIN users u ON epr.proctor_id = u.id
					WHERE epr.exam_id = e.id
				),
				(
					SELECT u.name FROM users u WHERE u.id = e.created_by AND u.role = 'guru'
				)
			) as proctors
		FROM exams e 
		LEFT JOIN subjects s ON e.subject_id = s.id 
		LEFT JOIN exam_types et ON e.exam_type_id = et.id 
		LEFT JOIN classes c ON e.class_id = c.id
		WHERE e.id = ? AND e.school_id = ?
	`).bind(examId, locals.user!.school_id).first<any>();
	
	if (!exam) throw error(404, 'Ujian tidak ditemukan');

	exam.title = formatExamTitle({
		title: exam.title,
		examTypeCode: exam.exam_type_code,
		subjectName: exam.subject_name,
		className: exam.class_name
	});

	// Get participants
	const participants = await db.prepare(`
		SELECT p.id as participant_id, u.id as user_id, u.name as student_name, u.username, u.nisn, u.nomor_peserta, u.photo, u.place_of_birth, u.date_of_birth, c.name as class_name, u.session_number, r.name as room_name
		FROM exam_participants p
		JOIN users u ON p.student_id = u.id
		LEFT JOIN classes c ON u.class_id = c.id
		LEFT JOIN exam_rooms r ON p.room_id = r.id
		WHERE p.exam_id = ?
		ORDER BY CASE c.level
			WHEN 'I' THEN 1 WHEN 'II' THEN 2 WHEN 'III' THEN 3 WHEN 'IV' THEN 4 WHEN 'V' THEN 5 WHEN 'VI' THEN 6 WHEN 'VII' THEN 7 WHEN 'VIII' THEN 8 WHEN 'IX' THEN 9 WHEN 'X' THEN 10 WHEN 'XI' THEN 11 WHEN 'XII' THEN 12
			WHEN '1' THEN 1 WHEN '2' THEN 2 WHEN '3' THEN 3 WHEN '4' THEN 4 WHEN '5' THEN 5 WHEN '6' THEN 6 WHEN '7' THEN 7 WHEN '8' THEN 8 WHEN '9' THEN 9 WHEN '10' THEN 10 WHEN '11' THEN 11 WHEN '12' THEN 12
			ELSE 99 END ASC, c.name ASC, u.name ASC
	`).bind(examId).all();

	const sessions = await db.prepare('SELECT * FROM exam_sessions WHERE exam_id = ?').bind(examId).all();

	// Calculate login info for each participant based on what's available
	const formattedParticipants = participants.results.map((p: any) => {
		const isNomorPesertaMode = p.username === p.nomor_peserta;
		const sessionRecord = sessions.results.find((s: any) => s.session_number === p.session_number);
		
		return {
			...p,
			login_username: p.username,
			login_password: p.nisn, // Password is always NISN in this system
			login_mode_label: isNomorPesertaMode ? 'No. Peserta' : 'NISN',
			display_nisn: p.nisn,
			display_nomor_peserta: p.nomor_peserta || '-',
			session_time: sessionRecord ? `${(sessionRecord.start_time as string)?.slice(11, 16) || '?'} - ${(sessionRecord.end_time as string)?.slice(11, 16) || '?'}` : null
		};
	});

	const roomsCount = await db.prepare('SELECT COUNT(*) as count FROM exam_rooms WHERE exam_id = ?').bind(examId).first<{count: number}>();
	const hasRooms = (roomsCount?.count || 0) > 0;

	// Fetch Panitia (committee) assigned to this Exam's Exam Type (proctor_role = 'cm')
	let committeeName: string | null = null;
	if (exam && (exam as any).exam_type_id) {
		const committee = await db.prepare(`
			SELECT u.name
			FROM exam_type_proctors etp
			JOIN users u ON etp.proctor_id = u.id
			WHERE etp.exam_type_id = ? AND etp.proctor_role = 'cm'
			ORDER BY etp.id ASC
			LIMIT 1
		`).bind((exam as any).exam_type_id).first<{ name: string }>();
		committeeName = committee?.name || null;
	}

	return { 
		school,
		exam, 
		participants: formattedParticipants,
		hasSessions: sessions.results.length > 0,
		hasRooms,
		committeeName
	};
};
