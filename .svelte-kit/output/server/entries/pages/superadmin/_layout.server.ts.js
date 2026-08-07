import { redirect } from "@sveltejs/kit";
const load = async ({ locals }) => {
  if (!locals.user) {
    throw redirect(302, "/login");
  }
  if (locals.user.role !== "superadmin") {
    throw redirect(302, `/${locals.user.role}`);
  }
  return {
    user: locals.user
  };
};
export {
  load
};
