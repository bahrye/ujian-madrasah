import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, platform, locals }) => {
	if (locals.user?.role !== 'siswa') throw redirect(302, '/');

	const db = getDB(platform);
	const typeId = parseInt(params.typeId, 10);
	const userId = locals.user.id;
	const schoolId = locals.user.school_id;

	if (isNaN(typeId)) throw redirect(302, '/siswa/papan-peringkat');

	// Ambil nama tipe ujian
	const typeQuery = await db.prepare(`
		SELECT name as type_name FROM exam_types WHERE id = ? AND school_id = ?
	`).bind(typeId, schoolId).first<{ type_name: string }>();

	if (!typeQuery) throw redirect(302, '/siswa/papan-peringkat');

	// Ambil semua ujian yang diikuti siswa ini khusus untuk tipe ujian tersebut
	const examsQuery = await db.prepare(`
		SELECT 
			e.id,
			e.title,
			s.name as subject,
			et.name as type_name,
			e.exam_type_id
		FROM exams e
		JOIN exam_participants ep ON e.id = ep.exam_id
		LEFT JOIN subjects s ON e.subject_id = s.id
		JOIN exam_types et ON e.exam_type_id = et.id
		WHERE ep.student_id = ? AND e.school_id = ? AND e.is_active = 1 AND e.exam_type_id = ?
		ORDER BY e.created_at DESC
	`).bind(userId, schoolId, typeId).all<{ id: number; title: string; subject: string; type_name: string; exam_type_id: number }>();

	return {
		type_name: typeQuery.type_name,
		exams: examsQuery.results || []
	};
};
