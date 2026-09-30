import { json } from '@sveltejs/kit';
import { getDB } from '$lib/server/db';

export const GET = async ({ params, platform, locals, url }: any) => {
	if (!locals.user || !['admin', 'superadmin', 'guru', 'panitia'].includes(locals.user.role)) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const db = getDB(platform);
	const typeIdStr = params.typeId;
	const typeId = parseInt(typeIdStr, 10);
	if (isNaN(typeId)) {
		return json({ error: 'ID Tipe Ujian tidak valid' }, { status: 400 });
	}

	const classIdStr = url.searchParams.get('class_id');
	const classId = parseInt(classIdStr || '', 10);

	// 1. Get Exam Type
	const examType = await db.prepare('SELECT * FROM exam_types WHERE id = ? AND school_id = ?')
		.bind(typeId, locals.user.school_id).first();
	if (!examType) {
		return json({ error: 'Tipe Ujian tidak ditemukan' }, { status: 404 });
	}

	// 2. Get Class Info (if classId provided)
	let classData = null;
	if (!isNaN(classId)) {
		classData = await db.prepare('SELECT * FROM classes WHERE id = ? AND school_id = ?')
			.bind(classId, locals.user.school_id).first();
	}

	// 3. Get Exams for this type
	let examsQuery = `
		SELECT e.*, s.name as subject_name
		FROM exams e
		LEFT JOIN subjects s ON e.subject_id = s.id
		WHERE e.exam_type_id = ? AND e.school_id = ?
	`;
	const examsParams: any[] = [typeId, locals.user.school_id];

	if (!isNaN(classId)) {
		examsQuery += ` AND (e.class_id = ? OR e.class_id IS NULL)`;
		examsParams.push(classId);
	}

	examsQuery += ` ORDER BY e.created_at ASC`;
	const examsRes = await db.prepare(examsQuery).bind(...examsParams).all();
	const exams = (examsRes.results || []) as any[];

	// 4. Get Students for this class/school
	let studentsQuery = `
		SELECT u.id, u.name as student_name, u.nisn, u.nomor_peserta, c.name as class_name
		FROM users u
		JOIN classes c ON u.class_id = c.id
		JOIN exam_type_classes etc ON etc.class_id = u.class_id
		WHERE u.school_id = ? AND u.role = 'siswa' AND u.is_active = 1 AND etc.exam_type_id = ?
	`;
	const studentsParams: any[] = [locals.user.school_id, typeId];

	if (!isNaN(classId)) {
		studentsQuery += ` AND u.class_id = ?`;
		studentsParams.push(classId);
	}

	studentsQuery += ` ORDER BY c.name ASC, u.name ASC`;
	const studentsRes = await db.prepare(studentsQuery).bind(...studentsParams).all();
	const students = (studentsRes.results || []) as any[];

	// 5. Ambil semua percobaan & nilai untuk seluruh ujian dalam 1 query batch (hemat roundtrip & CPU Neon)
	const examDetails: any[] = [];

	if (exams.length > 0) {
		const examIds = exams.map((e) => e.id);
		const placeholders = examIds.map(() => '?').join(',');

		const allAttemptsRes = await db.prepare(`
			SELECT 
				epart.exam_id,
				epart.student_id,
				sa.id as attempt_id,
				sa.score,
				sa.status,
				sa.submit_time
			FROM exam_participants epart
			LEFT JOIN student_attempts sa ON sa.student_id = epart.student_id AND sa.exam_id = epart.exam_id
			WHERE epart.exam_id IN (${placeholders})
		`).bind(...examIds).all();

		const attemptsByExam: Record<number, Record<number, any>> = {};
		for (const att of (allAttemptsRes.results || []) as any[]) {
			if (!attemptsByExam[att.exam_id]) {
				attemptsByExam[att.exam_id] = {};
			}
			attemptsByExam[att.exam_id][att.student_id] = att;
		}

		for (const exam of exams) {
			examDetails.push({
				exam,
				attemptsMap: attemptsByExam[exam.id] || {}
			});
		}
	}

	return json({
		examType,
		classData,
		students,
		exams: examDetails
	});
};
