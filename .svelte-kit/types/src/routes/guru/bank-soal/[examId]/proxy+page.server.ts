// @ts-nocheck
import { fail, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load = async ({ platform, params, locals }: Parameters<PageServerLoad>[0]) => {
	const db = getDB(platform);
	const exam = await db.prepare('SELECT * FROM exams WHERE id = ? AND school_id = ?').bind(params.examId, locals.user!.school_id).first();
	if (!exam) throw error(404, 'Ujian tidak ditemukan');

	const isTeacher = await db.prepare('SELECT 1 FROM exam_teachers WHERE exam_id = ? AND teacher_id = ?').bind(params.examId, locals.user!.id).first();
	if (exam.created_by !== locals.user!.id && !isTeacher) {
		throw error(403, 'Anda tidak memiliki akses ke ujian ini.');
	}

	const questions = await db.prepare('SELECT * FROM questions WHERE exam_id = ? ORDER BY question_number')
		.bind(params.examId).all();

	return { exam, questions: questions.results };
};

export const actions = {
	create: async ({ request, platform, params, locals }: import('./$types').RequestEvent) => {
		const db = getDB(platform);
		const exam = await db.prepare('SELECT created_by FROM exams WHERE id = ?').bind(params.examId).first();
		const isTeacher = await db.prepare('SELECT 1 FROM exam_teachers WHERE exam_id = ? AND teacher_id = ?').bind(params.examId, locals.user!.id).first();
		if (!exam || (exam.created_by !== locals.user!.id && !isTeacher)) {
			return fail(403, { error: 'Anda tidak memiliki akses ke ujian ini.' });
		}

		const form = await request.formData();

		const type = form.get('type')?.toString();
		const questionText = form.get('question_text')?.toString().trim();
		const points = parseInt(form.get('points')?.toString() || '1');
		const mediaType = form.get('media_type')?.toString() || null;
		const mediaUrl = form.get('media_url')?.toString().trim() || null;
		const audioMaxPlays = parseInt(form.get('audio_max_plays')?.toString() || '3');

		if (!type || !questionText) return fail(400, { error: 'Tipe dan teks soal wajib diisi.' });

		// Get next question number
		const last = await db.prepare('SELECT MAX(question_number) as max_num FROM questions WHERE exam_id = ?')
			.bind(params.examId).first<{ max_num: number | null }>();
		const nextNum = (last?.max_num ?? 0) + 1;

		// Build options and correct answer based on type
		let optionsJson: string | null = null;
		let correctAnswerJson: string | null = null;

		if (type === 'pilihan_ganda') {
			const opts = [];
			for (let i = 0; i < 5; i++) {
				const opt = form.get(`option_${i}`)?.toString().trim();
				if (opt) opts.push(opt);
			}
			optionsJson = JSON.stringify(opts);
			correctAnswerJson = JSON.stringify(form.get('correct_answer')?.toString() || 'A');
		} else if (type === 'benar_salah') {
			optionsJson = JSON.stringify(['Benar', 'Salah']);
			correctAnswerJson = JSON.stringify(form.get('correct_answer')?.toString() || 'Benar');
		} else if (type === 'isian_singkat') {
			correctAnswerJson = JSON.stringify(form.get('correct_answer')?.toString().trim() || '');
		} else if (type === 'menjodohkan') {
			const leftItems = [];
			const rightItems = [];
			for (let i = 0; i < 6; i++) {
				const l = form.get(`left_${i}`)?.toString().trim();
				const r = form.get(`right_${i}`)?.toString().trim();
				if (l && r) {
					leftItems.push(l);
					rightItems.push(r);
				}
			}
			optionsJson = JSON.stringify({ left: leftItems, right: rightItems });
			// Correct mapping: index i left maps to index i right
			const mapping: Record<string, string> = {};
			leftItems.forEach((_, i) => { mapping[String(i)] = String(i); });
			correctAnswerJson = JSON.stringify(mapping);
		}
		// essay: no options or correct answer

		await db.prepare(`INSERT INTO questions (exam_id, type, question_text, question_number, points,
			media_type, media_url, audio_max_plays, options_json, correct_answer_json)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
			.bind(params.examId, type, questionText, nextNum, points,
				mediaType === 'none' ? null : mediaType, mediaUrl, audioMaxPlays, optionsJson, correctAnswerJson)
			.run();

		return { success: 'Soal berhasil ditambahkan.' };
	},

	delete: async ({ request, platform, params, locals }: import('./$types').RequestEvent) => {
		const db = getDB(platform);
		const exam = await db.prepare('SELECT created_by FROM exams WHERE id = ?').bind(params.examId).first();
		const isTeacher = await db.prepare('SELECT 1 FROM exam_teachers WHERE exam_id = ? AND teacher_id = ?').bind(params.examId, locals.user!.id).first();
		if (!exam || (exam.created_by !== locals.user!.id && !isTeacher)) {
			return fail(403, { error: 'Anda tidak memiliki akses ke ujian ini.' });
		}

		const form = await request.formData();
		const id = form.get('id')?.toString();
		if (!id) return fail(400, { error: 'ID tidak valid.' });
		await db.prepare('DELETE FROM questions WHERE id = ?').bind(id).run();
		return { success: 'Soal berhasil dihapus.' };
	}
};
;null as any as Actions;