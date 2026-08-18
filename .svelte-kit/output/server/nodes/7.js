import * as server from '../entries/pages/superadmin/_layout.server.ts.js';

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/superadmin/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/superadmin/+layout.server.ts";
export const imports = ["_app/immutable/nodes/7.KLLOmtAK.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BkDc5lsC.js","_app/immutable/chunks/77oVT6gL.js","_app/immutable/chunks/DDS-YbJB.js","_app/immutable/chunks/Ccci742D.js","_app/immutable/chunks/BBfBhjn1.js","_app/immutable/chunks/D5OSDHHL.js","_app/immutable/chunks/CKhHHlMD.js","_app/immutable/chunks/CqCPXM2V.js","_app/immutable/chunks/CBVzxlgg.js","_app/immutable/chunks/9rnmF-J1.js","_app/immutable/chunks/DA6k4PCA.js","_app/immutable/chunks/-PUMJNJJ.js","_app/immutable/chunks/BDi7KY7o.js","_app/immutable/chunks/B5xf_oRu.js","_app/immutable/chunks/BnRASxHT.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/B22aRNFV.js","_app/immutable/chunks/BapqlEjS.js","_app/immutable/chunks/BqDvx4DK.js","_app/immutable/chunks/BqssnHz9.js","_app/immutable/chunks/D0g6almG.js","_app/immutable/chunks/Bp5krBFs.js","_app/immutable/chunks/DuRxbOfy.js","_app/immutable/chunks/DbPvmzWc.js","_app/immutable/chunks/DlMShkGE.js"];
export const stylesheets = [];
export const fonts = [];
