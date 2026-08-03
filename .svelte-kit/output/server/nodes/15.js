import * as server from '../entries/pages/admin/results/_page.server.ts.js';

export const index = 15;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/results/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/results/+page.server.ts";
export const imports = ["_app/immutable/nodes/15.D7thDmrG.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CAjP18Ge.js","_app/immutable/chunks/y0xFwr1q.js","_app/immutable/chunks/BFwhDwQg.js","_app/immutable/chunks/C5KoRX2V.js","_app/immutable/chunks/gt1eaaSO.js","_app/immutable/chunks/BekNSgyH.js","_app/immutable/chunks/CV_C-Nge.js","_app/immutable/chunks/BUniDjUn.js","_app/immutable/chunks/BpBLeDV4.js","_app/immutable/chunks/yBr5iUJ-.js","_app/immutable/chunks/CqUTEu1o.js","_app/immutable/chunks/IuMx-wfa.js","_app/immutable/chunks/HCNHipAC.js","_app/immutable/chunks/V6MYtU-T.js","_app/immutable/chunks/CKArgke8.js","_app/immutable/chunks/C4stalzo.js","_app/immutable/chunks/wcfBa8WU.js"];
export const stylesheets = [];
export const fonts = [];
