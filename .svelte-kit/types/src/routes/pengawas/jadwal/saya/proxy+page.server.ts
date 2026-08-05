// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import type { ServerLoad } from '@sveltejs/kit';
import { getDB } from '$lib/server/db';

export interface ProctorScheduleItem {
	id: number;
	title: string;
	duration_minutes: number;
	start_time: string | null;
	end_time: string | null;
	is_active: number;
	subject_name: string | null;
	exam_type_name: string | null;
}

export const load = async ({ locals, platform }: Parameters<ServerLoad>[0]) => {
	if (!locals.user || locals.user.role !== 'pengawas') {
		throw redirect(302, '/login');
	}

	const db = getDB(platform);

	// Ambil jadwal mengawas pribadi (ujian yang ditugaskan kepada pengawas ini)
	const { results: schedules } = await db.prepare(`
		SELECT e.*, s.name as subject_name, et.name as exam_type_name
		FROM exams e
		LEFT JOIN subjects s ON e.subject_id = s.id
		LEFT JOIN exam_types et ON e.exam_type_id = et.id
		JOIN exam_proctors ep ON e.id = ep.exam_id
		WHERE ep.proctor_id = ? AND e.school_id = ? AND e.is_active = 1
		ORDER BY e.start_time ASC
	`).bind(locals.user.id, locals.user.school_id).all<ProctorScheduleItem>();

	return {
		schedules
	};
};
