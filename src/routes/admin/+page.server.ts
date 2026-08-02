import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load: PageServerLoad = async ({ platform, locals }) => {
	const db = getDB(platform);
	const schoolId = locals.user?.school_id;

	const [userCounts, examStats, attemptStats, recentAttempts] = await Promise.all([
		db.prepare(`SELECT role, COUNT(*) as count FROM users WHERE school_id = ? GROUP BY role`).bind(schoolId).all(),
		db.prepare(`SELECT
			COUNT(*) as total,
			SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active
			FROM exams WHERE school_id = ?`).bind(schoolId).first(),
		db.prepare(`SELECT
			COUNT(*) as total,
			SUM(CASE WHEN status = 'mengerjakan' THEN 1 ELSE 0 END) as sedang_mengerjakan,
			SUM(CASE WHEN status = 'selesai' THEN 1 ELSE 0 END) as selesai
			FROM student_attempts sa
			JOIN exams e ON sa.exam_id = e.id
			WHERE e.school_id = ?`).bind(schoolId).first(),
		db.prepare(`SELECT sa.*, u.name as student_name, e.title as exam_title
			FROM student_attempts sa
			JOIN users u ON sa.student_id = u.id
			JOIN exams e ON sa.exam_id = e.id
			WHERE e.school_id = ?
			ORDER BY sa.created_at DESC LIMIT 10`).bind(schoolId).all()
	]);

	const roleCounts: Record<string, number> = {};
	for (const r of userCounts.results as Array<{ role: string; count: number }>) {
		roleCounts[r.role] = r.count;
	}

	return {
		stats: {
			totalUsers: Object.values(roleCounts).reduce((a, b) => a + b, 0),
			roleCounts,
			totalExams: (examStats as any)?.total ?? 0,
			activeExams: (examStats as any)?.active ?? 0,
			totalAttempts: (attemptStats as any)?.total ?? 0,
			sedangMengerjakan: (attemptStats as any)?.sedang_mengerjakan ?? 0,
			selesai: (attemptStats as any)?.selesai ?? 0,
		},
		recentAttempts: recentAttempts.results
	};
};
