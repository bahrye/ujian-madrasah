import * as server from '../entries/pages/admin/bank-soal/_examId_/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/bank-soal/_examId_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/bank-soal/[examId]/+page.server.ts";
export const imports = ["_app/immutable/nodes/10.DXDr2Ppi.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BSozKgLK.js","_app/immutable/chunks/qmq1rnYV.js","_app/immutable/chunks/BblmnbLj.js","_app/immutable/chunks/XjMW7FYH.js","_app/immutable/chunks/RvrEe2QT.js","_app/immutable/chunks/Dv7qlger.js","_app/immutable/chunks/BpIsYoZt.js","_app/immutable/chunks/COFJZQOk.js","_app/immutable/chunks/DMvL3CwU.js","_app/immutable/chunks/B5fXWu_7.js","_app/immutable/chunks/BoeaO_bi.js","_app/immutable/chunks/Co_vBslo.js","_app/immutable/chunks/NbdLsgzM.js","_app/immutable/chunks/DPU2nFOo.js","_app/immutable/chunks/CcJDwDvi.js","_app/immutable/chunks/DNOnNHD3.js","_app/immutable/chunks/DTUIWzlB.js"];
export const stylesheets = [];
export const fonts = [];
