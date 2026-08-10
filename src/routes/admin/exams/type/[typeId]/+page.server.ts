import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load: PageServerLoad = async ({ params, platform, locals }) => {
	const db = getDB(platform);
	const typeIdStr = params.typeId;
	const typeId = parseInt(typeIdStr, 10);
	if (isNaN(typeId)) throw new Error('ID Tipe Ujian tidak valid');

	const examType = await db.prepare('SELECT * FROM exam_types WHERE id = ? AND school_id = ?')
		.bind(typeId, locals.user!.school_id).first() as any;

	if (!examType) {
		throw new Error('Tipe Ujian tidak ditemukan');
	}

	const exams = await db.prepare(`
		SELECT e.*, u.name as creator_name, s.name as subject_name,
			(SELECT COUNT(*) FROM questions WHERE exam_id = e.id) as question_count,
			(SELECT COUNT(*) FROM exam_participants WHERE exam_id = e.id) as participant_count,
			(SELECT COUNT(*) FROM exam_teachers WHERE exam_id = e.id) as teacher_count,
			(SELECT COUNT(*) FROM exam_proctors WHERE exam_id = e.id) as proctor_count,
			(SELECT GROUP_CONCAT(name, ', ') FROM (SELECT DISTINCT c.name FROM classes c JOIN users u ON u.class_id = c.id JOIN exam_participants ep ON ep.student_id = u.id WHERE ep.exam_id = e.id ORDER BY c.name)) as class_names
		FROM exams e
		LEFT JOIN users u ON e.created_by = u.id
		LEFT JOIN subjects s ON e.subject_id = s.id
		WHERE e.school_id = ? AND e.exam_type_id = ?
		ORDER BY e.created_at DESC
	`).bind(locals.user!.school_id, typeId).all();

	const subjects = await db.prepare('SELECT id, name FROM subjects WHERE school_id = ? ORDER BY name').bind(locals.user!.school_id).all();

	const classes = await db.prepare(`
		SELECT c.id, c.name 
		FROM classes c
		INNER JOIN exam_type_classes etc ON etc.class_id = c.id
		WHERE etc.exam_type_id = ? AND c.school_id = ?
		ORDER BY c.name
	`).bind(typeId, locals.user!.school_id).all();

	return { examType, exams: exams.results, subjects: subjects.results, classes: classes.results };
};

export const actions: Actions = {
	create: async ({ request, params, platform, locals }) => {
		const db = getDB(platform);
		const form = await request.formData();
		const typeIdStr = params.typeId;
		const parsedTypeId = parseInt(typeIdStr, 10);

		if (isNaN(parsedTypeId)) return fail(400, { error: 'ID Tipe Ujian tidak valid' });

		const examType = await db.prepare('SELECT * FROM exam_types WHERE id = ? AND school_id = ?')
			.bind(parsedTypeId, locals.user!.school_id).first() as any;
		
		if (!examType) return fail(400, { error: 'Tipe Ujian tidak valid.' });

		const subjectIdStr = form.get('subject_id')?.toString() || null;
		const parsedSubjectId = parseInt(subjectIdStr || '', 10);
		if (isNaN(parsedSubjectId)) return fail(400, { error: 'Mata Pelajaran wajib dipilih.' });

		const subject = await db.prepare('SELECT name FROM subjects WHERE id = ?').bind(parsedSubjectId).first() as any;
		const roomName = form.get('room_name')?.toString().trim();
		let title = `${examType.code} - ${subject.name}`;
		if (roomName) {
			title += ` - ${roomName}`;
		}

		const description = form.get('description')?.toString().trim() || '';
		const durationMinutes = parseInt(form.get('duration_minutes')?.toString() || '60');
		const startTime = form.get('start_time')?.toString() || null;
		const endTime = form.get('end_time')?.toString() || null;
		const shuffleQuestions = parseInt(form.get('shuffle_questions')?.toString() || '0');
		const showScoreType = form.get('show_score_type')?.toString() || 'after_submit';
		const isActive = form.get('is_active')?.toString() === '1' ? 1 : 0;

		// Validation to ensure start_time and end_time are within the examType's range
		if (startTime && examType.start_time) {
			if (new Date(startTime) < new Date(examType.start_time)) {
				return fail(400, { error: 'Waktu mulai tidak boleh mendahului rentang waktu Tipe Ujian.' });
			}
		}
		if (endTime && examType.end_time) {
			if (new Date(endTime) > new Date(examType.end_time)) {
				return fail(400, { error: 'Waktu selesai tidak boleh melebihi rentang waktu Tipe Ujian.' });
			}
		}

		try {
			const result = await db.prepare(`INSERT INTO exams (school_id, exam_type_id, title, description, subject_id, duration_minutes, start_time, end_time, is_active, shuffle_questions, show_score_type, created_by)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
				.bind(locals.user!.school_id, parsedTypeId, title, description, parsedSubjectId, durationMinutes, startTime, endTime, isActive, shuffleQuestions, showScoreType, locals.user?.id)
				.run();

			// Auto-populate peserta dari exam_type_participants
			const newExamId = result.meta?.last_row_id;
			if (newExamId) {
				const typeParticipants = await db.prepare(`
					SELECT u.id as student_id 
					FROM users u 
					JOIN exam_type_classes etc ON etc.class_id = u.class_id 
					WHERE etc.exam_type_id = ? AND u.role = 'siswa' AND u.is_active = 1
				`).bind(parsedTypeId).all<{ student_id: number }>();

				if (typeParticipants.results.length > 0) {
					const insertBatch = typeParticipants.results.map(p =>
						db.prepare('INSERT OR IGNORE INTO exam_participants (exam_id, student_id) VALUES (?, ?)')
							.bind(newExamId, p.student_id)
					);
					await db.batch(insertBatch);
				}
			}

			return { success: 'Ujian berhasil dibuat.' };
		} catch (e: any) {
			console.error(e);
			return fail(500, { error: e.message || 'Gagal membuat ujian' });
		}
	},

	update: async ({ request, platform, locals, params }) => {
		const db = getDB(platform);
		const form = await request.formData();
		const typeIdStr = params.typeId;
		const parsedTypeId = parseInt(typeIdStr, 10);

		if (isNaN(parsedTypeId)) return fail(400, { error: 'ID Tipe Ujian tidak valid.' });

		const examType = await db.prepare('SELECT * FROM exam_types WHERE id = ? AND school_id = ?')
			.bind(parsedTypeId, locals.user!.school_id).first() as any;
		
		if (!examType) return fail(400, { error: 'Tipe Ujian tidak valid.' });

		const idStr = form.get('id')?.toString();
		const subjectIdStr = form.get('subject_id')?.toString() || null;
		
		const parsedId = parseInt(idStr || '', 10);
		const parsedSubjectId = parseInt(subjectIdStr || '', 10);

		if (isNaN(parsedId)) return fail(400, { error: 'Data tidak lengkap.' });
		if (isNaN(parsedSubjectId)) return fail(400, { error: 'Mata pelajaran wajib diisi.' });

		const subject = await db.prepare('SELECT name FROM subjects WHERE id = ?').bind(parsedSubjectId).first() as any;
		const roomName = form.get('room_name')?.toString().trim();
		let title = subject ? `${examType.code} - ${subject.name}` : undefined;
		if (title && roomName) {
			title += ` - ${roomName}`;
		}

		const description = form.get('description')?.toString().trim() || '';
		const durationMinutes = parseInt(form.get('duration_minutes')?.toString() || '60');
		const startTime = form.get('start_time')?.toString() || null;
		const endTime = form.get('end_time')?.toString() || null;
		const isActive = form.get('is_active')?.toString() === '1' ? 1 : 0;
		const shuffleQuestions = parseInt(form.get('shuffle_questions')?.toString() || '0');
		const showScoreType = form.get('show_score_type')?.toString() || 'after_submit';

		if (startTime && examType.start_time) {
			if (new Date(startTime) < new Date(examType.start_time)) {
				return fail(400, { error: 'Waktu mulai tidak boleh mendahului rentang waktu Tipe Ujian.' });
			}
		}
		if (endTime && examType.end_time) {
			if (new Date(endTime) > new Date(examType.end_time)) {
				return fail(400, { error: 'Waktu selesai tidak boleh melebihi rentang waktu Tipe Ujian.' });
			}
		}

		try {
			await db.prepare(`UPDATE exams SET title=?, description=?, subject_id=?, duration_minutes=?,
				start_time=?, end_time=?, is_active=?, shuffle_questions=?, show_score_type=?, updated_at=datetime('now') WHERE id=? AND school_id=?`)
				.bind(title, description, parsedSubjectId, durationMinutes, startTime, endTime, isActive, shuffleQuestions, showScoreType, parsedId, locals.user!.school_id)
				.run();

			return { success: 'Ujian berhasil diperbarui.' };
		} catch (e: any) {
			console.error(e);
			return fail(500, { error: e.message || 'Gagal mengupdate ujian' });
		}
	},

	delete: async ({ request, platform, locals }) => {
		const db = getDB(platform);
		const form = await request.formData();
		const idStr = form.get('id')?.toString();
		const parsedId = parseInt(idStr || '', 10);

		if (isNaN(parsedId)) return fail(400, { error: 'ID tidak valid.' });

		try {
			const attempts = await db.prepare('SELECT id FROM student_attempts WHERE exam_id = ?').bind(parsedId).all<{ id: number }>();
			const attemptIds = attempts.results.map((a: any) => a.id);
			
			const batch = [];
			
			if (attemptIds.length > 0) {
				const placeholders = attemptIds.map(() => '?').join(',');
				batch.push(db.prepare(`DELETE FROM student_answers WHERE attempt_id IN (${placeholders})`).bind(...attemptIds));
				batch.push(db.prepare('DELETE FROM student_attempts WHERE exam_id = ?').bind(parsedId));
			}

			batch.push(db.prepare('DELETE FROM questions WHERE exam_id = ?').bind(parsedId));
			batch.push(db.prepare('DELETE FROM tokens WHERE exam_id = ?').bind(parsedId));
			batch.push(db.prepare('DELETE FROM exam_participants WHERE exam_id = ?').bind(parsedId));
			batch.push(db.prepare('DELETE FROM exam_proctors WHERE exam_id = ?').bind(parsedId));
			batch.push(db.prepare('DELETE FROM exam_teachers WHERE exam_id = ?').bind(parsedId));

			batch.push(db.prepare('DELETE FROM exams WHERE id = ? AND school_id = ?').bind(parsedId, locals.user!.school_id));

			await db.batch(batch);
			return { success: 'Ujian berhasil dihapus.' };
		} catch (e: any) {
			console.error('Delete error:', e);
			return fail(500, { error: 'Gagal menghapus ujian. Mungkin masih ada data terkait.' });
		}
	},

	toggleActive: async ({ request, platform, locals }) => {
		const db = getDB(platform);
		const form = await request.formData();
		const idStr = form.get('id')?.toString();
		const parsedId = parseInt(idStr || '', 10);

		if (isNaN(parsedId)) return fail(400, { error: 'ID tidak valid.' });

		try {
			await db.prepare(`UPDATE exams SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END, updated_at=datetime('now') WHERE id = ? AND school_id = ?`)
				.bind(parsedId, locals.user!.school_id).run();

			return { success: 'Status ujian berhasil diperbarui.' };
		} catch (e: any) {
			console.error(e);
			return fail(500, { error: e.message || 'Gagal mengubah status ujian' });
		}
	}
};
