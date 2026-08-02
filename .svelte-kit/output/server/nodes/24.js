import * as server from '../entries/pages/superadmin/_page.server.ts.js';

export const index = 24;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/superadmin/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/superadmin/+page.server.ts";
export const imports = ["_app/immutable/nodes/24.DIkGf7HY.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CaPKEQgU.js","_app/immutable/chunks/-pTrYbTZ.js","_app/immutable/chunks/B9mQgqDt.js","_app/immutable/chunks/WMm59K3l.js","_app/immutable/chunks/DPqbTPA8.js","_app/immutable/chunks/CaJ0Bq-R.js","_app/immutable/chunks/BHWRHSZu.js","_app/immutable/chunks/vX8WsQxo.js","_app/immutable/chunks/C2zOCRZx.js","_app/immutable/chunks/WkpPKq5w.js"];
export const stylesheets = [];
export const fonts = [];
