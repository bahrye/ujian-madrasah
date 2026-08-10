import { redirect } from "@sveltejs/kit";
const load = async ({ locals, url }) => {
  if (!locals.user || locals.user.role !== "admin" && locals.user.role !== "panitia") {
    throw redirect(302, "/login");
  }
  if (locals.user.role === "panitia") {
    const restrictedPaths = ["/admin/school-profile", "/admin/users", "/admin/students", "/admin/classes"];
    if (restrictedPaths.some((path) => url.pathname.startsWith(path))) {
      throw redirect(302, "/admin");
    }
  }
  return { user: locals.user };
};
export {
  load
};
