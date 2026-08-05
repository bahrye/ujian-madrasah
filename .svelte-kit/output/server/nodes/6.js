import * as server from '../entries/pages/superadmin/_layout.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/superadmin/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/superadmin/+layout.server.ts";
export const imports = ["_app/immutable/nodes/6.DeOAZ_-l.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/C7rm3sdM.js","_app/immutable/chunks/DEmwldwl.js","_app/immutable/chunks/DVcULqr7.js","_app/immutable/chunks/DyZqF2Qt.js","_app/immutable/chunks/CARY7BSv.js","_app/immutable/chunks/uSL-mgIf.js","_app/immutable/chunks/B6Zao61k.js","_app/immutable/chunks/CA_j4K-F.js","_app/immutable/chunks/ImmirkrM.js","_app/immutable/chunks/D0MExRDy.js","_app/immutable/chunks/D5i4tHJP.js","_app/immutable/chunks/DBC4lBlS.js","_app/immutable/chunks/DJXfu_Jv.js","_app/immutable/chunks/CR4ersal.js","_app/immutable/chunks/B5xf_oRu.js","_app/immutable/chunks/niySZIaN.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/Bch-uyOP.js","_app/immutable/chunks/BUTCjKsF.js","_app/immutable/chunks/DR9ElbIo.js","_app/immutable/chunks/CWhSAF0N.js","_app/immutable/chunks/Bteu_KB0.js","_app/immutable/chunks/CVn3ejAk.js","_app/immutable/chunks/25i-u3Ft.js","_app/immutable/chunks/B-IS1ra3.js","_app/immutable/chunks/g08TTeaD.js"];
export const stylesheets = [];
export const fonts = [];
