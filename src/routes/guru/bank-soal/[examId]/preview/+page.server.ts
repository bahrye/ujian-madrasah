import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load: PageServerLoad = async ({ platform, locals, params }) => {
	const db = getDB(platform);
	const examId = params.examId;

	// Validasi kepemilikan sekolah dan ujian buatan guru ini
	const exam = await db.prepare('SELECT id, title, duration_minutes FROM exams WHERE id = ? AND school_id = ? AND created_by = ?').bind(examId, locals.user!.school_id, locals.user!.id).first();
	
	if (!exam) {
		throw redirect(302, '/guru/bank-soal');
	}

	const questions = await db.prepare('SELECT * FROM questions WHERE exam_id = ? ORDER BY question_number ASC').bind(examId).all();

	return {
		exam,
		questions: questions.results
	};
};
