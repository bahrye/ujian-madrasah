import { g as getDB } from "../../../chunks/db.js";
const load = async ({ platform, locals }) => {
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
  const roleCounts = {};
  for (const r of userCounts.results) {
    roleCounts[r.role] = Number(r.count || 0);
  }
  return {
    stats: {
      totalUsers: Object.values(roleCounts).reduce((a, b) => a + Number(b), 0),
      roleCounts,
      totalExams: Number(examStats?.total ?? 0),
      activeExams: Number(examStats?.active ?? 0),
      totalAttempts: Number(attemptStats?.total ?? 0),
      sedangMengerjakan: Number(attemptStats?.sedang_mengerjakan ?? 0),
      selesai: Number(attemptStats?.selesai ?? 0)
    },
    recentAttempts: recentAttempts.results
  };
};
export {
  load
};
