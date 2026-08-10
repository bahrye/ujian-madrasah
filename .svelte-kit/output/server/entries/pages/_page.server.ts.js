import { redirect } from "@sveltejs/kit";
const load = async ({ locals }) => {
  if (locals.user) {
    const redirectRoute = locals.user.role === "panitia" ? "/admin" : `/${locals.user.role}`;
    throw redirect(302, redirectRoute);
  }
  throw redirect(302, "/login");
};
export {
  load
};
