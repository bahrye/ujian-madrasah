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

	// Optional class filter
	const classIdStr = url.searchParams.get('class_id');
	const classId = parseInt(classIdStr || '', 10);

	let examsQuery = `
		SELECT e.*, s.name as subject_name, et.name as exam_type_name
		FROM exams e
		LEFT JOIN subjects s ON e.subject_id = s.id
		LEFT JOIN exam_types et ON e.exam_type_id = et.id
		WHERE e.exam_type_id = ? AND e.school_id = ?
	`;
	const examsParams: any[] = [typeId, locals.user!.school_id];

	if (!isNaN(classId)) {
		examsQuery += ` AND (e.class_id = ? OR e.class_id IS NULL)`;
		examsParams.push(classId);
	}

	examsQuery += ` ORDER BY e.start_time ASC, e.created_at ASC`;

	const examsRes = await db.prepare(examsQuery).bind(...examsParams).all();
	const examsList = (examsRes.results || []) as any[];

	// Check login mode
	const sample = await db.prepare("SELECT username, nisn, nomor_peserta FROM users WHERE school_id = ? AND role = 'siswa' AND nomor_peserta IS NOT NULL LIMIT 1").bind(locals.user!.school_id).first();
	const isNomorPesertaMode = (sample && sample.username === sample.nomor_peserta);

	// Fetch all teachers/proctors/admins in school once
	const schoolTeachersRes = await db.prepare(`
		SELECT id, name, nip, role
		FROM users
		WHERE school_id = ? AND role IN ('guru', 'pengawas', 'admin') AND is_active = 1
		ORDER BY name ASC
	`).bind(locals.user!.school_id).all();
	const schoolTeachers = (schoolTeachersRes.results || []) as any[];

	// For each exam, build data
	const examDataList: any[] = [];

	for (const exam of examsList) {
		const examId = exam.id;

		let filterClause = '';
		const pParams: any[] = [examId];
		if (!isNaN(classId)) {
			filterClause = ` AND u.class_id = ?`;
			pParams.push(classId);
		}

		const participants = await db.prepare(`
			SELECT ep.id as participant_id, u.id as user_id, u.name as student_name, u.username, u.nisn, u.nomor_peserta, c.name as class_name, sa.signature, u.session_number, er.name as room_name
			FROM exam_participants ep
			JOIN users u ON ep.student_id = u.id
			LEFT JOIN classes c ON u.class_id = c.id
			LEFT JOIN exam_rooms er ON ep.room_id = er.id
			LEFT JOIN student_attempts sa ON sa.student_id = u.id AND sa.exam_id = ep.exam_id
			WHERE ep.exam_id = ? ${filterClause}
			ORDER BY er.name, u.session_number, c.name, u.name
		`).bind(...pParams).all();

		const sessionsCount = await db.prepare('SELECT COUNT(*) as count FROM exam_sessions WHERE exam_id = ?').bind(examId).first<{count: number}>();
		const hasSessions = (sessionsCount?.count || 0) > 0;

		const roomsCount = await db.prepare('SELECT COUNT(*) as count FROM exam_rooms WHERE exam_id = ?').bind(examId).first<{count: number}>();
		const hasRooms = (roomsCount?.count || 0) > 0;

		const sessionRecords = await db.prepare('SELECT * FROM exam_sessions WHERE exam_id = ?').bind(examId).all();
		const sessionMap: Record<number, { start_time: string | null; end_time: string | null }> = {};
		if (sessionRecords.results) {
			for (const s of sessionRecords.results as any[]) {
				sessionMap[s.session_number] = s;
			}
		}

		// Proctors assigned to this exam
		const assignedProctorsRes = await db.prepare(`
			SELECT DISTINCT u.id, u.name, u.nip, u.role, COALESCE(ep.proctor_role, 'p1') as proctor_role
			FROM exam_proctors ep
			JOIN users u ON ep.proctor_id = u.id
			WHERE ep.exam_id = ?
			ORDER BY ep.id ASC
		`).bind(examId).all();

		const assignedProctors = (assignedProctorsRes.results || []) as any[];
		const assignedIds = new Set(assignedProctors.map(p => p.id));
		const proctorOptions = [
			...assignedProctors,
			...schoolTeachers.filter(t => !assignedIds.has(t.id))
		];

		const p1Obj = assignedProctors.find(p => p.proctor_role === 'p1' || p.proctor_role === 'Pengawas 1');
		const p2Obj = assignedProctors.find(p => p.proctor_role === 'p2' || p.proctor_role === 'Pengawas 2');

		const defaultProctor1Id = p1Obj?.id || assignedProctors[0]?.id || proctorOptions[0]?.id || '';
		const defaultProctor2Id = p2Obj?.id || (assignedProctors.length > 1 && assignedProctors[1]?.id !== defaultProctor1Id ? assignedProctors[1]?.id : '');

		const results = participants.results as any[];
		const participantsGrouped = results.reduce<Record<string, Record<number, any[]>>>((acc, p) => {
			const roomName = p.room_name || 'Ruang Ujian';
			const sessionNumber = hasSessions ? (p.session_number || 1) : 1;
			
			if (!acc[roomName]) acc[roomName] = {};
			if (!acc[roomName][sessionNumber]) acc[roomName][sessionNumber] = [];
			
			acc[roomName][sessionNumber].push(p);
			return acc;
		}, {});

		examDataList.push({
			exam,
			participantsGrouped,
			hasSessions,
			hasRooms,
			sessionMap,
			proctorOptions,
			defaultProctor1Id,
			defaultProctor2Id
		});
	}

	return {
		school,
		examType,
		isNomorPesertaMode,
		examDataList
	};
};
