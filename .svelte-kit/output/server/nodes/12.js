import * as server from '../entries/pages/admin/classes/_page.server.ts.js';

export const index = 12;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/classes/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/classes/+page.server.ts";
export const imports = ["_app/immutable/nodes/12.BVG6KODr.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CAjP18Ge.js","_app/immutable/chunks/y0xFwr1q.js","_app/immutable/chunks/BFwhDwQg.js","_app/immutable/chunks/C5KoRX2V.js","_app/immutable/chunks/gt1eaaSO.js","_app/immutable/chunks/BekNSgyH.js","_app/immutable/chunks/BOqZ0cWP.js","_app/immutable/chunks/Bz7Ruf3u.js","_app/immutable/chunks/yBr5iUJ-.js","_app/immutable/chunks/2w7cnp91.js","_app/immutable/chunks/CV_C-Nge.js","_app/immutable/chunks/C4Ijd1lj.js","_app/immutable/chunks/HCNHipAC.js","_app/immutable/chunks/V6MYtU-T.js","_app/immutable/chunks/BUniDjUn.js","_app/immutable/chunks/wcfBa8WU.js","_app/immutable/chunks/CSSeAi8f.js"];
export const stylesheets = [];
export const fonts = [];
