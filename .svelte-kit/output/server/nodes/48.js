import * as server from '../entries/pages/guru/results/_page.server.ts.js';

export const index = 48;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/guru/results/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/guru/results/+page.server.ts";
export const imports = ["_app/immutable/nodes/48.C-vABL8i.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BSevKU_i.js","_app/immutable/chunks/C1iwYQEC.js","_app/immutable/chunks/CAmwAEK5.js","_app/immutable/chunks/C4l_QUTv.js","_app/immutable/chunks/klE4_vFh.js","_app/immutable/chunks/s8-Vb9Km.js","_app/immutable/chunks/DEDvlLfQ.js","_app/immutable/chunks/BVq1Mgit.js","_app/immutable/chunks/CSSbYJ54.js","_app/immutable/chunks/B5xf_oRu.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/iHfl78vX.js","_app/immutable/chunks/BxORRXy4.js","_app/immutable/chunks/RbyIVtyM.js","_app/immutable/chunks/qu17wuJm.js","_app/immutable/chunks/BPD4iswW.js","_app/immutable/chunks/DbPvmzWc.js","_app/immutable/chunks/yHpGbv25.js","_app/immutable/chunks/BMLHEEef.js","_app/immutable/chunks/BMIC__yH.js","_app/immutable/chunks/CKN5doRT.js","_app/immutable/chunks/D0g6almG.js","_app/immutable/chunks/DHwQuxsm.js"];
export const stylesheets = [];
export const fonts = [];
