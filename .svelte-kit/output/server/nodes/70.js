import * as server from '../entries/pages/siswa/_page.server.ts.js';

export const index = 70;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/siswa/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/siswa/+page.server.ts";
export const imports = ["_app/immutable/nodes/70.CBxYxmej.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BSevKU_i.js","_app/immutable/chunks/C1iwYQEC.js","_app/immutable/chunks/CWu7Ay1j.js","_app/immutable/chunks/CpNQxTAW.js","_app/immutable/chunks/klE4_vFh.js","_app/immutable/chunks/s8-Vb9Km.js","_app/immutable/chunks/DEDvlLfQ.js","_app/immutable/chunks/CSSbYJ54.js","_app/immutable/chunks/B5xf_oRu.js","_app/immutable/chunks/CuwpHZtE.js","_app/immutable/chunks/iHfl78vX.js","_app/immutable/chunks/RbyIVtyM.js","_app/immutable/chunks/qu17wuJm.js","_app/immutable/chunks/BPD4iswW.js","_app/immutable/chunks/D0g6almG.js","_app/immutable/chunks/DbPvmzWc.js","_app/immutable/chunks/iQAfk_ag.js","_app/immutable/chunks/9TD99rmk.js"];
export const stylesheets = [];
export const fonts = [];
