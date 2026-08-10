import { redirect } from "@sveltejs/kit";
const load = async ({ locals }) => {
  if (!locals.user || locals.user.role !== "siswa") throw redirect(302, "/login");
  return { user: locals.user };
};
export {
  load
};
