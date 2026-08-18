import * as server from '../entries/pages/admin/bank-soal/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/bank-soal/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/bank-soal/+page.server.ts";
export const imports = ["_app/immutable/nodes/10.B-j9tU7U.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BkDc5lsC.js","_app/immutable/chunks/77oVT6gL.js","_app/immutable/chunks/CBVzxlgg.js","_app/immutable/chunks/9rnmF-J1.js","_app/immutable/chunks/DA6k4PCA.js","_app/immutable/chunks/BoTjDimQ.js","_app/immutable/chunks/DZSNLIV1.js","_app/immutable/chunks/BozWwjpo.js","_app/immutable/chunks/BnRASxHT.js","_app/immutable/chunks/BNaF4jeq.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/Ccci742D.js","_app/immutable/chunks/B22aRNFV.js","_app/immutable/chunks/BBfBhjn1.js","_app/immutable/chunks/D5OSDHHL.js","_app/immutable/chunks/CKhHHlMD.js","_app/immutable/chunks/D0g6almG.js","_app/immutable/chunks/QgcKZ9ZN.js","_app/immutable/chunks/C_yCLKdr.js","_app/immutable/chunks/BqssnHz9.js"];
export const stylesheets = [];
export const fonts = [];
