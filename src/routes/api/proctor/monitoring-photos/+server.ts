import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDB } from '$lib/server/db';
import { getMonitoringPhotos } from '$lib/server/monitoring';

export const GET: RequestHandler = async ({ url, platform, locals }) => {
	if (!locals.user || !['superadmin', 'admin', 'pengawas', 'guru', 'panitia'].includes(locals.user.role)) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const db = getDB(platform);
	const examIdStr = url.searchParams.get('exam_id');
	const studentIdStr = url.searchParams.get('student_id');
	const attemptIdStr = url.searchParams.get('attempt_id');

	const examId = examIdStr ? parseInt(examIdStr, 10) : undefined;
	const studentId = studentIdStr ? parseInt(studentIdStr, 10) : undefined;
	const attemptId = attemptIdStr ? parseInt(attemptIdStr, 10) : undefined;

	if (!examId && !studentId && !attemptId) {
		return json({ error: 'Parameter tidak lengkap' }, { status: 400 });
	}

	const isSuperAdmin = locals.user.role === 'superadmin' || locals.user.school_id === null;
	const isAdmin = locals.user.role === 'admin';

	if (!isSuperAdmin) {
		if (isAdmin) {
			if (examId) {
				const check = await db.prepare(`SELECT 1 FROM exams WHERE id = ? AND school_id = ?`).bind(examId, locals.user.school_id).first();
				if (!check) return json({ error: 'Forbidden' }, { status: 403 });
			}
		} else {
			if (examId) {
				const proctorCheck = await db.prepare(`
					SELECT 1 FROM exams e
					JOIN exam_proctors ep ON e.id = ep.exam_id AND ep.proctor_id = ? AND COALESCE(ep.proctor_role, 'p1') NOT IN ('pt', 'cm')
					WHERE e.id = ? AND e.school_id = ?
				`).bind(locals.user.id, examId, locals.user.school_id).first();
				if (!proctorCheck) return json({ error: 'Forbidden: Anda tidak ditugaskan untuk ujian ini.' }, { status: 403 });
			} else if (attemptId) {
				const proctorCheck = await db.prepare(`
					SELECT 1 FROM student_attempts sa
					JOIN exams e ON sa.exam_id = e.id
					JOIN exam_proctors ep ON e.id = ep.exam_id AND ep.proctor_id = ? AND COALESCE(ep.proctor_role, 'p1') NOT IN ('pt', 'cm')
					WHERE sa.id = ? AND e.school_id = ?
				`).bind(locals.user.id, attemptId, locals.user.school_id).first();
				if (!proctorCheck) return json({ error: 'Forbidden: Anda tidak ditugaskan untuk ujian ini.' }, { status: 403 });
			}
		}
	}

	try {
		const photos = await getMonitoringPhotos(db, {
			examId: isNaN(examId as any) ? undefined : examId,
			studentId: isNaN(studentId as any) ? undefined : studentId,
			attemptId: isNaN(attemptId as any) ? undefined : attemptId,
			limit: 100
		});

		return json({ success: true, photos });
	} catch (err: any) {
		console.error('API proctor monitoring-photos error:', err);
		return json({ error: 'Gagal memuat foto pengawasan: ' + (err?.message || '') }, { status: 500 });
	}
};
