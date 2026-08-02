import { g as getDB } from "../../../chunks/db.js";
const load = async ({ platform }) => {
  const db = getDB(platform);
  const [activeExams, tokenCount, activeAttempts] = await Promise.all([
    db.prepare("SELECT COUNT(*) as c FROM exams WHERE is_active = 1").first(),
    db.prepare("SELECT COUNT(*) as c FROM tokens").first(),
    db.prepare("SELECT COUNT(*) as c FROM student_attempts WHERE status = 'mengerjakan'").first()
  ]);
  return {
    stats: {
      activeExams: activeExams?.c ?? 0,
      totalTokens: tokenCount?.c ?? 0,
      activeAttempts: activeAttempts?.c ?? 0
    }
  };
};
export {
  load
};
