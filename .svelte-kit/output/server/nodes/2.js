import * as server from '../entries/pages/admin/_layout.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/+layout.server.ts";
export const imports = ["_app/immutable/nodes/2.DsRw0zrt.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BSevKU_i.js","_app/immutable/chunks/C1iwYQEC.js","_app/immutable/chunks/CUSFT32i.js","_app/immutable/chunks/iHfl78vX.js","_app/immutable/chunks/RbyIVtyM.js","_app/immutable/chunks/qu17wuJm.js","_app/immutable/chunks/BPD4iswW.js","_app/immutable/chunks/DHXZ75Dd.js","_app/immutable/chunks/CpNQxTAW.js","_app/immutable/chunks/klE4_vFh.js","_app/immutable/chunks/s8-Vb9Km.js","_app/immutable/chunks/BR4BVl1u.js","_app/immutable/chunks/CSSbYJ54.js","_app/immutable/chunks/B5xf_oRu.js","_app/immutable/chunks/CuwpHZtE.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/BxORRXy4.js","_app/immutable/chunks/9rvYIL_B.js","_app/immutable/chunks/B4ltrorS.js","_app/immutable/chunks/CWu7Ay1j.js","_app/immutable/chunks/D0g6almG.js","_app/immutable/chunks/DHwQuxsm.js","_app/immutable/chunks/V0KB74q8.js","_app/immutable/chunks/BVq1Mgit.js","_app/immutable/chunks/O-HmUUsL.js","_app/immutable/chunks/DbPvmzWc.js","_app/immutable/chunks/nxk2v996.js"];
export const stylesheets = [];
export const fonts = [];
