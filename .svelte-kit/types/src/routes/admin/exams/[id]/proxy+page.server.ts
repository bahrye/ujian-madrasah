// @ts-nocheck
import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { error } from '@sveltejs/kit';

export const load = async ({ platform, params }: Parameters<PageServerLoad>[0]) => {
	const db = getDB(platform);
	const exam = await db.prepare('SELECT * FROM exams WHERE id = ?').bind(params.id).first();
	if (!exam) throw error(404, 'Ujian tidak ditemukan');

	const questions = await db.prepare('SELECT * FROM questions WHERE exam_id = ? ORDER BY question_number').bind(params.id).all();
	const attempts = await db.prepare(`
		SELECT sa.*, u.name as student_name FROM student_attempts sa
		JOIN users u ON sa.student_id = u.id WHERE sa.exam_id = ? ORDER BY sa.created_at DESC
	`).bind(params.id).all();
	const tokens = await db.prepare('SELECT * FROM tokens WHERE exam_id = ? ORDER BY created_at DESC').bind(params.id).all();

	return { exam, questions: questions.results, attempts: attempts.results, tokens: tokens.results };
};
