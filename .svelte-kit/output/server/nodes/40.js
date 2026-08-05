import * as server from '../entries/pages/siswa/papan-peringkat/_page.server.ts.js';

export const index = 40;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/siswa/papan-peringkat/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/siswa/papan-peringkat/+page.server.ts";
export const imports = ["_app/immutable/nodes/40.DaABDeZJ.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/C7rm3sdM.js","_app/immutable/chunks/DEmwldwl.js","_app/immutable/chunks/ImmirkrM.js","_app/immutable/chunks/D0MExRDy.js","_app/immutable/chunks/D5i4tHJP.js","_app/immutable/chunks/D3CMJIOc.js","_app/immutable/chunks/DJXfu_Jv.js","_app/immutable/chunks/DyZqF2Qt.js","_app/immutable/chunks/CARY7BSv.js","_app/immutable/chunks/uSL-mgIf.js","_app/immutable/chunks/B6Zao61k.js"];
export const stylesheets = [];
export const fonts = [];
