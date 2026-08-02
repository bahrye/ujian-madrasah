import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load: PageServerLoad = async ({ platform }) => {
	const db = getDB(platform);

	const [activeExams, tokenCount, activeAttempts] = await Promise.all([
		db.prepare('SELECT COUNT(*) as c FROM exams WHERE is_active = 1').first<{ c: number }>(),
		db.prepare('SELECT COUNT(*) as c FROM tokens').first<{ c: number }>(),
		db.prepare("SELECT COUNT(*) as c FROM student_attempts WHERE status = 'mengerjakan'").first<{ c: number }>()
	]);

	return {
		stats: {
			activeExams: activeExams?.c ?? 0,
			totalTokens: tokenCount?.c ?? 0,
			activeAttempts: activeAttempts?.c ?? 0
		}
	};
};
