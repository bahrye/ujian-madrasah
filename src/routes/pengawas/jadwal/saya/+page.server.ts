import { redirect } from '@sveltejs/kit';
import type { ServerLoad } from '@sveltejs/kit';
import { getDB } from '$lib/server/db';
import { formatExamTitle } from '$lib/utils/exam';

export interface ProctorScheduleItem {
	id: number;
	title: string;
	duration_minutes: number;
	start_time: string | null;
	end_time: string | null;
	is_active: number;
	subject_name: string | null;
	exam_type_name: string | null;
	exam_type_code: string | null;
	class_name: string | null;
}

export const load: ServerLoad = async ({ locals, platform }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const db = getDB(platform);

	// Bersihkan jika ada record pt / cm lama yang tidak sengaja tersimpan di exam_proctors
	try {
		await db.prepare("DELETE FROM exam_proctors WHERE proctor_role IN ('pt', 'cm')").run();
	} catch {}

	// Ambil jadwal mengawas pribadi (hanya ujian yang ditugaskan langsung ke pengawas, bukan sebagai proktor/panitia di tipe ujian)
	const { results: rawSchedules } = await db.prepare(`
		SELECT DISTINCT e.*, s.name as subject_name, et.code as exam_type_code, et.name as exam_type_name, c.name as class_name
		FROM exams e
		JOIN exam_proctors ep ON e.id = ep.exam_id
		LEFT JOIN subjects s ON e.subject_id = s.id
		LEFT JOIN exam_types et ON e.exam_type_id = et.id
		LEFT JOIN classes c ON e.class_id = c.id
		WHERE ep.proctor_id = ? 
		  AND COALESCE(ep.proctor_role, 'p1') NOT IN ('pt', 'cm')
		  AND e.school_id = ? 
		  AND e.is_active = 1
		ORDER BY e.start_time ASC
	`).bind(locals.user.id, locals.user.school_id).all<any>();

	const schedules = (rawSchedules || []).map((s: any) => ({
		...s,
		title: formatExamTitle({
			title: s.title,
			examTypeCode: s.exam_type_code,
			subjectName: s.subject_name,
			className: s.class_name
		})
	}));

	return {
		schedules
	};
};
