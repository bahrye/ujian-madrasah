import { g as getDB } from "../../../chunks/db.js";
const load = async ({ platform }) => {
  const db = getDB(platform);
  const totalSchoolsRes = await db.prepare("SELECT COUNT(*) as count FROM schools").first();
  const totalSchools = totalSchoolsRes?.count || 0;
  const totalAdminsRes = await db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'admin'").first();
  const totalAdmins = totalAdminsRes?.count || 0;
  const { results: recentSchools } = await db.prepare("SELECT * FROM schools ORDER BY created_at DESC LIMIT 5").all();
  return {
    totalSchools,
    totalAdmins,
    recentSchools
  };
};
export {
  load
};
