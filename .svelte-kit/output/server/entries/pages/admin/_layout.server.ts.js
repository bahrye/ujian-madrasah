import { redirect } from "@sveltejs/kit";
const load = async ({ locals }) => {
  if (!locals.user || locals.user.role !== "admin" && locals.user.role !== "panitia") {
    throw redirect(302, "/login");
  }
  return { user: locals.user };
};
export {
  load
};
