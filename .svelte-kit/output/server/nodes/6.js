import * as server from '../entries/pages/superadmin/_layout.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/superadmin/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/superadmin/+layout.server.ts";
export const imports = ["_app/immutable/nodes/6.DKbkbQ-w.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CAjP18Ge.js","_app/immutable/chunks/y0xFwr1q.js","_app/immutable/chunks/HCNHipAC.js","_app/immutable/chunks/CV_C-Nge.js","_app/immutable/chunks/C5KoRX2V.js","_app/immutable/chunks/BFwhDwQg.js","_app/immutable/chunks/YjMtvMK2.js","_app/immutable/chunks/gt1eaaSO.js","_app/immutable/chunks/V6MYtU-T.js","_app/immutable/chunks/BUniDjUn.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/qaYCfNHE.js","_app/immutable/chunks/CvnXg3Ez.js","_app/immutable/chunks/2w7cnp91.js","_app/immutable/chunks/yBr5iUJ-.js","_app/immutable/chunks/Bz7Ruf3u.js","_app/immutable/chunks/CqUTEu1o.js","_app/immutable/chunks/b1r6rFa3.js","_app/immutable/chunks/CSSeAi8f.js"];
export const stylesheets = [];
export const fonts = [];
