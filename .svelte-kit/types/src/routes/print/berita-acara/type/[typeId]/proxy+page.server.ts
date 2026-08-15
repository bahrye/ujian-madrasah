// @ts-nocheck
import type { PageServerLoad } from './$types';
import { getDB, ensureProctorRoleColumn, ensureExamTypeProctorsTable } from '$lib/server/db';
import { error } from '@sveltejs/kit';

export const load = async ({ platform, params, locals, url }: Parameters<PageServerLoad>[0]) => {
	const db = getDB(platform);
	await ensureProctorRoleColumn(db);
	await ensureExamTypeProctorsTable(db);

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
		SELECT e.*, s.name as subject_name, et.name as exam_type_name,
		       et.start_time as exam_type_start_time, et.end_time as exam_type_end_time
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

	// Fetch Proktor & Panitia assigned to Exam Type once
	const typeProctorsRes = await db.prepare(`
		SELECT DISTINCT u.id, u.name, u.nip, u.role, COALESCE(etp.proctor_role, 'pt') as proctor_role
		FROM exam_type_proctors etp
		JOIN users u ON etp.proctor_id = u.id
		WHERE etp.exam_type_id = ?
		ORDER BY etp.id ASC
	`).bind(typeId).all();
	const typeProctors = (typeProctorsRes.results || []) as any[];

	// Fetch all teachers/proctors/admins in school
	const schoolTeachersRes = await db.prepare(`
		SELECT id, name, nip, role
		FROM users
		WHERE school_id = ? AND role IN ('guru', 'pengawas', 'admin') AND is_active = 1
		ORDER BY name ASC
	`).bind(locals.user!.school_id).all();
	const schoolTeachers = (schoolTeachersRes.results || []) as any[];

	const examDataList: any[] = [];

	for (const exam of examsList) {
		const examId = exam.id;

		let filterClause = '';
		const pParams: any[] = [examId];
		if (!isNaN(classId)) {
			filterClause = ` AND u.class_id = ?`;
			pParams.push(classId);
		}

		const participantsGroupedRaw = await db.prepare(`
			SELECT r.name as room_name, u.session_number, COUNT(p.id) as count
			FROM exam_participants p
			JOIN users u ON p.student_id = u.id
			LEFT JOIN exam_rooms r ON p.room_id = r.id
			WHERE p.exam_id = ? ${filterClause}
			GROUP BY r.id, r.name, u.session_number
			ORDER BY r.name, u.session_number
		`).bind(...pParams).all();

		const sessionsCount = await db.prepare('SELECT COUNT(*) as count FROM exam_sessions WHERE exam_id = ?').bind(examId).first<{count: number}>();
		const hasSessions = (sessionsCount?.count || 0) > 0;

		const roomsCount = await db.prepare('SELECT COUNT(*) as count FROM exam_rooms WHERE exam_id = ?').bind(examId).first<{count: number}>();
		const hasRooms = (roomsCount?.count || 0) > 0;

		const participantsGrouped = participantsGroupedRaw.results.reduce<Record<string, Record<number, number>>>((acc, row: any) => {
			const roomName = row.room_name || 'Ruang Ujian';
			const sessionNumber = hasSessions ? (row.session_number || 1) : 1;
			if (!acc[roomName]) acc[roomName] = {};
			acc[roomName][sessionNumber] = (acc[roomName][sessionNumber] || 0) + row.count;
			return acc;
		}, {});

		const sessionRecords = await db.prepare('SELECT * FROM exam_sessions WHERE exam_id = ?').bind(examId).all();
		const sessionMap: Record<number, { start_time: string | null; end_time: string | null }> = {};
		if (sessionRecords.results) {
			for (const s of sessionRecords.results as any[]) {
				sessionMap[s.session_number] = s;
			}
		}

		const assignedProctorsRes = await db.prepare(`
			SELECT DISTINCT u.id, u.name, u.nip, u.role, COALESCE(ep.proctor_role, 'p1') as proctor_role
			FROM exam_proctors ep
			JOIN users u ON ep.proctor_id = u.id
			WHERE ep.exam_id = ?
			ORDER BY ep.id ASC
		`).bind(examId).all();
		const assignedProctors = (assignedProctorsRes.results || []) as any[];

		const assignedIds = new Set([...assignedProctors.map(p => p.id), ...typeProctors.map(p => p.id)]);
		const proctorOptions = [
			...assignedProctors,
			...typeProctors,
			...schoolTeachers.filter(t => !assignedIds.has(t.id))
		];

		const p1Obj = assignedProctors.find(p => p.proctor_role === 'p1' || p.proctor_role === 'Pengawas 1');
		const p2Obj = assignedProctors.find(p => p.proctor_role === 'p2' || p.proctor_role === 'Pengawas 2');
		const ptObj = typeProctors.find(p => p.proctor_role === 'pt' || p.proctor_role === 'Proktor / Teknisi')
			|| assignedProctors.find(p => p.proctor_role === 'pt' || p.proctor_role === 'Proktor / Teknisi');
		const cmObj = typeProctors.find(p => p.proctor_role === 'cm' || p.proctor_role === 'Panitia Ujian')
			|| assignedProctors.find(p => p.proctor_role === 'cm' || p.proctor_role === 'Panitia Ujian');

		const defaultProctor1Id = p1Obj?.id || assignedProctors[0]?.id || proctorOptions[0]?.id || '';
		const defaultProctor2Id = p2Obj?.id || (assignedProctors.length > 1 && assignedProctors[1]?.id !== defaultProctor1Id ? assignedProctors[1]?.id : '');
		const defaultProctorTechId = ptObj?.id || '';
		const defaultCommitteeId = cmObj?.id || '';

		examDataList.push({
			exam,
			participantsGrouped,
			hasSessions,
			hasRooms,
			sessionMap,
			proctorOptions,
			defaultProctor1Id,
			defaultProctor2Id,
			defaultProctorTechId,
			defaultCommitteeId
		});
	}

	return {
		school,
		examType,
		isNomorPesertaMode,
		examDataList
	};
};
