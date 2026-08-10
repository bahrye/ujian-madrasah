import { redirect } from "@sveltejs/kit";
const load = async ({ locals }) => {
  if (!locals.user || locals.user.role !== "pengawas") throw redirect(302, "/login");
  return { user: locals.user };
};
export {
  load
};
