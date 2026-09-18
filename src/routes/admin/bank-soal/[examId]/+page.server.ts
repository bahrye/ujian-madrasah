import { fail, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { deleteFromCloudinary, deleteMediaForQuestionIds } from '$lib/server/cloudinary';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async ({ platform, params, locals }) => {
	const db = getDB(platform);
	const examIdStr = params.examId;
	const parsedExamId = parseInt(examIdStr, 10);
	if (isNaN(parsedExamId)) throw error(400, 'ID Ujian tidak valid');

	const exam = await db.prepare('SELECT * FROM exams WHERE id = ? AND school_id = ?').bind(parsedExamId, locals.user!.school_id).first();
	if (!exam) throw error(404, 'Ujian tidak ditemukan');

	const questions = await db.prepare(`
		SELECT q.*, (SELECT COUNT(*) FROM student_answers sa WHERE sa.question_id = q.id) as answers_count 
		FROM questions q 
		WHERE q.exam_id = ? 
		ORDER BY q.question_number
	`).bind(parsedExamId).all();

	return { exam, questions: questions.results };
};

export const actions: Actions = {
	create: async ({ request, platform, params, locals }) => {
		const db = getDB(platform);
		const examIdStr = params.examId;
		const parsedExamId = parseInt(examIdStr, 10);
		if (isNaN(parsedExamId)) return fail(400, { error: 'ID Ujian tidak valid' });

		const exam = await db.prepare('SELECT id FROM exams WHERE id = ? AND school_id = ?').bind(parsedExamId, locals.user!.school_id).first();
		if (!exam) return fail(403, { error: 'Anda tidak memiliki akses ke ujian ini.' });
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
			.bind(parsedExamId).first<{ max_num: number | null }>();
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
			const bsMode = form.get('bs_mode')?.toString() || 'single';
			if (bsMode === 'multi') {
				const statements: string[] = [];
				const correctMap: Record<string, string> = {};
				let idx = 0;
				for (let i = 0; i < 50; i++) {
					const stmt = form.get(`bs_statement_${i}`)?.toString().trim();
					if (stmt) {
						statements.push(stmt);
						correctMap[String(idx)] = form.get(`bs_correct_${i}`)?.toString() || 'Benar';
						idx++;
					}
				}
				if (statements.length > 0) {
					optionsJson = JSON.stringify({ statements });
					correctAnswerJson = JSON.stringify(correctMap);
				} else {
					const single = form.get('correct_answer')?.toString() || 'Benar';
					optionsJson = JSON.stringify(['Benar', 'Salah']);
					correctAnswerJson = JSON.stringify(single);
				}
			} else {
				const single = form.get('correct_answer')?.toString() || 'Benar';
				optionsJson = JSON.stringify(['Benar', 'Salah']);
				correctAnswerJson = JSON.stringify(single);
			}
		} else if (type === 'isian_singkat' || type === 'essay') {
			correctAnswerJson = JSON.stringify(form.get('correct_answer')?.toString().trim() || '');
		} else if (type === 'menjodohkan') {
			const leftItems: string[] = [];
			const rightItems: string[] = [];
			const mapping: Record<string, string> = {};

			for (let i = 0; i < 50; i++) {
				const l = form.get(`left_${i}`)?.toString().trim();
				if (l) {
					const leftIdx = leftItems.length;
					leftItems.push(l);
					const correctRight = form.get(`match_correct_${i}`)?.toString() || String(leftIdx);
					mapping[String(leftIdx)] = correctRight;
				}
			}

			for (let j = 0; j < 50; j++) {
				const r = form.get(`right_${j}`)?.toString().trim();
				if (r) {
					rightItems.push(r);
				}
			}

			optionsJson = JSON.stringify({ left: leftItems, right: rightItems });
			correctAnswerJson = JSON.stringify(mapping);
		}
		// essay: no options or correct answer

		try {
			await db.prepare(`INSERT INTO questions (exam_id, type, question_text, question_number, points,
				media_type, media_url, audio_max_plays, options_json, correct_answer_json)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
				.bind(parsedExamId, type, questionText, nextNum, points,
					mediaType === 'none' ? null : mediaType, mediaUrl, audioMaxPlays, optionsJson, correctAnswerJson)
				.run();

			return { success: 'Soal berhasil ditambahkan.' };
		} catch (e: any) {
			console.error(e);
			return fail(500, { error: e.message || 'Gagal menambahkan soal' });
		}
	},

	edit: async ({ request, platform, params, locals }) => {
		const db = getDB(platform);
		const examIdStr = params.examId;
		const parsedExamId = parseInt(examIdStr, 10);
		if (isNaN(parsedExamId)) return fail(400, { error: 'ID Ujian tidak valid' });

		const exam = await db.prepare('SELECT id FROM exams WHERE id = ? AND school_id = ?').bind(parsedExamId, locals.user!.school_id).first();
		if (!exam) return fail(403, { error: 'Anda tidak memiliki akses ke ujian ini.' });
		const form = await request.formData();

		const idStr = form.get('id')?.toString();
		const parsedId = parseInt(idStr || '', 10);
		const type = form.get('type')?.toString();
		const questionText = form.get('question_text')?.toString().trim();
		const points = parseInt(form.get('points')?.toString() || '1');
		const mediaType = form.get('media_type')?.toString() || null;
		const mediaUrl = form.get('media_url')?.toString().trim() || null;

		if (isNaN(parsedId) || !type || !questionText) return fail(400, { error: 'ID, tipe, dan teks soal wajib diisi.' });

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
			const bsMode = form.get('bs_mode')?.toString() || 'single';
			if (bsMode === 'multi') {
				const statements: string[] = [];
				const correctMap: Record<string, string> = {};
				let idx = 0;
				for (let i = 0; i < 50; i++) {
					const stmt = form.get(`bs_statement_${i}`)?.toString().trim();
					if (stmt) {
						statements.push(stmt);
						correctMap[String(idx)] = form.get(`bs_correct_${i}`)?.toString() || 'Benar';
						idx++;
					}
				}
				if (statements.length > 0) {
					optionsJson = JSON.stringify({ statements });
					correctAnswerJson = JSON.stringify(correctMap);
				} else {
					const single = form.get('correct_answer')?.toString() || 'Benar';
					optionsJson = JSON.stringify(['Benar', 'Salah']);
					correctAnswerJson = JSON.stringify(single);
				}
			} else {
				const single = form.get('correct_answer')?.toString() || 'Benar';
				optionsJson = JSON.stringify(['Benar', 'Salah']);
				correctAnswerJson = JSON.stringify(single);
			}
		} else if (type === 'isian_singkat' || type === 'essay') {
			correctAnswerJson = JSON.stringify(form.get('correct_answer')?.toString().trim() || '');
		} else if (type === 'menjodohkan') {
			const leftItems: string[] = [];
			const rightItems: string[] = [];
			const mapping: Record<string, string> = {};

			for (let i = 0; i < 50; i++) {
				const l = form.get(`left_${i}`)?.toString().trim();
				if (l) {
					const leftIdx = leftItems.length;
					leftItems.push(l);
					const correctRight = form.get(`match_correct_${i}`)?.toString() || String(leftIdx);
					mapping[String(leftIdx)] = correctRight;
				}
			}

			for (let j = 0; j < 50; j++) {
				const r = form.get(`right_${j}`)?.toString().trim();
				if (r) {
					rightItems.push(r);
				}
			}

			optionsJson = JSON.stringify({ left: leftItems, right: rightItems });
			correctAnswerJson = JSON.stringify(mapping);
		}

		try {
			// Delete old media from Cloudinary if it changed
			const prevMedia = await db.prepare('SELECT media_url FROM questions WHERE id = ?').bind(parsedId).first<{media_url: string}>();
			if (prevMedia && prevMedia.media_url && prevMedia.media_url !== mediaUrl && prevMedia.media_url.includes('res.cloudinary.com')) {
				await deleteFromCloudinary(prevMedia.media_url, env);
			}

			await db.prepare(`UPDATE questions SET 
				question_text = ?, points = ?, media_type = ?, media_url = ?, 
				options_json = ?, correct_answer_json = ? 
				WHERE id = ?`)
				.bind(questionText, points, mediaType === 'none' ? null : mediaType, mediaUrl, optionsJson, correctAnswerJson, parsedId)
				.run();

			return { success: 'Soal berhasil diubah.' };
		} catch (e: any) {
			console.error(e);
			return fail(500, { error: e.message || 'Gagal mengubah soal' });
		}
	},

	delete: async ({ request, platform, params, locals }) => {
		const db = getDB(platform);
		const examIdStr = params.examId;
		const parsedExamId = parseInt(examIdStr, 10);
		if (isNaN(parsedExamId)) return fail(400, { error: 'ID Ujian tidak valid' });

		const exam = await db.prepare('SELECT id FROM exams WHERE id = ? AND school_id = ?').bind(parsedExamId, locals.user!.school_id).first();
		if (!exam) return fail(403, { error: 'Anda tidak memiliki akses ke ujian ini.' });
		const form = await request.formData();
		const idStr = form.get('id')?.toString();
		const parsedId = parseInt(idStr || '', 10);
		if (isNaN(parsedId)) return fail(400, { error: 'ID tidak valid.' });

		try {
			const mergedEnv = { ...env, ...(platform?.env as any) };
			// Hapus seluruh media terkait soal dari Cloudinary & tabel uploaded_media
			await deleteMediaForQuestionIds(db, mergedEnv, [parsedId], locals.user?.school_id);

			// Hapus referensi jawaban siswa untuk mencegah error foreign key
			await db.prepare('DELETE FROM student_answers WHERE question_id = ?').bind(parsedId).run();

			await db.prepare('DELETE FROM questions WHERE id = ?').bind(parsedId).run();
			
			// Resequence remaining questions
			const remainingQuestions = await db.prepare('SELECT id FROM questions WHERE exam_id = ? ORDER BY question_number ASC, id ASC').bind(parsedExamId).all();
			if (remainingQuestions.results.length > 0) {
				const statements: any[] = [];
				const stmt = db.prepare('UPDATE questions SET question_number = ? WHERE id = ?');
				remainingQuestions.results.forEach((q, idx) => {
					statements.push(stmt.bind(idx + 1, q.id));
				});
				await db.batch(statements);
			}

			return { success: 'Soal berhasil dihapus.', deletedIds: [parsedId] };
		} catch (e: any) {
			console.error(e);
			return fail(500, { error: e.message || 'Gagal menghapus soal' });
		}
	},

	importExcel: async ({ request, platform, params, locals }) => {
		const db = getDB(platform);
		const examIdStr = params.examId;
		const parsedExamId = parseInt(examIdStr, 10);
		if (isNaN(parsedExamId)) return fail(400, { error: 'ID Ujian tidak valid' });

		const exam = await db.prepare('SELECT id FROM exams WHERE id = ? AND school_id = ?').bind(parsedExamId, locals.user!.school_id).first();
		if (!exam) return fail(403, { error: 'Anda tidak memiliki akses ke ujian ini.' });

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

		const last = await db.prepare('SELECT MAX(question_number) as max_num FROM questions WHERE exam_id = ?').bind(parsedExamId).first<{ max_num: number | null }>();
		let nextNum = (last?.max_num ?? 0) + 1;

		const statements = [];
		const stmt = db.prepare(`INSERT INTO questions (exam_id, type, question_text, question_number, points, options_json, correct_answer_json) VALUES (?, ?, ?, ?, ?, ?, ?)`);

		const cloudinaryRegex = /https:\/\/res\.cloudinary\.com\/[^"'\s>]+/g;
		const mediaUrlsToInsert = new Set<string>();

		for (const q of parsedQuestions) {
			statements.push(
				stmt.bind(parsedExamId, q.type, q.question_text, nextNum, q.points || 1, q.options_json || null, q.correct_answer_json || null)
			);
			nextNum++;
			
			if (q.question_text) {
				const matches = q.question_text.match(cloudinaryRegex);
				if (matches) matches.forEach((m: string) => mediaUrlsToInsert.add(m));
			}
			if (q.options_json) {
				const matches = q.options_json.match(cloudinaryRegex);
				if (matches) matches.forEach((m: string) => mediaUrlsToInsert.add(m));
			}
		}

		try {
			await db.batch(statements);
			
			if (mediaUrlsToInsert.size > 0) {
				const mediaStmt = db.prepare(`
					INSERT INTO uploaded_media (url, name, media_type, uploaded_by, school_id)
					VALUES (?, ?, ?, ?, ?)
				`);
				const mediaBatch = Array.from(mediaUrlsToInsert).map(url => 
					mediaStmt.bind(url, 'Gambar Import Word', 'image', locals.user!.id, locals.user!.school_id)
				);
				try {
					await db.batch(mediaBatch);
				} catch (e) {
					console.warn('Sebagian gambar mungkin sudah ada di media bank:', e);
				}
			}
		} catch (e: any) {
			console.error('Import Excel Error:', e);
			return fail(500, { error: 'Gagal menyimpan soal ke database: ' + (e.message || String(e)) });
		}

		return { success: `Berhasil mengimpor ${parsedQuestions.length} soal.` };
	},

	deleteBulk: async ({ request, platform, params, locals }) => {
		const db = getDB(platform);
		const examIdStr = params.examId;
		const parsedExamId = parseInt(examIdStr, 10);
		if (isNaN(parsedExamId)) return fail(400, { error: 'ID Ujian tidak valid' });

		const exam = await db.prepare('SELECT id FROM exams WHERE id = ? AND school_id = ?').bind(parsedExamId, locals.user!.school_id).first();
		if (!exam) return fail(403, { error: 'Anda tidak memiliki akses ke ujian ini.' });

		const form = await request.formData();
		const idsStr = form.get('ids')?.toString();
		if (!idsStr) return fail(400, { error: 'Tidak ada soal yang dipilih.' });

		try {
			const rawIds = JSON.parse(idsStr);
			if (!Array.isArray(rawIds) || rawIds.length === 0) return fail(400, { error: 'Daftar ID tidak valid.' });

			const numericIds = rawIds.map((id: any) => Number(id)).filter((id: number) => !isNaN(id) && id > 0);
			if (numericIds.length === 0) return fail(400, { error: 'Daftar ID tidak valid.' });

			// Filter ID yang benar-benar milik ujian ini
			const placeholders = numericIds.map(() => '?').join(',');
			const validQuestions = await db.prepare(`
				SELECT q.id
				FROM questions q
				WHERE q.id IN (${placeholders}) AND q.exam_id = ?
			`).bind(...numericIds, parsedExamId).all<{ id: number }>();

			if (validQuestions.results.length === 0) {
				return fail(400, { error: 'Tidak ada soal valid yang dapat dihapus.' });
			}

			const validIds = validQuestions.results.map(q => Number(q.id));
			const validPlaceholders = validIds.map(() => '?').join(',');

			const mergedEnv = { ...env, ...(platform?.env as any) };
			// Hapus seluruh media terkait soal dari Cloudinary & tabel uploaded_media
			await deleteMediaForQuestionIds(db, mergedEnv, validIds, locals.user?.school_id);

			await db.batch([
				db.prepare(`DELETE FROM student_answers WHERE question_id IN (${validPlaceholders})`).bind(...validIds),
				db.prepare(`DELETE FROM questions WHERE id IN (${validPlaceholders}) AND exam_id = ?`).bind(...validIds, parsedExamId)
			]);
			
			// Resequence remaining questions
			const remainingQuestions = await db.prepare('SELECT id FROM questions WHERE exam_id = ? ORDER BY question_number ASC, id ASC').bind(parsedExamId).all();
			if (remainingQuestions.results.length > 0) {
				const statements: any[] = [];
				const stmt = db.prepare('UPDATE questions SET question_number = ? WHERE id = ?');
				remainingQuestions.results.forEach((q, idx) => {
					statements.push(stmt.bind(idx + 1, q.id));
				});
				await db.batch(statements);
			}
			
			return { success: `${validIds.length} soal berhasil dihapus.`, deletedIds: validIds };
		} catch (e: any) {
			console.error('Error delete bulk:', e);
			return fail(500, { error: 'Gagal menghapus soal secara massal.' });
		}
	}
};
