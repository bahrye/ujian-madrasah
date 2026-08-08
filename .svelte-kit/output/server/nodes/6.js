import * as server from '../entries/pages/superadmin/_layout.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/superadmin/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/superadmin/+layout.server.ts";
export const imports = ["_app/immutable/nodes/6.BAFRqJOM.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DcQ_8zXo.js","_app/immutable/chunks/D4qA_8uZ.js","_app/immutable/chunks/B8eGoYmR.js","_app/immutable/chunks/7Rd7Mpvn.js","_app/immutable/chunks/BnvTZMRs.js","_app/immutable/chunks/B8GwE7im.js","_app/immutable/chunks/Cn73aa_U.js","_app/immutable/chunks/CQdxuz6y.js","_app/immutable/chunks/B8nvzFA9.js","_app/immutable/chunks/CvD4UPcL.js","_app/immutable/chunks/C1IC1cMY.js","_app/immutable/chunks/BiZpRAHv.js","_app/immutable/chunks/BGbsNJiS.js","_app/immutable/chunks/CXmMC8jQ.js","_app/immutable/chunks/B5xf_oRu.js","_app/immutable/chunks/7tbnz5Yx.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/XOobijh0.js","_app/immutable/chunks/aTyvRQOl.js","_app/immutable/chunks/Bt6I-E_K.js","_app/immutable/chunks/DefmdQD4.js","_app/immutable/chunks/Gt4zjDTf.js","_app/immutable/chunks/DgSQwxXL.js","_app/immutable/chunks/DYRMyRBk.js","_app/immutable/chunks/BWH5wUBK.js","_app/immutable/chunks/CTcWBZ2V.js"];
export const stylesheets = [];
export const fonts = [];
