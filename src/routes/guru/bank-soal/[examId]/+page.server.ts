import { fail, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { deleteFromCloudinary } from '$lib/server/cloudinary';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async ({ platform, params, locals }) => {
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

export const actions: Actions = {
	create: async ({ request, platform, params, locals }) => {
		const db = getDB(platform);
		const exam = await db.prepare('SELECT created_by FROM exams WHERE id = ? AND school_id = ?').bind(params.examId, locals.user!.school_id).first();
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
		} else if (type === 'pilihan_ganda_kompleks') {
			const opts = [];
			const corrects = [];
			for (let i = 0; i < 5; i++) {
				const opt = form.get(`option_${i}`)?.toString().trim();
				if (opt) {
					opts.push(opt);
					if (form.get(`correct_answer_${i}`)) {
						corrects.push(String.fromCharCode(65 + i));
					}
				}
			}
			optionsJson = JSON.stringify(opts);
			correctAnswerJson = JSON.stringify(corrects);
		} else if (type === 'benar_salah') {
			optionsJson = JSON.stringify(['Benar', 'Salah']);
			correctAnswerJson = JSON.stringify(form.get('correct_answer')?.toString() || 'Benar');
		} else if (type === 'isian_singkat' || type === 'essay') {
			correctAnswerJson = JSON.stringify(form.get('correct_answer')?.toString().trim() || '');
		} else if (type === 'menjodohkan') {
			const leftItems = [];
			const rightItems = [];
			for (let i = 0; i < 20; i++) {
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

	edit: async ({ request, platform, params, locals }) => {
		const db = getDB(platform);
		const exam = await db.prepare('SELECT created_by FROM exams WHERE id = ? AND school_id = ?').bind(params.examId, locals.user!.school_id).first();
		const isTeacher = await db.prepare('SELECT 1 FROM exam_teachers WHERE exam_id = ? AND teacher_id = ?').bind(params.examId, locals.user!.id).first();
		if (!exam || (exam.created_by !== locals.user!.id && !isTeacher)) {
			return fail(403, { error: 'Anda tidak memiliki akses ke ujian ini.' });
		}

		const form = await request.formData();
		const id = form.get('id')?.toString();
		const type = form.get('type')?.toString();
		const questionText = form.get('question_text')?.toString().trim();
		const points = parseInt(form.get('points')?.toString() || '1');
		const mediaType = form.get('media_type')?.toString() || null;
		const mediaUrl = form.get('media_url')?.toString().trim() || null;

		if (!id || !type || !questionText) return fail(400, { error: 'ID, tipe, dan teks soal wajib diisi.' });

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
		} else if (type === 'pilihan_ganda_kompleks') {
			const opts = [];
			const corrects = [];
			for (let i = 0; i < 5; i++) {
				const opt = form.get(`option_${i}`)?.toString().trim();
				if (opt) {
					opts.push(opt);
					if (form.get(`correct_answer_${i}`)) {
						corrects.push(String.fromCharCode(65 + i));
					}
				}
			}
			optionsJson = JSON.stringify(opts);
			correctAnswerJson = JSON.stringify(corrects);
		} else if (type === 'benar_salah') {
			optionsJson = JSON.stringify(['Benar', 'Salah']);
			correctAnswerJson = JSON.stringify(form.get('correct_answer')?.toString() || 'Benar');
		} else if (type === 'isian_singkat' || type === 'essay') {
			correctAnswerJson = JSON.stringify(form.get('correct_answer')?.toString().trim() || '');
		} else if (type === 'menjodohkan') {
			const leftItems = [];
			const rightItems = [];
			for (let i = 0; i < 20; i++) {
				const l = form.get(`left_${i}`)?.toString().trim();
				const r = form.get(`right_${i}`)?.toString().trim();
				if (l && r) {
					leftItems.push(l);
					rightItems.push(r);
				}
			}
			optionsJson = JSON.stringify({ left: leftItems, right: rightItems });
			
			const prevMap = await db.prepare('SELECT correct_answer_json FROM questions WHERE id = ?').bind(id).first<{correct_answer_json: string}>();
			if (prevMap && prevMap.correct_answer_json) {
				correctAnswerJson = prevMap.correct_answer_json; 
			} else {
				const mapping: Record<string, string> = {};
				leftItems.forEach((_, i) => { mapping[String(i)] = String(i); });
				correctAnswerJson = JSON.stringify(mapping);
			}
		}

		// Delete old media from Cloudinary if it changed
		const prevMedia = await db.prepare('SELECT media_url FROM questions WHERE id = ?').bind(id).first<{media_url: string}>();
		if (prevMedia && prevMedia.media_url && prevMedia.media_url !== mediaUrl && prevMedia.media_url.includes('res.cloudinary.com')) {
			await deleteFromCloudinary(prevMedia.media_url, env);
		}

		await db.prepare(`UPDATE questions SET 
			question_text = ?, points = ?, media_type = ?, media_url = ?, 
			options_json = ?, correct_answer_json = ? 
			WHERE id = ?`)
			.bind(questionText, points, mediaType === 'none' ? null : mediaType, mediaUrl, optionsJson, correctAnswerJson, id)
			.run();

		return { success: 'Soal berhasil diubah.' };
	},

	delete: async ({ request, platform, params, locals }) => {
		const db = getDB(platform);
		const exam = await db.prepare('SELECT created_by FROM exams WHERE id = ? AND school_id = ?').bind(params.examId, locals.user!.school_id).first();
		const isTeacher = await db.prepare('SELECT 1 FROM exam_teachers WHERE exam_id = ? AND teacher_id = ?').bind(params.examId, locals.user!.id).first();
		if (!exam || (exam.created_by !== locals.user!.id && !isTeacher)) {
			return fail(403, { error: 'Anda tidak memiliki akses ke ujian ini.' });
		}

		const form = await request.formData();
		const id = form.get('id')?.toString();
		if (!id) return fail(400, { error: 'ID tidak valid.' });

		// Delete media from Cloudinary if it exists
		const q = await db.prepare('SELECT media_url FROM questions WHERE id = ?').bind(id).first<{media_url: string}>();
		if (q && q.media_url && q.media_url.includes('res.cloudinary.com')) {
			await deleteFromCloudinary(q.media_url, env);
		}

		await db.prepare('DELETE FROM questions WHERE id = ?').bind(id).run();
		return { success: 'Soal berhasil dihapus.' };
	},

	importExcel: async ({ request, platform, params, locals }) => {
		const db = getDB(platform);
		const exam = await db.prepare('SELECT created_by FROM exams WHERE id = ? AND school_id = ?').bind(params.examId, locals.user!.school_id).first();
		const isTeacher = await db.prepare('SELECT 1 FROM exam_teachers WHERE exam_id = ? AND teacher_id = ?').bind(params.examId, locals.user!.id).first();
		if (!exam || (exam.created_by !== locals.user!.id && !isTeacher)) {
			return fail(403, { error: 'Anda tidak memiliki akses ke ujian ini.' });
		}

		const form = await request.formData();
		const questionsJson = form.get('questions_json')?.toString();
		if (!questionsJson) return fail(400, { error: 'Data soal tidak valid.' });

		let parsedQuestions: any[] = [];
		try {
			parsedQuestions = JSON.parse(questionsJson);
		} catch (e) {
			return fail(400, { error: 'Format data soal tidak valid.' });
		}

		if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
			return fail(400, { error: 'Tidak ada soal yang ditemukan.' });
		}

		const last = await db.prepare('SELECT MAX(question_number) as max_num FROM questions WHERE exam_id = ?').bind(params.examId).first<{ max_num: number | null }>();
		let nextNum = (last?.max_num ?? 0) + 1;

		const statements = [];
		const stmt = db.prepare(`INSERT INTO questions (exam_id, type, question_text, question_number, points, options_json, correct_answer_json) VALUES (?, ?, ?, ?, ?, ?, ?)`);

		for (const q of parsedQuestions) {
			statements.push(
				stmt.bind(params.examId, q.type, q.question_text, nextNum, q.points || 1, q.options_json || null, q.correct_answer_json || null)
			);
			nextNum++;
		}

		try {
			await db.batch(statements);
		} catch (e: any) {
			console.error('Import Excel Error:', e);
			return fail(500, { error: 'Gagal menyimpan soal ke database: ' + (e.message || String(e)) });
		}

		return { success: `Berhasil mengimpor ${parsedQuestions.length} soal.` };
	}
};
