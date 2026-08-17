import { json } from "@sveltejs/kit";
const GET = async ({ locals }) => {
  if (!locals.user) {
    return json({ ok: false }, { status: 401 });
  }
  return json({ ok: true, last_active_at: (/* @__PURE__ */ new Date()).toISOString() });
};
const POST = GET;
export {
  GET,
  POST
};
