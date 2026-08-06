// @ts-nocheck
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load = async ({ platform, locals }: Parameters<PageServerLoad>[0]) => {
	const db = getDB(platform);
	const exams = await db.prepare(`
		SELECT e.*, s.name as subject_name,
			(SELECT COUNT(*) FROM questions WHERE exam_id = e.id) as question_count,
			(SELECT COUNT(*) FROM exam_participants WHERE exam_id = e.id) as participant_count
		FROM exams e
		LEFT JOIN subjects s ON e.subject_id = s.id
		WHERE e.school_id = ? AND e.created_by = ?
		ORDER BY e.created_at DESC
	`).bind(locals.user!.school_id, locals.user!.id).all();

	const subjects = await db.prepare('SELECT id, name FROM subjects WHERE school_id = ? ORDER BY name').bind(locals.user!.school_id).all();

	return { exams: exams.results, subjects: subjects.results };
};

export const actions = {
	create: async ({ request, platform, locals }: import('./$types').RequestEvent) => {
		const db = getDB(platform);
		const form = await request.formData();

		const title = form.get('title')?.toString().trim();
		const description = form.get('description')?.toString().trim() || '';
		const subjectId = form.get('subject_id')?.toString() || null;
		const durationMinutes = parseInt(form.get('duration_minutes')?.toString() || '60');
		const startTime = form.get('start_time')?.toString() || null;
		const endTime = form.get('end_time')?.toString() || null;
		const shuffleQuestions = parseInt(form.get('shuffle_questions')?.toString() || '0');
		const showScoreType = form.get('show_score_type')?.toString() || 'after_submit';

		if (!title) return fail(400, { error: 'Judul ujian wajib diisi.' });

		await db.prepare(`INSERT INTO exams (school_id, title, description, subject_id, duration_minutes, start_time, end_time, shuffle_questions, show_score_type, created_by)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
			.bind(locals.user!.school_id, title, description, subjectId, durationMinutes, startTime, endTime, shuffleQuestions, showScoreType, locals.user!.id)
			.run();

		return { success: 'Ujian Remedial berhasil dibuat.' };
	},

	update: async ({ request, platform, locals }: import('./$types').RequestEvent) => {
		const db = getDB(platform);
		const form = await request.formData();

		const idStr = form.get('id')?.toString();
		const parsedId = parseInt(idStr || '', 10);
		const title = form.get('title')?.toString().trim();
		const description = form.get('description')?.toString().trim() || '';
		const subjectId = form.get('subject_id')?.toString() || null;
		const durationMinutes = parseInt(form.get('duration_minutes')?.toString() || '60');
		const startTime = form.get('start_time')?.toString() || null;
		const endTime = form.get('end_time')?.toString() || null;
		const isActive = form.get('is_active')?.toString() === '1' ? 1 : 0;
		const shuffleQuestions = parseInt(form.get('shuffle_questions')?.toString() || '0');
		const showScoreType = form.get('show_score_type')?.toString() || 'after_submit';

		if (isNaN(parsedId) || !title) return fail(400, { error: 'Data tidak lengkap.' });

		try {
			await db.prepare(`UPDATE exams SET title=?, description=?, subject_id=?, duration_minutes=?,
				start_time=?, end_time=?, is_active=?, shuffle_questions=?, show_score_type=?, updated_at=datetime('now') WHERE id=? AND school_id=? AND created_by=?`)
				.bind(title, description, subjectId, durationMinutes, startTime, endTime, isActive, shuffleQuestions, showScoreType, parsedId, locals.user!.school_id, locals.user!.id)
				.run();

			return { success: 'Ujian Remedial berhasil diperbarui.' };
		} catch (e: any) {
			console.error(e);
			return fail(500, { error: e.message || 'Gagal memperbarui ujian remedial.' });
		}
	},

	delete: async ({ request, platform, locals }: import('./$types').RequestEvent) => {
		const db = getDB(platform);
		const form = await request.formData();
		const idStr = form.get('id')?.toString();
		const parsedId = parseInt(idStr || '', 10);

		if (isNaN(parsedId)) return fail(400, { error: 'ID tidak valid.' });

		try {
			// Manually cascade deletes to prevent constraint errors
			await db.batch([
				db.prepare('DELETE FROM student_answers WHERE attempt_id IN (SELECT id FROM student_attempts WHERE exam_id = ?)').bind(parsedId),
				db.prepare('DELETE FROM student_attempts WHERE exam_id = ?').bind(parsedId),
				db.prepare('DELETE FROM exam_participants WHERE exam_id = ?').bind(parsedId),
				db.prepare('DELETE FROM tokens WHERE exam_id = ?').bind(parsedId),
				db.prepare('DELETE FROM questions WHERE exam_id = ?').bind(parsedId),
				db.prepare('DELETE FROM exams WHERE id = ? AND school_id = ? AND created_by = ?').bind(parsedId, locals.user!.school_id, locals.user!.id)
			]);
			return { success: 'Ujian Remedial berhasil dihapus.' };
		} catch (e: any) {
			console.error(e);
			return fail(500, { error: e.message || 'Gagal menghapus ujian remedial.' });
		}
	},

	toggleActive: async ({ request, platform, locals }: import('./$types').RequestEvent) => {
		const db = getDB(platform);
		const form = await request.formData();
		const idStr = form.get('id')?.toString();
		const parsedId = parseInt(idStr || '', 10);

		if (isNaN(parsedId)) return fail(400, { error: 'ID tidak valid.' });

		try {
			await db.prepare(`UPDATE exams SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END, updated_at=datetime('now') WHERE id = ? AND school_id = ? AND created_by = ?`)
				.bind(parsedId, locals.user!.school_id, locals.user!.id).run();

			return { success: 'Status ujian berhasil diperbarui.' };
		} catch (e: any) {
			console.error(e);
			return fail(500, { error: e.message || 'Gagal memperbarui status.' });
		}
	}
};
;null as any as Actions;