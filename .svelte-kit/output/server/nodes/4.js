import * as server from '../entries/pages/pengawas/_layout.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/pengawas/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/pengawas/+layout.server.ts";
export const imports = ["_app/immutable/nodes/4.Dp92_Twn.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BSevKU_i.js","_app/immutable/chunks/C1iwYQEC.js","_app/immutable/chunks/CUSFT32i.js","_app/immutable/chunks/iHfl78vX.js","_app/immutable/chunks/RbyIVtyM.js","_app/immutable/chunks/qu17wuJm.js","_app/immutable/chunks/BPD4iswW.js","_app/immutable/chunks/OpSEfI_X.js","_app/immutable/chunks/C4l_QUTv.js","_app/immutable/chunks/klE4_vFh.js","_app/immutable/chunks/s8-Vb9Km.js","_app/immutable/chunks/Bjc80sd8.js","_app/immutable/chunks/CSSbYJ54.js","_app/immutable/chunks/B5xf_oRu.js","_app/immutable/chunks/CuwpHZtE.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/BxORRXy4.js","_app/immutable/chunks/pT-bLRZM.js","_app/immutable/chunks/DFCHkf6l.js","_app/immutable/chunks/CAmwAEK5.js","_app/immutable/chunks/40SUH7QX.js","_app/immutable/chunks/DHwQuxsm.js","_app/immutable/chunks/CHSUS2YH.js","_app/immutable/chunks/BVq1Mgit.js","_app/immutable/chunks/sH0DAvFM.js","_app/immutable/chunks/DbPvmzWc.js","_app/immutable/chunks/K6ZIGRAq.js"];
export const stylesheets = [];
export const fonts = [];
