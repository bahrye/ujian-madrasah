import { redirect } from "@sveltejs/kit";
const load = async ({ locals }) => {
  if (!locals.user || !["superadmin", "admin", "guru", "panitia"].includes(locals.user.role)) {
    throw redirect(302, "/login");
  }
  return { user: locals.user };
};
export {
  load
};
