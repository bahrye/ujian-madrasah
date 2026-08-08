import * as server from '../entries/pages/guru/bank-soal/_page.server.ts.js';

export const index = 30;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/guru/bank-soal/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/guru/bank-soal/+page.server.ts";
export const imports = ["_app/immutable/nodes/30.4sFvBxab.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DcQ_8zXo.js","_app/immutable/chunks/D4qA_8uZ.js","_app/immutable/chunks/B8nvzFA9.js","_app/immutable/chunks/CvD4UPcL.js","_app/immutable/chunks/C1IC1cMY.js","_app/immutable/chunks/DBitQRLM.js","_app/immutable/chunks/CVx8fJzC.js","_app/immutable/chunks/BGbsNJiS.js","_app/immutable/chunks/CU7zQuN6.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/7Rd7Mpvn.js","_app/immutable/chunks/BnvTZMRs.js","_app/immutable/chunks/B8GwE7im.js","_app/immutable/chunks/Cn73aa_U.js","_app/immutable/chunks/DgSQwxXL.js","_app/immutable/chunks/BrSrCj0I.js","_app/immutable/chunks/Df2QwNYv.js","_app/immutable/chunks/DefmdQD4.js","_app/immutable/chunks/DdBZT8nA.js"];
export const stylesheets = [];
export const fonts = [];
