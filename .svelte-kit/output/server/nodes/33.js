import * as server from '../entries/pages/siswa/ujian/_page.server.ts.js';

export const index = 33;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/siswa/ujian/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/siswa/ujian/+page.server.ts";
export const imports = ["_app/immutable/nodes/33.CJQkPAfr.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DTI0Se7w.js","_app/immutable/chunks/B-m1hCzt.js","_app/immutable/chunks/DbD9IbZI.js","_app/immutable/chunks/CQCwlsVV.js","_app/immutable/chunks/DA7HkAFo.js","_app/immutable/chunks/Hej8uFVW.js","_app/immutable/chunks/COqa9KOH.js","_app/immutable/chunks/Cf_qrmRJ.js","_app/immutable/chunks/pjnrDu98.js","_app/immutable/chunks/wHeWtbPT.js","_app/immutable/chunks/DrThIlpR.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/Bid1EWMa.js","_app/immutable/chunks/DBWUiwG_.js"];
export const stylesheets = [];
export const fonts = [];
