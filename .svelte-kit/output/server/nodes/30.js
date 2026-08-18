import * as server from '../entries/pages/admin/students/_page.server.ts.js';

export const index = 30;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/students/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/students/+page.server.ts";
export const imports = ["_app/immutable/nodes/30.DmiR60lr.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BSevKU_i.js","_app/immutable/chunks/C1iwYQEC.js","_app/immutable/chunks/C4l_QUTv.js","_app/immutable/chunks/klE4_vFh.js","_app/immutable/chunks/s8-Vb9Km.js","_app/immutable/chunks/DEDvlLfQ.js","_app/immutable/chunks/BVq1Mgit.js","_app/immutable/chunks/CSSbYJ54.js","_app/immutable/chunks/B5xf_oRu.js","_app/immutable/chunks/CuwpHZtE.js","_app/immutable/chunks/UFGtI_Eu.js","_app/immutable/chunks/CJQ_5s9f.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/iHfl78vX.js","_app/immutable/chunks/BxORRXy4.js","_app/immutable/chunks/RbyIVtyM.js","_app/immutable/chunks/qu17wuJm.js","_app/immutable/chunks/BPD4iswW.js","_app/immutable/chunks/CHlZv3A5.js","_app/immutable/chunks/Bni-47QB.js","_app/immutable/chunks/CAmwAEK5.js","_app/immutable/chunks/C9sWYPek.js","_app/immutable/chunks/B-1ar7TK.js","_app/immutable/chunks/CUSFT32i.js","_app/immutable/chunks/Bjc80sd8.js","_app/immutable/chunks/CKN5doRT.js","_app/immutable/chunks/DHwQuxsm.js","_app/immutable/chunks/DbPvmzWc.js","_app/immutable/chunks/DWzYw1H9.js","_app/immutable/chunks/D0g6almG.js","_app/immutable/chunks/NKFzYaFO.js"];
export const stylesheets = ["_app/immutable/assets/30.VB0kvX3s.css"];
export const fonts = [];
