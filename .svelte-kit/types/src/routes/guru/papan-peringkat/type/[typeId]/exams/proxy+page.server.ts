// @ts-nocheck
import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import { formatExamTitle } from '$lib/utils/exam';

export const load = async ({ params, platform, locals }: Parameters<PageServerLoad>[0]) => {
	if (locals.user?.role !== 'guru') throw redirect(302, '/');

	const db = getDB(platform);
	const typeId = parseInt(params.typeId, 10);
	const schoolId = locals.user.school_id;
	const userId = locals.user.id;

	if (isNaN(typeId)) throw redirect(302, '/guru/papan-peringkat');

	const typeQuery = await db.prepare(`
		SELECT name as type_name FROM exam_types WHERE id = ? AND school_id = ?
	`).bind(typeId, schoolId).first<{ type_name: string }>();

	if (!typeQuery) throw redirect(302, '/guru/papan-peringkat');

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
		WHERE e.school_id = ? AND e.is_active = 1 AND e.exam_type_id = ?
		AND (e.created_by = ? OR EXISTS (SELECT 1 FROM exam_teachers teacher_join WHERE teacher_join.exam_id = e.id AND teacher_join.teacher_id = ?))
		ORDER BY e.created_at DESC
	`).bind(schoolId, typeId, userId, userId).all<any>();

	const exams = (examsQuery.results || []).map((e: any) => ({
		...e,
		title: formatExamTitle({
			title: e.title,
			examTypeCode: e.exam_type_code,
			subjectName: e.subject_name,
			className: e.class_name
		})
	}));

	return {
		type_name: typeQuery.type_name,
		exams
	};
};
