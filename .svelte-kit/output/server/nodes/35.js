import * as server from '../entries/pages/siswa/ujian/_page.server.ts.js';

export const index = 35;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/siswa/ujian/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/siswa/ujian/+page.server.ts";
export const imports = ["_app/immutable/nodes/35._UJa8tmO.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CAjP18Ge.js","_app/immutable/chunks/y0xFwr1q.js","_app/immutable/chunks/BFwhDwQg.js","_app/immutable/chunks/C5KoRX2V.js","_app/immutable/chunks/BekNSgyH.js","_app/immutable/chunks/CSVsvAa2.js","_app/immutable/chunks/Cvp96lhY.js","_app/immutable/chunks/yBr5iUJ-.js","_app/immutable/chunks/CGOS4njP.js","_app/immutable/chunks/CV_C-Nge.js","_app/immutable/chunks/DC9ZZIuL.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/qaYCfNHE.js","_app/immutable/chunks/CqUTEu1o.js"];
export const stylesheets = [];
export const fonts = [];
