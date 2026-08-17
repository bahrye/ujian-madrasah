// @ts-nocheck
import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import { formatExamTitle } from '$lib/utils/exam';

export const load = async ({ platform, locals }: Parameters<PageServerLoad>[0]) => {
	if (locals.user?.role !== 'admin' && locals.user?.role !== 'panitia') throw redirect(302, '/');

	const db = getDB(platform);
	const schoolId = locals.user.school_id;

	// Ambil semua ujian aktif di sekolah
	const examsQuery = await db.prepare(`
		SELECT 
			e.id,
			e.title,
			s.name as subject,
			s.name as subject_name,
			et.name as type_name,
			et.code as exam_type_code,
			c.name as class_name,
			e.exam_type_id
		FROM exams e
		LEFT JOIN subjects s ON e.subject_id = s.id
		LEFT JOIN classes c ON e.class_id = c.id
		LEFT JOIN exam_types et ON e.exam_type_id = et.id
		WHERE e.school_id = ? AND e.is_active = 1
		ORDER BY e.created_at DESC
	`).bind(schoolId).all<any>();

	const exams = (examsQuery.results || []).map((e: any) => ({
		...e,
		title: formatExamTitle({
			title: e.title,
			examTypeCode: e.exam_type_code,
			subjectName: e.subject_name,
			className: e.class_name
		})
	}));

	// Ambil semua tipe ujian aktif di sekolah
	const examTypesQuery = await db.prepare(`
		SELECT id, name as type_name, code
		FROM exam_types
		WHERE school_id = ? AND is_active = 1
		ORDER BY name ASC
	`).bind(schoolId).all<{ id: number; type_name: string; code: string }>();

	return {
		exams,
		examTypes: examTypesQuery.results || []
	};
};
