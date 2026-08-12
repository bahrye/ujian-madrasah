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
		SELECT p.id as participant_id, u.id as user_id, u.name as student_name, u.username, u.nisn, u.nomor_peserta, c.name as class_name, sa.signature, u.session_number, r.name as room_name
		FROM exam_participants p
		JOIN users u ON p.student_id = u.id
		LEFT JOIN classes c ON u.class_id = c.id
		LEFT JOIN exam_rooms r ON p.room_id = r.id
		LEFT JOIN student_attempts sa ON sa.student_id = u.id AND sa.exam_id = p.exam_id
		WHERE p.exam_id = ?
		ORDER BY r.name, u.session_number, c.name, u.name
	`).bind(examId).all();

	// Check login mode
	const sample = await db.prepare("SELECT username, nisn, nomor_peserta FROM users WHERE school_id = ? AND role = 'siswa' AND nomor_peserta IS NOT NULL LIMIT 1").bind(locals.user!.school_id).first();
	const isNomorPesertaMode = (sample && sample.username === sample.nomor_peserta);

	const sessionsCount = await db.prepare('SELECT COUNT(*) as count FROM exam_sessions WHERE exam_id = ?').bind(examId).first<{count: number}>();
	const hasSessions = (sessionsCount?.count || 0) > 0;

	const roomsCount = await db.prepare('SELECT COUNT(*) as count FROM exam_rooms WHERE exam_id = ?').bind(examId).first<{count: number}>();
	const hasRooms = (roomsCount?.count || 0) > 0;

	// Group participants by Room -> Session -> Class
	const results = participants.results as any[];
	const participantsGrouped = results.reduce<Record<string, Record<number, any[]>>>((acc, p) => {
		const roomName = p.room_name || 'Ruang Default';
		const sessionNumber = p.session_number || 1;
		
		if (!acc[roomName]) acc[roomName] = {};
		if (!acc[roomName][sessionNumber]) acc[roomName][sessionNumber] = [];
		
		acc[roomName][sessionNumber].push(p);
		return acc;
	}, {});

	return { 
		school,
		exam, 
		participantsGrouped,
		isNomorPesertaMode,
		hasSessions,
		hasRooms
	};
};
