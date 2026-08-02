import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load: PageServerLoad = async ({ platform, locals }) => {
	const db = getDB(platform);
	const exams = await db.prepare(`
		SELECT e.*, s.name as subject, (SELECT COUNT(*) FROM questions WHERE exam_id = e.id) as question_count
		FROM exams e 
		LEFT JOIN subjects s ON e.subject_id = s.id
		WHERE e.school_id = ? ORDER BY e.created_at DESC
	`).bind(locals.user!.school_id).all();
	return { exams: exams.results };
};

export const actions: Actions = {
	copyQuestions: async ({ request, locals, platform }) => {
		const db = getDB(platform);
		const data = await request.formData();
		const targetExamId = data.get('target_exam_id')?.toString();
		const questionIdsStr = data.get('question_ids')?.toString();
		
		if (!targetExamId || !questionIdsStr) return fail(400, { error: 'Data tidak lengkap' });
		
		const questionIds = questionIdsStr.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
		if (questionIds.length === 0) return fail(400, { error: 'Tidak ada soal yang dipilih' });

		const target = await db.prepare('SELECT id FROM exams WHERE id = ? AND school_id = ?').bind(targetExamId, locals.user!.school_id).first();
		if (!target) return fail(403, { error: 'Ujian tujuan tidak valid' });

		const maxQ = await db.prepare('SELECT MAX(question_number) as m FROM questions WHERE exam_id = ?').bind(targetExamId).first();
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
				targetExamId, q.type, q.question_text, nextNumber++, q.points, q.media_type, q.media_url, q.audio_max_plays, q.options_json, q.correct_answer_json
			);
		});

		try {
			await db.batch(stmts);
			return { success: true };
		} catch (e) {
			return fail(500, { error: 'Gagal menyalin soal' });
		}
	}
};
