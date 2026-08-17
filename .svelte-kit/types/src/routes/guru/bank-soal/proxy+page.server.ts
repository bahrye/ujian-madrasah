// @ts-nocheck
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

import { formatExamTitle } from '$lib/utils/exam';

export const load = async ({ platform, locals }: Parameters<PageServerLoad>[0]) => {
	const db = getDB(platform);
	const examsRes = await db.prepare(`
		SELECT e.*, s.name as subject_name, et.code as exam_type_code, c.name as class_name, (SELECT COUNT(*) FROM questions WHERE exam_id = e.id) as question_count
		FROM exams e 
		LEFT JOIN subjects s ON e.subject_id = s.id
		LEFT JOIN exam_types et ON e.exam_type_id = et.id
		LEFT JOIN classes c ON e.class_id = c.id
		WHERE e.school_id = ? 
		  AND (e.created_by = ? OR EXISTS (SELECT 1 FROM exam_teachers et WHERE et.exam_id = e.id AND et.teacher_id = ?))
		ORDER BY e.created_at DESC
	`).bind(locals.user!.school_id, locals.user!.id, locals.user!.id).all<any>();

	const exams = (examsRes.results || []).map((e: any) => ({
		...e,
		title: formatExamTitle({
			title: e.title,
			examTypeCode: e.exam_type_code,
			subjectName: e.subject_name,
			className: e.class_name
		})
	}));

	return { exams };
};

export const actions = {
	copyQuestions: async ({ request, locals, platform }: import('./$types').RequestEvent) => {
		const db = getDB(platform);
		const data = await request.formData();
		const targetExamIdStr = data.get('target_exam_id')?.toString();
		const questionIdsStr = data.get('question_ids')?.toString();
		const parsedTargetExamId = parseInt(targetExamIdStr || '', 10);
		
		if (isNaN(parsedTargetExamId) || !questionIdsStr) return fail(400, { error: 'Data tidak lengkap' });
		
		const questionIds = questionIdsStr.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
		if (questionIds.length === 0) return fail(400, { error: 'Tidak ada soal yang dipilih' });

		// Verify target exam is accessible by guru
		const target = await db.prepare(`
			SELECT id FROM exams 
			WHERE id = ? AND school_id = ? 
			AND (created_by = ? OR EXISTS (SELECT 1 FROM exam_teachers et WHERE et.exam_id = exams.id AND et.teacher_id = ?))
		`).bind(parsedTargetExamId, locals.user!.school_id, locals.user!.id, locals.user!.id).first();
		
		if (!target) return fail(403, { error: 'Ujian tujuan tidak valid atau tidak memiliki akses' });

		const maxQ = await db.prepare('SELECT MAX(question_number) as m FROM questions WHERE exam_id = ?').bind(parsedTargetExamId).first();
		let nextNumber = ((maxQ?.m as number) || 0) + 1;

		const placeholders = questionIds.map(() => '?').join(',');
		const questionsToCopy = await db.prepare(`
			SELECT q.type, q.question_text, q.points, q.media_type, q.media_url, q.audio_max_plays, q.options_json, q.correct_answer_json 
			FROM questions q
			JOIN exams e ON q.exam_id = e.id
			WHERE q.id IN (${placeholders}) AND e.school_id = ?
		`).bind(...questionIds, locals.user!.school_id).all();

		if (!questionsToCopy.results || questionsToCopy.results.length === 0) {
			return fail(400, { error: 'Soal tidak ditemukan atau tidak valid' });
		}

		const stmts = questionsToCopy.results.map((q: any) => {
			return db.prepare(`
				INSERT INTO questions (exam_id, type, question_text, question_number, points, media_type, media_url, audio_max_plays, options_json, correct_answer_json)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			`).bind(
				parsedTargetExamId, q.type, q.question_text, nextNumber++, q.points, q.media_type, q.media_url, q.audio_max_plays, q.options_json, q.correct_answer_json
			);
		});

		try {
			await db.batch(stmts);
			return { success: true };
		} catch (e: any) {
			console.error(e);
			return fail(500, { error: e.message || 'Gagal menyalin soal' });
		}
	}
};
;null as any as Actions;