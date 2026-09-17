import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDB } from '$lib/server/db';

export const GET: RequestHandler = async ({ params, platform, locals }) => {
	if (!locals.user) return json({ error: 'Unauthorized' }, { status: 401 });
	const db = getDB(platform);
	const attemptId = params.id;

	if (!attemptId) return json({ error: 'ID tidak valid' }, { status: 400 });

	const schoolId = locals.user.school_id || 0;
	const attempt = await db.prepare(`
		SELECT sa.is_paused, sa.status, sa.end_time, 
		       e.exit_pin as exam_exit_pin,
		       sc.master_exit_pin
		FROM student_attempts sa
		JOIN exams e ON sa.exam_id = e.id
		LEFT JOIN schools sc ON sc.id = ?
		WHERE sa.id = ? AND sa.student_id = ?
	`).bind(schoolId, attemptId, locals.user.id).first() as any;

	if (!attempt) return json({ error: 'Not found' }, { status: 404 });

	return json({
		is_paused: attempt.is_paused === 1,
		status: attempt.status,
		end_time: attempt.end_time,
		exam_exit_pin: attempt.exam_exit_pin || null,
		master_exit_pin: attempt.master_exit_pin || null
	}, {
		headers: {
			'Cache-Control': 'no-store, no-cache, must-revalidate'
		}
	});
};
