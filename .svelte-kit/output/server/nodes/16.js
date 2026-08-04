import * as server from '../entries/pages/admin/results/_page.server.ts.js';

export const index = 16;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/results/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/results/+page.server.ts";
export const imports = ["_app/immutable/nodes/16.Dw_ZT0Qu.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/C7rm3sdM.js","_app/immutable/chunks/DEmwldwl.js","_app/immutable/chunks/ImmirkrM.js","_app/immutable/chunks/D0MExRDy.js","_app/immutable/chunks/D5i4tHJP.js","_app/immutable/chunks/D3CMJIOc.js","_app/immutable/chunks/DJXfu_Jv.js","_app/immutable/chunks/C6PEVhww.js","_app/immutable/chunks/DNeMqas3.js","_app/immutable/chunks/DyZqF2Qt.js","_app/immutable/chunks/CARY7BSv.js","_app/immutable/chunks/uSL-mgIf.js","_app/immutable/chunks/B6Zao61k.js","_app/immutable/chunks/B8sb82-p.js","_app/immutable/chunks/CWhSAF0N.js","_app/immutable/chunks/N3w58_qc.js","_app/immutable/chunks/bUId8id0.js","_app/immutable/chunks/DVcULqr7.js","_app/immutable/chunks/DBC4lBlS.js","_app/immutable/chunks/DxJcVmM5.js","_app/immutable/chunks/CWmKfMts.js","_app/immutable/chunks/DpA0yPAI.js"];
export const stylesheets = [];
export const fonts = [];
