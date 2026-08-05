// @ts-nocheck
import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';

export const load = async ({ platform, locals }: Parameters<PageServerLoad>[0]) => {
	if (locals.user?.role !== 'admin') throw redirect(302, '/');

	const db = getDB(platform);
	const schoolId = locals.user.school_id;

	// Ambil semua ujian aktif di sekolah
	const examsQuery = await db.prepare(`
		SELECT 
			e.id,
			e.title,
			s.name as subject,
			et.name as type_name,
			e.exam_type_id
		FROM exams e
		LEFT JOIN subjects s ON e.subject_id = s.id
		LEFT JOIN exam_types et ON e.exam_type_id = et.id
		WHERE e.school_id = ? AND e.is_active = 1
		ORDER BY e.created_at DESC
	`).bind(schoolId).all<{ id: number; title: string; subject: string | null; type_name: string | null; exam_type_id: number | null }>();

	// Ambil semua tipe ujian aktif di sekolah
	const examTypesQuery = await db.prepare(`
		SELECT id, name as type_name, code
		FROM exam_types
		WHERE school_id = ? AND is_active = 1
		ORDER BY name ASC
	`).bind(schoolId).all<{ id: number; type_name: string; code: string }>();

	return {
		exams: examsQuery.results || [],
		examTypes: examTypesQuery.results || []
	};
};
