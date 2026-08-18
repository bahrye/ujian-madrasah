import * as server from '../entries/pages/admin/_layout.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/+layout.server.ts";
export const imports = ["_app/immutable/nodes/2.C8K_qPyU.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BSevKU_i.js","_app/immutable/chunks/C1iwYQEC.js","_app/immutable/chunks/CUSFT32i.js","_app/immutable/chunks/iHfl78vX.js","_app/immutable/chunks/RbyIVtyM.js","_app/immutable/chunks/qu17wuJm.js","_app/immutable/chunks/BPD4iswW.js","_app/immutable/chunks/DkqfRub0.js","_app/immutable/chunks/C4l_QUTv.js","_app/immutable/chunks/klE4_vFh.js","_app/immutable/chunks/s8-Vb9Km.js","_app/immutable/chunks/Bjc80sd8.js","_app/immutable/chunks/CSSbYJ54.js","_app/immutable/chunks/B5xf_oRu.js","_app/immutable/chunks/CuwpHZtE.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/BxORRXy4.js","_app/immutable/chunks/BE9JljLY.js","_app/immutable/chunks/D9aDCxCX.js","_app/immutable/chunks/CAmwAEK5.js","_app/immutable/chunks/40SUH7QX.js","_app/immutable/chunks/DHwQuxsm.js","_app/immutable/chunks/CHSUS2YH.js","_app/immutable/chunks/BVq1Mgit.js","_app/immutable/chunks/DWzYw1H9.js","_app/immutable/chunks/DbPvmzWc.js","_app/immutable/chunks/K6ZIGRAq.js"];
export const stylesheets = [];
export const fonts = [];
