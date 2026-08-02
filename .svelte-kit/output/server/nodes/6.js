import * as server from '../entries/pages/superadmin/_layout.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/superadmin/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/superadmin/+layout.server.ts";
export const imports = ["_app/immutable/nodes/6.CNYe2k8C.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CaPKEQgU.js","_app/immutable/chunks/-pTrYbTZ.js","_app/immutable/chunks/VWdgTvMB.js","_app/immutable/chunks/BHWRHSZu.js","_app/immutable/chunks/WMm59K3l.js","_app/immutable/chunks/B9mQgqDt.js","_app/immutable/chunks/DMpCDc0u.js","_app/immutable/chunks/DPqbTPA8.js","_app/immutable/chunks/aTHKHmMS.js","_app/immutable/chunks/C2zOCRZx.js","_app/immutable/chunks/WkpPKq5w.js","_app/immutable/chunks/DgSeWHQG.js","_app/immutable/chunks/j1bG5Wpa.js","_app/immutable/chunks/4cJ5ZcUL.js","_app/immutable/chunks/siOObrh7.js","_app/immutable/chunks/lYmavcFu.js"];
export const stylesheets = [];
export const fonts = [];
