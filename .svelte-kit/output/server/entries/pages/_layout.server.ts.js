import { g as getDB } from "../../chunks/db.js";
const load = async ({ locals, platform }) => {
  let userInfo = null;
  if (locals.user && platform) {
    const db = getDB(platform);
    userInfo = {};
    if (locals.user.school_id) {
      const school = await db.prepare("SELECT name FROM schools WHERE id = ?").bind(locals.user.school_id).first();
      if (school) userInfo.school_name = school.name;
    }
    if (locals.user.role === "siswa") {
      const student = await db.prepare("SELECT place_of_birth, date_of_birth FROM users WHERE id = ?").bind(locals.user.id).first();
      if (student) {
        userInfo.place_of_birth = student.place_of_birth;
        userInfo.date_of_birth = student.date_of_birth;
      }
    }
  }
  return {
    user: locals.user,
    userInfo
  };
};
export {
  load
};
