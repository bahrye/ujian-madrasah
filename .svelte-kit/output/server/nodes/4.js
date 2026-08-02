import * as server from '../entries/pages/pengawas/_layout.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/pengawas/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/pengawas/+layout.server.ts";
export const imports = ["_app/immutable/nodes/4.BkWJhQMF.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BSozKgLK.js","_app/immutable/chunks/qmq1rnYV.js","_app/immutable/chunks/JmCrW3Z7.js","_app/immutable/chunks/DPU2nFOo.js","_app/immutable/chunks/BblmnbLj.js","_app/immutable/chunks/XjMW7FYH.js","_app/immutable/chunks/BYRvmpHg.js","_app/immutable/chunks/RvrEe2QT.js","_app/immutable/chunks/CxZDUAFj.js","_app/immutable/chunks/B5fXWu_7.js","_app/immutable/chunks/BoeaO_bi.js","_app/immutable/chunks/DNOnNHD3.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/DPPGlu1o.js","_app/immutable/chunks/Dgb1vr1f.js","_app/immutable/chunks/C24Bdytc.js","_app/immutable/chunks/DMvL3CwU.js","_app/immutable/chunks/CcJDwDvi.js"];
export const stylesheets = [];
export const fonts = [];
