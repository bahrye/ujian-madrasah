import * as server from '../entries/pages/admin/_layout.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/+layout.server.ts";
export const imports = ["_app/immutable/nodes/2.CFw_qLr_.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/UDcyT5dE.js","_app/immutable/chunks/DsjVLxFs.js","_app/immutable/chunks/8-niJkTq.js","_app/immutable/chunks/D9dL3ymz.js","_app/immutable/chunks/BSSW4fmP.js","_app/immutable/chunks/CFsR1-3_.js","_app/immutable/chunks/BajGDXqa.js","_app/immutable/chunks/BXVjZ1zt.js","_app/immutable/chunks/vU2YrzcE.js","_app/immutable/chunks/D5QCWm8k.js","_app/immutable/chunks/5X7QIpkU.js","_app/immutable/chunks/yZiemI-_.js","_app/immutable/chunks/yAu4mK0w.js","_app/immutable/chunks/B5xf_oRu.js","_app/immutable/chunks/Dgkh7M1X.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/DRglPlYD.js","_app/immutable/chunks/DM-Ue4Hs.js","_app/immutable/chunks/DWGDU4Mk.js","_app/immutable/chunks/Bp3hrXGM.js","_app/immutable/chunks/ByCxIQxX.js","_app/immutable/chunks/BxTaywFo.js","_app/immutable/chunks/DDe9bGR5.js","_app/immutable/chunks/DbPvmzWc.js","_app/immutable/chunks/SJYM7Da2.js"];
export const stylesheets = [];
export const fonts = [];
