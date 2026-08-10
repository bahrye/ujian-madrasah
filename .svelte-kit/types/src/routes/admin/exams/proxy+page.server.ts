// @ts-nocheck
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load = async ({ platform, locals }: Parameters<PageServerLoad>[0]) => {
	const db = getDB(platform);

	const examTypes = await db.prepare(`
		SELECT et.*, 
			(SELECT COUNT(*) FROM exams WHERE exam_type_id = et.id) as exam_count,
			(SELECT COUNT(*) FROM exam_type_participants WHERE exam_type_id = et.id) as participant_count
		FROM exam_types et
		WHERE et.school_id = ?
		ORDER BY et.created_at DESC
	`).bind(locals.user!.school_id).all();

	const classes = await db.prepare('SELECT id, name FROM classes WHERE school_id = ? ORDER BY name ASC')
		.bind(locals.user!.school_id).all<{ id: number; name: string }>();

	const students = await db.prepare(
		'SELECT id, name, username, class_id FROM users WHERE school_id = ? AND role = "siswa" ORDER BY name ASC'
	).bind(locals.user!.school_id).all<{ id: number; name: string; username: string; class_id: number | null }>();

	return {
		examTypes: examTypes.results,
		classes: classes.results,
		students: students.results
	};
};

export const actions = {
	create: async ({ request, platform, locals }: import('./$types').RequestEvent) => {
		const db = getDB(platform);
		const form = await request.formData();

		const code = form.get('code')?.toString().trim();
		const name = form.get('name')?.toString().trim();
		const description = form.get('description')?.toString().trim() || '';
		const startTime = form.get('start_time')?.toString() || null;
		const endTime = form.get('end_time')?.toString() || null;
		const isActive = 1; // Tipe ujian selalu aktif

		if (!code || !name) return fail(400, { error: 'Kode dan Nama Tipe Ujian wajib diisi.' });

		try {
			await db.prepare(`INSERT INTO exam_types (school_id, code, name, description, start_time, end_time, is_active)
				VALUES (?, ?, ?, ?, ?, ?, ?)`)
				.bind(locals.user!.school_id, code, name, description, startTime, endTime, isActive)
				.run();
			return { success: 'Tipe Ujian berhasil dibuat.' };
		} catch (e: any) {
			console.error(e);
			return fail(500, { error: e.message || 'Gagal membuat tipe ujian. Mungkin kode sudah digunakan.' });
		}
	},

	update: async ({ request, platform, locals }: import('./$types').RequestEvent) => {
		const db = getDB(platform);
		const form = await request.formData();

		const idStr = form.get('id')?.toString();
		const code = form.get('code')?.toString().trim();
		const name = form.get('name')?.toString().trim();
		const description = form.get('description')?.toString().trim() || '';
		const startTime = form.get('start_time')?.toString() || null;
		const endTime = form.get('end_time')?.toString() || null;
		const isActive = 1; // Tipe ujian selalu aktif
		const parsedId = parseInt(idStr || '', 10);

		if (isNaN(parsedId) || !code || !name) return fail(400, { error: 'Data tidak lengkap.' });

		try {
			// Ambil kode lama untuk cek apakah berubah
			const oldType = await db.prepare('SELECT code FROM exam_types WHERE id = ? AND school_id = ?')
				.bind(parsedId, locals.user!.school_id)
				.first<{ code: string }>();

			await db.prepare(`UPDATE exam_types SET code=?, name=?, description=?, start_time=?, end_time=?, is_active=? WHERE id=? AND school_id=?`)
				.bind(code, name, description, startTime, endTime, isActive, parsedId, locals.user!.school_id)
				.run();

			// Otomatis perbarui title semua ujian yang terhubung jika code berubah
			if (oldType && oldType.code !== code) {
				const linkedExams = await db.prepare(`
					SELECT e.id, s.name as subject_name
					FROM exams e
					LEFT JOIN subjects s ON e.subject_id = s.id
					WHERE e.exam_type_id = ? AND e.school_id = ?
				`).bind(parsedId, locals.user!.school_id).all<{ id: number; subject_name: string | null }>();

				if (linkedExams.results.length > 0) {
					const updateBatch = linkedExams.results.map(exam =>
						db.prepare(`UPDATE exams SET title = ?, updated_at = datetime('now') WHERE id = ? AND school_id = ?`)
							.bind(`${code} - ${exam.subject_name || 'Ujian'}`, exam.id, locals.user!.school_id)
					);
					await db.batch(updateBatch);
				}
			}

			// Otomatis nonaktifkan ujian yang rentang waktunya keluar dari tipe ujian yang baru
			if (startTime && endTime) {
				await db.prepare(`
					UPDATE exams 
					SET is_active = 0 
					WHERE exam_type_id = ? AND school_id = ?
					AND (
						(start_time IS NOT NULL AND start_time < ?) OR 
						(end_time IS NOT NULL AND end_time > ?)
					)
				`).bind(parsedId, locals.user!.school_id, startTime, endTime).run();
			}
			return { success: 'Tipe Ujian berhasil diperbarui. Nama ujian yang terhubung telah diperbarui otomatis.' };
		} catch (e: any) {
			console.error(e);
			return fail(500, { error: e.message || 'Gagal memperbarui tipe ujian.' });
		}
	},

	delete: async ({ request, platform, locals }: import('./$types').RequestEvent) => {
		const db = getDB(platform);
		const form = await request.formData();
		const idStr = form.get('id')?.toString();
		const parsedId = parseInt(idStr || '', 10);

		if (isNaN(parsedId)) return fail(400, { error: 'ID tidak valid.' });

		try {
			const exams = await db.prepare('SELECT COUNT(*) as count FROM exams WHERE exam_type_id = ? AND school_id = ?')
				.bind(parsedId, locals.user!.school_id).first() as { count: number };
			if (exams && exams.count > 0) {
				return fail(400, { error: 'Gagal dihapus: Masih ada ujian yang terikat pada tipe ini.' });
			}
			
			await db.prepare('DELETE FROM exam_types WHERE id = ? AND school_id = ?').bind(parsedId, locals.user!.school_id).run();
			return { success: 'Tipe Ujian berhasil dihapus.' };
		} catch (e: any) {
			console.error(e);
			return fail(500, { error: e.message || 'Gagal menghapus tipe ujian.' });
		}
	},

	// ── Peserta Default Tipe Ujian ──────────────────────────────────────────

	addTypeClass: async ({ request, platform, locals }: import('./$types').RequestEvent) => {
		const db = getDB(platform);
		const form = await request.formData();
		const examTypeIdStr = form.get('exam_type_id')?.toString();
		const classIdsStr = form.getAll('class_ids').map(id => id.toString());
		const parsedExamTypeId = parseInt(examTypeIdStr || '', 10);
		const parsedClassIds = classIdsStr.map(id => parseInt(id, 10)).filter(id => !isNaN(id));

		if (isNaN(parsedExamTypeId) || parsedClassIds.length === 0) return fail(400, { error: 'Data tidak lengkap.' });

		// Verifikasi tipe ujian dan kelas milik sekolah ini
		const examType = await db.prepare('SELECT id FROM exam_types WHERE id = ? AND school_id = ?')
			.bind(parsedExamTypeId, locals.user!.school_id).first();
		if (!examType) return fail(404, { error: 'Tipe ujian tidak ditemukan.' });

		const placeholders = parsedClassIds.map(() => '?').join(',');
		const validClasses = await db.prepare(`SELECT id FROM classes WHERE id IN (${placeholders}) AND school_id = ?`)
			.bind(...parsedClassIds, locals.user!.school_id).all<{ id: number }>();

		if (validClasses.results.length === 0) {
			return fail(400, { error: 'Kelas yang dipilih tidak valid.' });
		}

		const insertStmts = validClasses.results.map(cls =>
			db.prepare('INSERT OR IGNORE INTO exam_type_classes (exam_type_id, class_id) VALUES (?, ?)')
				.bind(parsedExamTypeId, cls.id)
		);

		await db.batch(insertStmts);
		return { success: `Berhasil menambahkan ${validClasses.results.length} kelas sebagai peserta ujian.` };
	},

	removeTypeClass: async ({ request, platform, locals }: import('./$types').RequestEvent) => {
		const db = getDB(platform);
		const form = await request.formData();
		const idStr = form.get('id')?.toString();
		const parsedId = parseInt(idStr || '', 10);

		if (isNaN(parsedId)) return fail(400, { error: 'ID tidak valid.' });

		// Pastikan record terhubung ke exam_type milik sekolah ini
		await db.prepare(`
			DELETE FROM exam_type_classes 
			WHERE id = ? AND exam_type_id IN (SELECT id FROM exam_types WHERE school_id = ?)
		`).bind(parsedId, locals.user!.school_id).run();

		return { success: 'Kelas berhasil dihapus dari daftar peserta.' };
	},

	clearTypeClasses: async ({ request, platform, locals }: import('./$types').RequestEvent) => {
		const db = getDB(platform);
		const form = await request.formData();
		const examTypeIdStr = form.get('exam_type_id')?.toString();
		const parsedExamTypeId = parseInt(examTypeIdStr || '', 10);

		if (isNaN(parsedExamTypeId)) return fail(400, { error: 'ID tidak valid.' });

		const examType = await db.prepare('SELECT id FROM exam_types WHERE id = ? AND school_id = ?')
			.bind(parsedExamTypeId, locals.user!.school_id).first();
		if (!examType) return fail(404, { error: 'Tipe ujian tidak ditemukan.' });

		await db.prepare('DELETE FROM exam_type_classes WHERE exam_type_id = ?').bind(parsedExamTypeId).run();
		return { success: 'Semua kelas berhasil dihapus dari tipe ujian ini.' };
	},

	getTypeClasses: async ({ request, platform, locals }: import('./$types').RequestEvent) => {
		const db = getDB(platform);
		const form = await request.formData();
		const examTypeIdStr = form.get('exam_type_id')?.toString();
		const parsedExamTypeId = parseInt(examTypeIdStr || '', 10);

		if (isNaN(parsedExamTypeId)) return fail(400, { error: 'ID tidak valid.' });

		// Verifikasi kepemilikan tipe ujian
		const examType = await db.prepare('SELECT id FROM exam_types WHERE id = ? AND school_id = ?')
			.bind(parsedExamTypeId, locals.user!.school_id).first();
		if (!examType) return fail(404, { error: 'Tipe ujian tidak ditemukan.' });

		// Dapatkan kelas-kelas yang terdaftar
		const classes = await db.prepare(`
			SELECT etc.id as relation_id, c.id, c.name,
				(SELECT COUNT(*) FROM users u WHERE u.class_id = c.id AND u.role = 'siswa' AND u.is_active = 1) as student_count
			FROM exam_type_classes etc
			JOIN classes c ON etc.class_id = c.id
			WHERE etc.exam_type_id = ? AND c.school_id = ?
			ORDER BY c.name
		`).bind(parsedExamTypeId, locals.user!.school_id).all();

		// Untuk setiap kelas, dapatkan daftar siswa secara opsional jika diperlukan oleh UI (atau bisa di-fetch terpisah). 
		// Lebih baik kita kirimkan data siswa sekalian karena jumlahnya relatif kecil per kelas.
		const classIds = classes.results.map((c: any) => c.id);
		let students: any[] = [];
		if (classIds.length > 0) {
			const placeholders = classIds.map(() => '?').join(',');
			const studentsQuery = await db.prepare(`
				SELECT id, name, username as nisn, class_id 
				FROM users 
				WHERE class_id IN (${placeholders}) AND role = 'siswa' AND is_active = 1
				ORDER BY name
			`).bind(...classIds).all();
			students = studentsQuery.results;
		}

		// Group students by class
		const formattedClasses = classes.results.map((c: any) => {
			return {
				...c,
				students: students.filter((s: any) => s.class_id === c.id)
			};
		});

		return { classes: formattedClasses };
	}
};
;null as any as Actions;