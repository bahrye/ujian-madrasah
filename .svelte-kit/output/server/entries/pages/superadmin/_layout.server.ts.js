import { redirect } from "@sveltejs/kit";
const load = async ({ locals }) => {
  if (!locals.user) {
    throw redirect(302, "/login");
  }
  if (locals.user.role !== "superadmin") {
    const redirectRoute = locals.user.role === "panitia" ? "/admin" : `/${locals.user.role}`;
    throw redirect(302, redirectRoute);
  }
  return {
    user: locals.user
  };
};
export {
  load
};
