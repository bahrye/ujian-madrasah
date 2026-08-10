import * as server from '../entries/pages/siswa/ujian/_page.server.ts.js';

export const index = 64;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/siswa/ujian/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/siswa/ujian/+page.server.ts";
export const imports = ["_app/immutable/nodes/64.DzBIyPWo.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/q3ZFHJDQ.js","_app/immutable/chunks/ClRrpZeN.js","_app/immutable/chunks/DbEAIv_x.js","_app/immutable/chunks/COlPN6dD.js","_app/immutable/chunks/i_5gAELL.js","_app/immutable/chunks/Cg1kvKM7.js","_app/immutable/chunks/CcEXiels.js","_app/immutable/chunks/DSyBcXD6.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/oZ_RSl7A.js","_app/immutable/chunks/BE_QLVD7.js","_app/immutable/chunks/Uo-sFA6w.js","_app/immutable/chunks/CcPznuOH.js","_app/immutable/chunks/DeQQCbRh.js","_app/immutable/chunks/k7gDGKzN.js","_app/immutable/chunks/CByNAa-v.js","_app/immutable/chunks/CiiCNIbB.js","_app/immutable/chunks/BpJii2VT.js","_app/immutable/chunks/Czq8_PJR.js"];
export const stylesheets = [];
export const fonts = [];
