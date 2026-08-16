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
				sa.paused_at
			FROM exam_participants epart
			JOIN users u ON epart.student_id = u.id
			JOIN exams e ON epart.exam_id = e.id
			LEFT JOIN student_attempts sa ON sa.student_id = epart.student_id AND sa.exam_id = epart.exam_id
			WHERE epart.exam_id = ? AND e.school_id = ?
		`;

		const bindings: any[] = [examId, locals.user.school_id];

		if (!isNaN(sessionFilter)) {
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
				WHERE st.exam_id = ? AND sa.answer_given IS NOT NULL AND sa.answer_given != ''
				GROUP BY sa.attempt_id
			`).bind(examId).all();
			
			(countsResult.results || []).forEach((r: any) => {
				answeredCountsMap[r.attempt_id] = r.c;
			});
		}

		const kv = platform?.env?.EXAM_ANSWERS;
		const attemptsWithProgress = await Promise.all(
			attempts.map(async (a: any) => {
				let answeredCount = 0;
				let warnings = 0;
				let warningLogs: any[] = [];
				const status = a.status || 'belum_mengerjakan';

				if (status === 'mengerjakan') {
					if (kv && a.attempt_id) {
						try {
							const stored = await kv.get(`attempt_${a.attempt_id}_answers`);
							if (stored) {
								const data = JSON.parse(stored);
								if (data && data.answers) {
									answeredCount = Object.values(data.answers).filter(val => val !== null && val !== '').length;
								}
								if (data && data.warnings) warnings = data.warnings;
								if (data && data.warningLogs) warningLogs = data.warningLogs;
							}
						} catch (e) {
							console.error("KV get error:", e);
						}
					}
					if (answeredCount === 0 && a.attempt_id) {
						answeredCount = answeredCountsMap[a.attempt_id] || 0;
					}
					if (warnings === 0) {
						warnings = a.violation_count || 0;
						try { warningLogs = a.violation_logs ? JSON.parse(a.violation_logs) : []; } catch(e) {}
					}
				} else if (status === 'selesai' || status === 'waktu_habis') {
					warnings = a.violation_count || 0;
					try { warningLogs = a.violation_logs ? JSON.parse(a.violation_logs) : []; } catch(e) {}
					if (a.attempt_id) {
						answeredCount = answeredCountsMap[a.attempt_id] || 0;
					}
				}

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
			})
		);

		return json({ attempts: attemptsWithProgress });
	} catch (e: any) {
		return json({ error: e.message || String(e) }, { status: 500 });
	}
};
