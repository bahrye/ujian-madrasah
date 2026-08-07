import * as server from '../entries/pages/admin/_page.server.ts.js';

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/+page.server.ts";
export const imports = ["_app/immutable/nodes/8.DNihz7X3.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DcQ_8zXo.js","_app/immutable/chunks/D4qA_8uZ.js","_app/immutable/chunks/B8nvzFA9.js","_app/immutable/chunks/CvD4UPcL.js","_app/immutable/chunks/C1IC1cMY.js","_app/immutable/chunks/DBitQRLM.js","_app/immutable/chunks/BGbsNJiS.js","_app/immutable/chunks/CXmMC8jQ.js","_app/immutable/chunks/B5xf_oRu.js","_app/immutable/chunks/DRTBnVV4.js","_app/immutable/chunks/7Rd7Mpvn.js","_app/immutable/chunks/BnvTZMRs.js","_app/immutable/chunks/B8GwE7im.js","_app/immutable/chunks/Cn73aa_U.js","_app/immutable/chunks/CjGyJir6.js","_app/immutable/chunks/B1NmTBlo.js","_app/immutable/chunks/DgSQwxXL.js"];
export const stylesheets = [];
export const fonts = [];
