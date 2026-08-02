// @ts-nocheck
import type { PageServerLoad, Actions } from './$types';
import { getDB } from '$lib/server/db';
import { error, fail } from '@sveltejs/kit';

export const load = async ({ platform, params, locals }: Parameters<PageServerLoad>[0]) => {
	const db = getDB(platform);
	const examId = params.id;
	
	const exam = await db.prepare('SELECT e.*, s.name as subject_name FROM exams e LEFT JOIN subjects s ON e.subject_id = s.id WHERE e.id = ?').bind(examId).first();
	if (!exam) throw error(404, 'Ujian tidak ditemukan');

	const questions = await db.prepare('SELECT * FROM questions WHERE exam_id = ? ORDER BY question_number').bind(examId).all();
	const attempts = await db.prepare(`
		SELECT sa.*, u.name as student_name FROM student_attempts sa
		JOIN users u ON sa.student_id = u.id WHERE sa.exam_id = ? ORDER BY sa.created_at DESC
	`).bind(examId).all();
	const tokens = await db.prepare('SELECT * FROM tokens WHERE exam_id = ? ORDER BY created_at DESC').bind(examId).all();

	const participants = await db.prepare(`
		SELECT p.id as participant_id, u.id as user_id, u.name as student_name, u.username as nisn, c.name as class_name
		FROM exam_participants p
		JOIN users u ON p.student_id = u.id
		LEFT JOIN classes c ON u.class_id = c.id
		WHERE p.exam_id = ?
		ORDER BY c.name, u.name
	`).bind(examId).all();

	const classes = await db.prepare('SELECT id, name FROM classes WHERE school_id = ? ORDER BY name').bind(locals.user!.school_id).all();
	const allStudents = await db.prepare('SELECT id, name, username, class_id FROM users WHERE school_id = ? AND role = "siswa" ORDER BY name').bind(locals.user!.school_id).all();
	
	const allTeachers = await db.prepare('SELECT id, name, username FROM users WHERE school_id = ? AND role = "guru" ORDER BY name').bind(locals.user!.school_id).all();
	const examTeachers = await db.prepare(`
		SELECT et.id as exam_teacher_id, u.id as user_id, u.name, u.username
		FROM exam_teachers et
		JOIN users u ON et.teacher_id = u.id
		WHERE et.exam_id = ?
		ORDER BY u.name
	`).bind(examId).all();

	const allProctors = await db.prepare('SELECT id, name, username FROM users WHERE school_id = ? AND role = "pengawas" ORDER BY name').bind(locals.user!.school_id).all();
	const examProctors = await db.prepare(`
		SELECT ep.id as exam_proctor_id, u.id as user_id, u.name, u.username
		FROM exam_proctors ep
		JOIN users u ON ep.proctor_id = u.id
		WHERE ep.exam_id = ?
		ORDER BY u.name
	`).bind(examId).all();

	return { 
		exam, 
		questions: questions.results, 
		attempts: attempts.results, 
		tokens: tokens.results,
		participants: participants.results,
		classes: classes.results,
		allStudents: allStudents.results,
		allTeachers: allTeachers.results,
		examTeachers: examTeachers.results,
		allProctors: allProctors.results,
		examProctors: examProctors.results
	};
};

export const actions = {
	addParticipantClass: async ({ request, platform, params }: import('./$types').RequestEvent) => {
		const db = getDB(platform);
		const form = await request.formData();
		const classId = form.get('class_id')?.toString();
		if (!classId) return fail(400, { error: 'Pilih kelas terlebih dahulu' });

		const students = await db.prepare('SELECT id FROM users WHERE class_id = ? AND role = "siswa"').bind(classId).all();
		
		let added = 0;
		for (const student of students.results) {
			try {
				await db.prepare('INSERT INTO exam_participants (exam_id, student_id) VALUES (?, ?)')
					.bind(params.id, student.id).run();
				added++;
			} catch (e) {
				// Ignore if already exists (UNIQUE constraint)
			}
		}

		return { success: `Berhasil menambahkan ${added} siswa dari kelas ke peserta ujian.` };
	},

	addParticipantStudent: async ({ request, platform, params }: import('./$types').RequestEvent) => {
		const db = getDB(platform);
		const form = await request.formData();
		const studentIds = form.getAll('student_ids').map(id => id.toString());
		if (studentIds.length === 0) return fail(400, { error: 'Pilih minimal satu siswa' });

		let added = 0;
		for (const studentId of studentIds) {
			try {
				await db.prepare('INSERT INTO exam_participants (exam_id, student_id) VALUES (?, ?)')
					.bind(params.id, studentId).run();
				added++;
			} catch (e) {
				// Ignore if already exists (UNIQUE constraint)
			}
		}
		return { success: `Berhasil menambahkan ${added} siswa ke peserta ujian.` };
	},

	removeParticipant: async ({ request, platform, params }: import('./$types').RequestEvent) => {
		const db = getDB(platform);
		const form = await request.formData();
		const participantId = form.get('participant_id')?.toString();
		if (!participantId) return fail(400, { error: 'ID peserta tidak valid' });

		await db.prepare('DELETE FROM exam_participants WHERE id = ?').bind(participantId).run();
		return { success: 'Peserta berhasil dihapus dari ujian.' };
	},

	addTeacher: async ({ request, platform, params }: import('./$types').RequestEvent) => {
		const db = getDB(platform);
		const form = await request.formData();
		const teacherIds = form.getAll('teacher_ids').map(id => id.toString());
		if (teacherIds.length === 0) return fail(400, { error: 'Pilih minimal satu guru' });

		let added = 0;
		for (const teacherId of teacherIds) {
			try {
				await db.prepare('INSERT INTO exam_teachers (exam_id, teacher_id) VALUES (?, ?)')
					.bind(params.id, teacherId).run();
				added++;
			} catch (e) {
				// Ignore if already exists
			}
		}
		return { success: `Berhasil menambahkan ${added} guru pengajar ujian.` };
	},

	removeTeacher: async ({ request, platform, params }: import('./$types').RequestEvent) => {
		const db = getDB(platform);
		const form = await request.formData();
		const examTeacherId = form.get('exam_teacher_id')?.toString();
		if (!examTeacherId) return fail(400, { error: 'ID pengajar tidak valid' });

		await db.prepare('DELETE FROM exam_teachers WHERE id = ?').bind(examTeacherId).run();
		return { success: 'Pengajar berhasil dihapus.' };
	},

	addProctor: async ({ request, platform, params }: import('./$types').RequestEvent) => {
		const db = getDB(platform);
		const form = await request.formData();
		const proctorIds = form.getAll('proctor_ids').map(id => id.toString());
		if (proctorIds.length === 0) return fail(400, { error: 'Pilih minimal satu pengawas' });

		let added = 0;
		for (const proctorId of proctorIds) {
			try {
				await db.prepare('INSERT INTO exam_proctors (exam_id, proctor_id) VALUES (?, ?)')
					.bind(params.id, proctorId).run();
				added++;
			} catch (e) {
				// Ignore if already exists
			}
		}
		return { success: `Berhasil menambahkan ${added} pengawas ujian.` };
	},

	removeProctor: async ({ request, platform, params }: import('./$types').RequestEvent) => {
		const db = getDB(platform);
		const form = await request.formData();
		const examProctorId = form.get('exam_proctor_id')?.toString();
		if (!examProctorId) return fail(400, { error: 'ID pengawas tidak valid' });

		await db.prepare('DELETE FROM exam_proctors WHERE id = ?').bind(examProctorId).run();
		return { success: 'Pengawas berhasil dihapus.' };
	}
};
;null as any as Actions;