import * as server from '../entries/pages/admin/bank-soal/_page.server.ts.js';

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/bank-soal/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/bank-soal/+page.server.ts";
export const imports = ["_app/immutable/nodes/9.vQLw3b-3.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DTI0Se7w.js","_app/immutable/chunks/B-m1hCzt.js","_app/immutable/chunks/DbD9IbZI.js","_app/immutable/chunks/CQCwlsVV.js","_app/immutable/chunks/MtbvIQbS.js","_app/immutable/chunks/DA7HkAFo.js","_app/immutable/chunks/fJ_C4mTp.js","_app/immutable/chunks/7tyrtqFX.js","_app/immutable/chunks/Cf_qrmRJ.js","_app/immutable/chunks/CKbQ1Fcp.js","_app/immutable/chunks/wHeWtbPT.js","_app/immutable/chunks/B0fnQzBR.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/DBWUiwG_.js"];
export const stylesheets = [];
export const fonts = [];
