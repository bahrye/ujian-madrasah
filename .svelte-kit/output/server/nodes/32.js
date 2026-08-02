import * as server from '../entries/pages/superadmin/schools/_page.server.ts.js';

export const index = 32;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/superadmin/schools/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/superadmin/schools/+page.server.ts";
export const imports = ["_app/immutable/nodes/32.BaR2UA7G.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BSozKgLK.js","_app/immutable/chunks/qmq1rnYV.js","_app/immutable/chunks/XjMW7FYH.js","_app/immutable/chunks/BblmnbLj.js","_app/immutable/chunks/RvrEe2QT.js","_app/immutable/chunks/Dv7qlger.js","_app/immutable/chunks/7r7XCYRH.js","_app/immutable/chunks/DT1VzyqX.js","_app/immutable/chunks/DMvL3CwU.js","_app/immutable/chunks/B5fXWu_7.js","_app/immutable/chunks/BoeaO_bi.js","_app/immutable/chunks/DPU2nFOo.js","_app/immutable/chunks/DNOnNHD3.js"];
export const stylesheets = [];
export const fonts = [];
