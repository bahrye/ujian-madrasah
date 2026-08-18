import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDB } from '$lib/server/db';

export const GET: RequestHandler = async ({ url, platform, locals }) => {
	if (!locals.user) return json({ error: 'Unauthorized' }, { status: 401 });

	const db = getDB(platform);
	const examIdStr = url.searchParams.get('exam_id') || '';
	const examId = parseInt(examIdStr, 10);
	const sessionFilterStr = url.searchParams.get('session_number') || '';
	const sessionFilter = parseInt(sessionFilterStr, 10);

	if (isNaN(examId)) return json({ error: 'ID Ujian tidak valid' }, { status: 400 });

	try {
		let query = `
			SELECT 
				epart.student_id,
				u.name as student_name, 
				u.username, 
				COALESCE(u.session_number, 1) as student_session_number,
				e.title as exam_title,
				e.duration_minutes,
				(SELECT COUNT(*) FROM questions WHERE exam_id = e.id) as question_count,
				sa.id as attempt_id,
				sa.start_time,
				sa.end_time,
				sa.submit_time,
				sa.score,
				sa.total_points,
				sa.status,
				sa.violation_count,
				sa.violation_logs,
				sa.is_paused,
				sa.paused_at,
				sa.signature
			FROM exam_participants epart
			JOIN users u ON epart.student_id = u.id
			JOIN exams e ON epart.exam_id = e.id
			LEFT JOIN student_attempts sa ON sa.student_id = epart.student_id AND sa.exam_id = epart.exam_id
			WHERE epart.exam_id = ? AND e.school_id = ?
		`;

		const bindings: any[] = [examId, locals.user.school_id];

		const dbSessions = await db.prepare(`
			SELECT session_number FROM exam_sessions WHERE exam_id = ?
		`).bind(examId).all<{ session_number: number }>();

		const availableSessions = (dbSessions.results || []).map(s => s.session_number);

		if (availableSessions.length > 0 && !isNaN(sessionFilter) && availableSessions.includes(sessionFilter)) {
			query += ` AND COALESCE(u.session_number, 1) = ?`;
			bindings.push(sessionFilter);
		}

		query += `
			ORDER BY 
				CASE WHEN sa.status = 'mengerjakan' THEN 1 
					 WHEN sa.status IS NULL THEN 2 
					 ELSE 3 END ASC,
				u.name ASC
		`;

		const result = await db.prepare(query).bind(...bindings).all();
		const attempts = result.results || [];

		// Fetch all answers count from DB to avoid N+1 queries
		let answeredCountsMap: Record<number, number> = {};
		const attemptIds = attempts.map((a: any) => a.attempt_id).filter(Boolean);
		if (attemptIds.length > 0) {
			const countsResult = await db.prepare(`
				SELECT sa.attempt_id, COUNT(*) as c
				FROM student_answers sa
				JOIN student_attempts st ON sa.attempt_id = st.id
				WHERE st.exam_id = ? AND sa.answer_given IS NOT NULL AND sa.answer_given != '' AND sa.answer_given != '[]' AND sa.answer_given != '{}'
				GROUP BY sa.attempt_id
			`).bind(examId).all();
			
			(countsResult.results || []).forEach((r: any) => {
				answeredCountsMap[r.attempt_id] = r.c;
			});
		}

		const attemptsWithProgress = attempts.map((a: any) => {
			let answeredCount = 0;
			let warnings = a.violation_count || 0;
			let warningLogs: any[] = [];
			const status = a.status || 'belum_mengerjakan';

			if (a.attempt_id) {
				answeredCount = answeredCountsMap[a.attempt_id] || 0;
			}

			try {
				warningLogs = a.violation_logs ? JSON.parse(a.violation_logs) : [];
			} catch (e) {}

			return {
				...a,
				id: a.attempt_id || `no_attempt_${a.student_id}`,
				attempt_id: a.attempt_id,
				status,
				answeredCount,
				warnings,
				warningLogs,
				is_paused: a.is_paused,
				paused_at: a.paused_at
			};
		});

		return json({ attempts: attemptsWithProgress });
	} catch (e: any) {
		return json({ error: e.message || String(e) }, { status: 500 });
	}
};
