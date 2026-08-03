import * as server from '../entries/pages/pengawas/tokens/_page.server.ts.js';

export const index = 32;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/pengawas/tokens/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/pengawas/tokens/+page.server.ts";
export const imports = ["_app/immutable/nodes/32.lrP_aM33.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CAjP18Ge.js","_app/immutable/chunks/y0xFwr1q.js","_app/immutable/chunks/yBr5iUJ-.js","_app/immutable/chunks/BFwhDwQg.js","_app/immutable/chunks/C5KoRX2V.js","_app/immutable/chunks/gt1eaaSO.js","_app/immutable/chunks/BekNSgyH.js","_app/immutable/chunks/CKArgke8.js","_app/immutable/chunks/BpBLeDV4.js","_app/immutable/chunks/C4stalzo.js","_app/immutable/chunks/CV_C-Nge.js","_app/immutable/chunks/BUniDjUn.js","_app/immutable/chunks/CQM7iWEo.js","_app/immutable/chunks/CqUTEu1o.js","_app/immutable/chunks/CSSeAi8f.js","_app/immutable/chunks/Bjpl6me5.js"];
export const stylesheets = [];
export const fonts = [];
