import * as server from '../entries/pages/admin/results/_page.server.ts.js';

export const index = 14;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/results/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/results/+page.server.ts";
export const imports = ["_app/immutable/nodes/14.C3vjcHnM.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BSozKgLK.js","_app/immutable/chunks/qmq1rnYV.js","_app/immutable/chunks/XjMW7FYH.js","_app/immutable/chunks/BblmnbLj.js","_app/immutable/chunks/RvrEe2QT.js","_app/immutable/chunks/Dv7qlger.js","_app/immutable/chunks/BoeaO_bi.js","_app/immutable/chunks/DPU2nFOo.js","_app/immutable/chunks/CcJDwDvi.js"];
export const stylesheets = [];
export const fonts = [];
