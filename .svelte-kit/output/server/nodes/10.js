import * as server from '../entries/pages/admin/bank-soal/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/bank-soal/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/bank-soal/+page.server.ts";
export const imports = ["_app/immutable/nodes/10.DZ0ba-ao.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/q3ZFHJDQ.js","_app/immutable/chunks/ClRrpZeN.js","_app/immutable/chunks/DbEAIv_x.js","_app/immutable/chunks/COlPN6dD.js","_app/immutable/chunks/BClyc7_g.js","_app/immutable/chunks/i_5gAELL.js","_app/immutable/chunks/Cg1kvKM7.js","_app/immutable/chunks/CcEXiels.js","_app/immutable/chunks/DyOTXvB3.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/oZ_RSl7A.js","_app/immutable/chunks/Uo-sFA6w.js","_app/immutable/chunks/CcPznuOH.js","_app/immutable/chunks/DeQQCbRh.js","_app/immutable/chunks/Czq8_PJR.js","_app/immutable/chunks/6XV2HmnU.js","_app/immutable/chunks/EuKwIP6H.js","_app/immutable/chunks/CiiCNIbB.js","_app/immutable/chunks/lRAV-x4a.js"];
export const stylesheets = [];
export const fonts = [];
