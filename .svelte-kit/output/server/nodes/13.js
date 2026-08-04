import * as server from '../entries/pages/admin/exams/_page.server.ts.js';

export const index = 13;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/exams/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/exams/+page.server.ts";
export const imports = ["_app/immutable/nodes/13._KDPpZpi.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/C7rm3sdM.js","_app/immutable/chunks/DEmwldwl.js","_app/immutable/chunks/ImmirkrM.js","_app/immutable/chunks/D0MExRDy.js","_app/immutable/chunks/D5i4tHJP.js","_app/immutable/chunks/D3CMJIOc.js","_app/immutable/chunks/DqDftVxX.js","_app/immutable/chunks/DoiA2Xim.js","_app/immutable/chunks/CWhSAF0N.js","_app/immutable/chunks/B6Zao61k.js","_app/immutable/chunks/A0i9hDHg.js","_app/immutable/chunks/DJXfu_Jv.js","_app/immutable/chunks/DynEsDKs.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/DyZqF2Qt.js","_app/immutable/chunks/Bch-uyOP.js","_app/immutable/chunks/CARY7BSv.js","_app/immutable/chunks/uSL-mgIf.js","_app/immutable/chunks/rr_SP2jx.js","_app/immutable/chunks/25i-u3Ft.js"];
export const stylesheets = [];
export const fonts = [];
