import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDB } from '$lib/server/db';

export const GET: RequestHandler = async ({ params, platform, locals }) => {
	const user = locals.user;
	if (!user || !['admin', 'superadmin', 'guru', 'pengawas', 'panitia'].includes(user.role)) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const db = getDB(platform);
	const examId = params.id;

	// Verify exam belongs to same school (or user is superadmin)
	const isSuperAdmin = user.role === 'superadmin';
	const exam = isSuperAdmin
		? await db.prepare('SELECT id FROM exams WHERE id = ?').bind(examId).first()
		: await db.prepare('SELECT id FROM exams WHERE id = ? AND school_id = ?').bind(examId, user.school_id).first();

	if (!exam) {
		return json({ error: 'Exam not found or unauthorized' }, { status: 404 });
	}

	const questionsResult = await db.prepare(`
		SELECT id, question_number, type, question_text, points
		FROM questions
		WHERE exam_id = ?
		ORDER BY question_number ASC, id ASC
	`).bind(examId).all();

	return json({ questions: questionsResult.results });
};
