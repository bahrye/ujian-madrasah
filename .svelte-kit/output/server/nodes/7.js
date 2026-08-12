import * as server from '../entries/pages/superadmin/_layout.server.ts.js';

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/superadmin/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/superadmin/+layout.server.ts";
export const imports = ["_app/immutable/nodes/7.CkpPcXZJ.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/q3ZFHJDQ.js","_app/immutable/chunks/ClRrpZeN.js","_app/immutable/chunks/BKlKzBv1.js","_app/immutable/chunks/oZ_RSl7A.js","_app/immutable/chunks/Uo-sFA6w.js","_app/immutable/chunks/CcPznuOH.js","_app/immutable/chunks/DeQQCbRh.js","_app/immutable/chunks/CNeHlvxp.js","_app/immutable/chunks/DbEAIv_x.js","_app/immutable/chunks/COlPN6dD.js","_app/immutable/chunks/BClyc7_g.js","_app/immutable/chunks/IIYE5jok.js","_app/immutable/chunks/CcEXiels.js","_app/immutable/chunks/heyDCscg.js","_app/immutable/chunks/B5xf_oRu.js","_app/immutable/chunks/3pbOSyMF.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/BE_QLVD7.js","_app/immutable/chunks/C1xopguy.js","_app/immutable/chunks/Bm9rcxA7.js","_app/immutable/chunks/CiiCNIbB.js","_app/immutable/chunks/CzDVYhj4.js","_app/immutable/chunks/Czq8_PJR.js","_app/immutable/chunks/A1P7O0DF.js","_app/immutable/chunks/B9HllNfG.js","_app/immutable/chunks/CpJ3s9VQ.js"];
export const stylesheets = [];
export const fonts = [];
