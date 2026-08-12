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

	// Fetch rooms and sessions for this exam
	const participantsGroupedRaw = await db.prepare(`
		SELECT r.name as room_name, u.session_number, COUNT(p.id) as count
		FROM exam_participants p
		JOIN users u ON p.student_id = u.id
		LEFT JOIN exam_rooms r ON p.room_id = r.id
		WHERE p.exam_id = ?
		GROUP BY r.id, r.name, u.session_number
		ORDER BY r.name, u.session_number
	`).bind(examId).all();

	const participantsGrouped = participantsGroupedRaw.results.reduce<Record<string, Record<number, number>>>((acc, row: any) => {
		const roomName = row.room_name || 'Ruang Default';
		const sessionNumber = row.session_number || 1;
		if (!acc[roomName]) acc[roomName] = {};
		acc[roomName][sessionNumber] = row.count;
		return acc;
	}, {});

	// Check login mode
	const sample = await db.prepare("SELECT username, nisn, nomor_peserta FROM users WHERE school_id = ? AND role = 'siswa' AND nomor_peserta IS NOT NULL LIMIT 1").bind(locals.user!.school_id).first();
	const isNomorPesertaMode = (sample && sample.username === sample.nomor_peserta);

	const sessionsCount = await db.prepare('SELECT COUNT(*) as count FROM exam_sessions WHERE exam_id = ?').bind(examId).first<{count: number}>();
	const hasSessions = (sessionsCount?.count || 0) > 0;

	const roomsCount = await db.prepare('SELECT COUNT(*) as count FROM exam_rooms WHERE exam_id = ?').bind(examId).first<{count: number}>();
	const hasRooms = (roomsCount?.count || 0) > 0;

	return { 
		school,
		exam, 
		participantsGrouped,
		isNomorPesertaMode,
		hasSessions,
		hasRooms
	};
};
