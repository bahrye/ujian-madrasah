import * as server from '../entries/pages/superadmin/_page.server.ts.js';

export const index = 30;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/superadmin/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/superadmin/+page.server.ts";
export const imports = ["_app/immutable/nodes/30.DmP_Y5Yt.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BSozKgLK.js","_app/immutable/chunks/qmq1rnYV.js","_app/immutable/chunks/XjMW7FYH.js","_app/immutable/chunks/BblmnbLj.js","_app/immutable/chunks/RvrEe2QT.js","_app/immutable/chunks/Dv7qlger.js","_app/immutable/chunks/DPU2nFOo.js","_app/immutable/chunks/DdlnPvRb.js","_app/immutable/chunks/B5fXWu_7.js","_app/immutable/chunks/BoeaO_bi.js"];
export const stylesheets = [];
export const fonts = [];
