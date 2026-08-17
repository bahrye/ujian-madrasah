// @ts-nocheck
import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { formatExamTitle } from '$lib/utils/exam';

export const load = async ({ platform, locals }: Parameters<PageServerLoad>[0]) => {
	const db = getDB(platform);
	const schoolId = locals.user?.school_id;

	const [examCount, questionCount, pendingGrading] = await Promise.all([
		db.prepare('SELECT COUNT(*) as c FROM exams e WHERE e.school_id = ? AND (e.created_by = ? OR EXISTS (SELECT 1 FROM exam_teachers et WHERE et.exam_id = e.id AND et.teacher_id = ?))').bind(schoolId, locals.user!.id, locals.user!.id).first<{ c: number }>(),
		db.prepare(`
			SELECT COUNT(*) as c FROM questions q
			JOIN exams e ON q.exam_id = e.id
			WHERE e.school_id = ? AND (e.created_by = ? OR EXISTS (SELECT 1 FROM exam_teachers et WHERE et.exam_id = e.id AND et.teacher_id = ?))
		`).bind(schoolId, locals.user!.id, locals.user!.id).first<{ c: number }>(),
		db.prepare(`SELECT COUNT(*) as c FROM student_answers sa
			JOIN questions q ON sa.question_id = q.id
			JOIN exams e ON q.exam_id = e.id
			WHERE q.type IN ('essay', 'isian_singkat') AND sa.score_given IS NULL 
			AND e.school_id = ? AND (e.created_by = ? OR EXISTS (SELECT 1 FROM exam_teachers et WHERE et.exam_id = e.id AND et.teacher_id = ?))
		`).bind(schoolId, locals.user!.id, locals.user!.id).first<{ c: number }>()
	]);

	const recentExamsRes = await db.prepare(`
		SELECT e.*, s.name as subject_name, et.code as exam_type_code, c.name as class_name, (SELECT COUNT(*) FROM questions WHERE exam_id = e.id) as question_count
		FROM exams e 
		LEFT JOIN subjects s ON e.subject_id = s.id
		LEFT JOIN exam_types et ON e.exam_type_id = et.id
		LEFT JOIN classes c ON e.class_id = c.id
		WHERE e.school_id = ? AND (e.created_by = ? OR EXISTS (SELECT 1 FROM exam_teachers et WHERE et.exam_id = e.id AND et.teacher_id = ?))
		ORDER BY e.created_at DESC LIMIT 5
	`).bind(schoolId, locals.user!.id, locals.user!.id).all<any>();

	const recentExams = (recentExamsRes.results || []).map((e: any) => ({
		...e,
		title: formatExamTitle({
			title: e.title,
			examTypeCode: e.exam_type_code,
			subjectName: e.subject_name,
			className: e.class_name
		})
	}));

	return {
		stats: {
			totalExams: examCount?.c ?? 0,
			totalQuestions: questionCount?.c ?? 0,
			pendingGrading: pendingGrading?.c ?? 0
		},
		recentExams
	};
};
