import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDB } from '$lib/server/db';

export const POST: RequestHandler = async ({ request, platform, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const db = getDB(platform);

	let attemptId: number | null = null;
	let violationType = 'Melakukan pelanggaran ujian';

	const contentType = request.headers.get('content-type') || '';
	try {
		if (contentType.includes('application/json')) {
			const body = (await request.json()) as any;
			attemptId = parseInt(body.attempt_id, 10);
			if (body.violation_type) violationType = String(body.violation_type);
		} else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
			const formData = await request.formData();
			attemptId = parseInt(formData.get('attempt_id')?.toString() || '', 10);
			const typeVal = formData.get('violation_type')?.toString();
			if (typeVal) violationType = typeVal;
		} else {
			// Fallback text / blob parser (common for navigator.sendBeacon)
			const text = await request.text();
			try {
				const body = JSON.parse(text);
				attemptId = parseInt(body.attempt_id, 10);
				if (body.violation_type) violationType = String(body.violation_type);
			} catch {
				const params = new URLSearchParams(text);
				attemptId = parseInt(params.get('attempt_id') || '', 10);
				const typeVal = params.get('violation_type');
				if (typeVal) violationType = typeVal;
			}
		}
	} catch (e: any) {
		return json({ error: 'Format data tidak valid' }, { status: 400 });
	}

	if (!attemptId || isNaN(attemptId)) {
		return json({ error: 'ID attempt tidak valid' }, { status: 400 });
	}

	try {
		// Verifikasi attempt milik siswa
		const attempt = await db.prepare(`
			SELECT id, status, violation_count, violation_logs 
			FROM student_attempts 
			WHERE id = ? AND student_id = ?
		`).bind(attemptId, locals.user.id).first<any>();

		if (!attempt) {
			return json({ error: 'Sesi ujian tidak ditemukan' }, { status: 404 });
		}

		if (attempt.status !== 'mengerjakan') {
			return json({ error: 'Ujian sudah tidak aktif' }, { status: 400 });
		}

		let logs: any[] = [];
		try {
			if (attempt.violation_logs) {
				logs = JSON.parse(attempt.violation_logs);
			}
		} catch {}

		logs.push({
			time: Date.now(),
			type: violationType
		});

		const newViolationCount = (attempt.violation_count || 0) + 1;
		const updatedLogsStr = JSON.stringify(logs);

		await db.prepare(`
			UPDATE student_attempts 
			SET violation_count = ?, 
			    violation_logs = ?, 
			    updated_at = datetime('now')
			WHERE id = ? AND student_id = ?
		`).bind(newViolationCount, updatedLogsStr, attemptId, locals.user.id).run();

		return json({
			success: true,
			violation_count: newViolationCount,
			violation_logs: logs
		});
	} catch (e: any) {
		console.error('Error in log-violation endpoint:', e);
		return json({ error: 'Gagal mencatat pelanggaran: ' + (e?.message || '') }, { status: 500 });
	}
};
