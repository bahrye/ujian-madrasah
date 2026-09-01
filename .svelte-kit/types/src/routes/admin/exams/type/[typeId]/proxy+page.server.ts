// @ts-nocheck
import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load = async ({ params, platform, locals }: Parameters<PageServerLoad>[0]) => {
	const db = getDB(platform);
	const typeIdStr = params.typeId;
	const typeId = parseInt(typeIdStr, 10);
	if (isNaN(typeId)) throw new Error('ID Tipe Ujian tidak valid');

	const examType = await db.prepare('SELECT * FROM exam_types WHERE id = ? AND school_id = ?')
		.bind(typeId, locals.user!.school_id).first() as any;

	if (!examType) {
		throw new Error('Tipe Ujian tidak ditemukan');
	}

	const classes = await db.prepare(`
		SELECT c.id, c.name,
			(SELECT COUNT(*) FROM users WHERE class_id = c.id AND role = 'siswa' AND is_active = 1) as student_count,
			(SELECT COUNT(*) FROM exams e 
				WHERE e.exam_type_id = ? AND e.school_id = ? 
				AND (
					e.class_id = c.id 
					OR (e.class_id IS NULL AND EXISTS (
						SELECT 1 FROM exam_participants ep 
						JOIN users u ON ep.student_id = u.id 
						WHERE ep.exam_id = e.id AND u.class_id = c.id
					))
				)
			) as exam_count
		FROM classes c
		INNER JOIN exam_type_classes etc ON etc.class_id = c.id
		WHERE etc.exam_type_id = ? AND c.school_id = ?
		ORDER BY c.name
	`).bind(typeId, locals.user!.school_id, typeId, locals.user!.school_id).all();

	return { examType, classes: classes.results };
};
