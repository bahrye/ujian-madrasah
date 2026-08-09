import * as server from '../entries/pages/siswa/_layout.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/siswa/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/siswa/+layout.server.ts";
export const imports = ["_app/immutable/nodes/5.B7VMKrcY.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DcQ_8zXo.js","_app/immutable/chunks/D4qA_8uZ.js","_app/immutable/chunks/B8eGoYmR.js","_app/immutable/chunks/7Rd7Mpvn.js","_app/immutable/chunks/BnvTZMRs.js","_app/immutable/chunks/B8GwE7im.js","_app/immutable/chunks/Cn73aa_U.js","_app/immutable/chunks/CncG1aZI.js","_app/immutable/chunks/B8nvzFA9.js","_app/immutable/chunks/CvD4UPcL.js","_app/immutable/chunks/C1IC1cMY.js","_app/immutable/chunks/BiZpRAHv.js","_app/immutable/chunks/BGbsNJiS.js","_app/immutable/chunks/CXmMC8jQ.js","_app/immutable/chunks/B5xf_oRu.js","_app/immutable/chunks/7tbnz5Yx.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/XOobijh0.js","_app/immutable/chunks/CQ5fmD-8.js","_app/immutable/chunks/CSfQBWu7.js","_app/immutable/chunks/DefmdQD4.js","_app/immutable/chunks/Bjhz7Gm2.js","_app/immutable/chunks/Czq8_PJR.js","_app/immutable/chunks/DYRMyRBk.js","_app/immutable/chunks/BWH5wUBK.js","_app/immutable/chunks/DGTuazg_.js"];
export const stylesheets = [];
export const fonts = [];
