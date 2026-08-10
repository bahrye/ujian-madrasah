import { redirect } from "@sveltejs/kit";
import { C as COOKIE_NAME } from "../../../../chunks/auth.js";
const GET = async ({ cookies }) => {
  cookies.delete(COOKIE_NAME, { path: "/" });
  throw redirect(302, "/login");
};
export {
  GET
};
