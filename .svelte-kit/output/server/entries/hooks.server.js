import "@sveltejs/kit";
import { C as COOKIE_NAME, v as verifyToken } from "../chunks/auth.js";
const handle = async ({ event, resolve }) => {
  const token = event.cookies.get(COOKIE_NAME);
  if (token) {
    const user = await verifyToken(token);
    event.locals.user = user;
  } else {
    event.locals.user = null;
  }
  return resolve(event);
};
export {
  handle
};
