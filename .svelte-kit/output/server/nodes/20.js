import * as server from '../entries/pages/guru/_page.server.ts.js';

export const index = 20;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/guru/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/guru/+page.server.ts";
export const imports = ["_app/immutable/nodes/20.DKtv6iwA.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CAjP18Ge.js","_app/immutable/chunks/y0xFwr1q.js","_app/immutable/chunks/BFwhDwQg.js","_app/immutable/chunks/gt1eaaSO.js","_app/immutable/chunks/BekNSgyH.js","_app/immutable/chunks/CV_C-Nge.js","_app/immutable/chunks/C5KoRX2V.js","_app/immutable/chunks/DBjwXP7p.js","_app/immutable/chunks/BUniDjUn.js","_app/immutable/chunks/CqUTEu1o.js"];
export const stylesheets = [];
export const fonts = [];
