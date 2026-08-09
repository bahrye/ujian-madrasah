import * as server from '../entries/pages/pengawas/_layout.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/pengawas/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/pengawas/+layout.server.ts";
export const imports = ["_app/immutable/nodes/4.DIrz6y8K.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/q3ZFHJDQ.js","_app/immutable/chunks/ClRrpZeN.js","_app/immutable/chunks/BKlKzBv1.js","_app/immutable/chunks/oZ_RSl7A.js","_app/immutable/chunks/Uo-sFA6w.js","_app/immutable/chunks/CcPznuOH.js","_app/immutable/chunks/DeQQCbRh.js","_app/immutable/chunks/BPzzqdRM.js","_app/immutable/chunks/DbEAIv_x.js","_app/immutable/chunks/COlPN6dD.js","_app/immutable/chunks/BClyc7_g.js","_app/immutable/chunks/IIYE5jok.js","_app/immutable/chunks/CcEXiels.js","_app/immutable/chunks/heyDCscg.js","_app/immutable/chunks/B5xf_oRu.js","_app/immutable/chunks/CNme0Hzl.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/BE_QLVD7.js","_app/immutable/chunks/5W9jVFWa.js","_app/immutable/chunks/C4Exv6EG.js","_app/immutable/chunks/CiiCNIbB.js","_app/immutable/chunks/BDCo-sdn.js","_app/immutable/chunks/Czq8_PJR.js","_app/immutable/chunks/A1P7O0DF.js","_app/immutable/chunks/B_fGxkjt.js","_app/immutable/chunks/CpJ3s9VQ.js"];
export const stylesheets = [];
export const fonts = [];
