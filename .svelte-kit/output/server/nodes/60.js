import * as server from '../entries/pages/superadmin/_page.server.ts.js';

export const index = 60;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/superadmin/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/superadmin/+page.server.ts";
export const imports = ["_app/immutable/nodes/60.DCljDaNf.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BVZgrqP0.js","_app/immutable/chunks/BhtR-1bA.js","_app/immutable/chunks/BkiEJhJY.js","_app/immutable/chunks/B0viW3RP.js","_app/immutable/chunks/DoWNjUKu.js","_app/immutable/chunks/Ba_0fM9c.js","_app/immutable/chunks/CS0AuOdv.js","_app/immutable/chunks/BjO-JN_a.js","_app/immutable/chunks/BcxQjlfB.js","_app/immutable/chunks/B5B0iv_m.js","_app/immutable/chunks/CjGyJir6.js","_app/immutable/chunks/C6Ke9T9B.js","_app/immutable/chunks/CeoUgidO.js","_app/immutable/chunks/DX4-oXAc.js","_app/immutable/chunks/B5xf_oRu.js","_app/immutable/chunks/DgSQwxXL.js"];
export const stylesheets = [];
export const fonts = [];
