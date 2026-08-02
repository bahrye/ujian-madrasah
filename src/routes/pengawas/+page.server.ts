import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load: PageServerLoad = async ({ platform, locals }) => {
	const db = getDB(platform);

	const [activeExams, tokenCount, activeAttempts, schedules] = await Promise.all([
		db.prepare('SELECT COUNT(*) as c FROM exams WHERE is_active = 1 AND school_id = ?').bind(locals.user!.school_id).first<{ c: number }>(),
		db.prepare('SELECT COUNT(*) as c FROM tokens WHERE school_id = ?').bind(locals.user!.school_id).first<{ c: number }>(),
		db.prepare("SELECT COUNT(*) as c FROM student_attempts sa JOIN exams e ON sa.exam_id = e.id WHERE sa.status = 'mengerjakan' AND e.school_id = ?").bind(locals.user!.school_id).first<{ c: number }>(),
		db.prepare(`
			SELECT e.id as exam_id, e.title, e.start_time, e.end_time, e.duration_minutes, s.name as subject_name, e.is_active,
			(SELECT token_code FROM tokens WHERE exam_id = e.id LIMIT 1) as token_code
			FROM exams e
			JOIN exam_proctors ep ON e.id = ep.exam_id
			LEFT JOIN subjects s ON e.subject_id = s.id
			WHERE ep.proctor_id = ? AND e.school_id = ?
			ORDER BY e.start_time ASC
		`).bind(locals.user!.id, locals.user!.school_id).all()
	]);

	return {
		stats: {
			activeExams: activeExams?.c ?? 0,
			totalTokens: tokenCount?.c ?? 0,
			activeAttempts: activeAttempts?.c ?? 0
		},
		schedules: schedules.results
	};
};
