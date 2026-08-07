import { redirect } from "@sveltejs/kit";
const load = async ({ locals }) => {
  if (locals.user) {
    throw redirect(302, `/${locals.user.role}`);
  }
  throw redirect(302, "/login");
};
export {
  load
};
