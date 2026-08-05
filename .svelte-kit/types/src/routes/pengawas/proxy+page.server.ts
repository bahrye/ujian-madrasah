// @ts-nocheck
import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load = async ({ platform, locals }: Parameters<PageServerLoad>[0]) => {
	const db = getDB(platform);

	const [activeExams, tokenCount, activeAttempts, schedules] = await Promise.all([
		db.prepare('SELECT COUNT(*) as c FROM exams JOIN exam_types ON exams.exam_type_id = exam_types.id WHERE exams.is_active = 1 AND exam_types.is_active = 1 AND exams.school_id = ?').bind(locals.user!.school_id).first<{ c: number }>(),
		db.prepare('SELECT COUNT(*) as c FROM tokens WHERE school_id = ?').bind(locals.user!.school_id).first<{ c: number }>(),
		db.prepare("SELECT COUNT(*) as c FROM student_attempts sa JOIN exams e ON sa.exam_id = e.id WHERE sa.status = 'mengerjakan' AND e.school_id = ?").bind(locals.user!.school_id).first<{ c: number }>(),
		db.prepare(`
			SELECT e.id as exam_id, e.title, e.start_time, e.end_time, e.duration_minutes, s.name as subject_name, e.is_active,
			(SELECT token_code FROM tokens WHERE exam_id = e.id AND expires_at > datetime('now') LIMIT 1) as token_code
			FROM exams e
			JOIN exam_proctors ep ON e.id = ep.exam_id
			LEFT JOIN subjects s ON e.subject_id = s.id
			JOIN exam_types et ON e.exam_type_id = et.id
			WHERE ep.proctor_id = ? AND e.school_id = ? AND et.is_active = 1 AND e.is_active = 1
			ORDER BY e.start_time ASC
		`).bind(locals.user!.id, locals.user!.school_id).all()
	]);

	const participantsDb = await db.prepare(`
		SELECT ep.exam_id, u.name, c.name as class_name, u.username
		FROM exam_participants ep
		JOIN users u ON ep.student_id = u.id
		LEFT JOIN classes c ON u.class_id = c.id
		WHERE ep.exam_id IN (SELECT exam_id FROM exam_proctors WHERE proctor_id = ?)
		ORDER BY c.name, u.name
	`).bind(locals.user!.id).all();

	const participants = participantsDb.results as any[];

	const schedulesWithParticipants = schedules.results.map((schedule: any) => {
		const examParticipants = participants.filter(p => p.exam_id === schedule.exam_id);
		return {
			...schedule,
			participant_count: examParticipants.length,
			participants: examParticipants
		};
	});

	return {
		stats: {
			activeExams: activeExams?.c ?? 0,
			totalTokens: tokenCount?.c ?? 0,
			activeAttempts: activeAttempts?.c ?? 0
		},
		schedules: schedulesWithParticipants
	};
};
