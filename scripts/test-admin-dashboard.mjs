import { getDB } from '../src/lib/server/db.ts';
import dotenv from 'dotenv';

dotenv.config();

async function testDashboard() {
	const db = getDB();
	const schoolId = 2; // MTS TANUNTUNG

	const [userCounts, examStats, attemptStats] = await Promise.all([
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
			WHERE e.school_id = ?`).bind(schoolId).first()
	]);

	const roleCounts = {};
	for (const r of userCounts.results) {
		roleCounts[r.role] = Number(r.count || 0);
	}
	const totalUsers = Object.values(roleCounts).reduce((a, b) => a + Number(b), 0);

	console.log('User counts results:', userCounts.results);
	console.log('Role counts map:', roleCounts);
	console.log('Total Users:', totalUsers, typeof totalUsers);
	console.log('Exam stats:', examStats);
	console.log('Attempt stats:', attemptStats);
}

testDashboard();
