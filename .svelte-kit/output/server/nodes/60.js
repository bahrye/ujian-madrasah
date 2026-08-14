import * as server from '../entries/pages/siswa/jadwal/_page.server.ts.js';

export const index = 60;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/siswa/jadwal/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/siswa/jadwal/+page.server.ts";
export const imports = ["_app/immutable/nodes/60.CMFDyCyl.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/q3ZFHJDQ.js","_app/immutable/chunks/ClRrpZeN.js","_app/immutable/chunks/DbEAIv_x.js","_app/immutable/chunks/COlPN6dD.js","_app/immutable/chunks/BClyc7_g.js","_app/immutable/chunks/i_5gAELL.js","_app/immutable/chunks/CcEXiels.js","_app/immutable/chunks/oZ_RSl7A.js","_app/immutable/chunks/Uo-sFA6w.js","_app/immutable/chunks/CcPznuOH.js","_app/immutable/chunks/DeQQCbRh.js","_app/immutable/chunks/Ci4D5aUh.js","_app/immutable/chunks/Czq8_PJR.js"];
export const stylesheets = [];
export const fonts = [];
