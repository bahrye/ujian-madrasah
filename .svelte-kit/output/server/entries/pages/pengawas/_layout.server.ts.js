import { redirect } from "@sveltejs/kit";
const load = async ({ locals }) => {
  if (!locals.user || locals.user.role !== "pengawas" && locals.user.role !== "guru" && locals.user.role !== "admin") {
    throw redirect(302, "/login");
  }
  return { user: locals.user };
};
export {
  load
};
