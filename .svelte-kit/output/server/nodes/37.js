import * as server from '../entries/pages/superadmin/_page.server.ts.js';

export const index = 37;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/superadmin/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/superadmin/+page.server.ts";
export const imports = ["_app/immutable/nodes/37.B86eYuaj.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CAjP18Ge.js","_app/immutable/chunks/y0xFwr1q.js","_app/immutable/chunks/BFwhDwQg.js","_app/immutable/chunks/C5KoRX2V.js","_app/immutable/chunks/gt1eaaSO.js","_app/immutable/chunks/BekNSgyH.js","_app/immutable/chunks/CV_C-Nge.js","_app/immutable/chunks/DBjwXP7p.js","_app/immutable/chunks/BUniDjUn.js"];
export const stylesheets = [];
export const fonts = [];
