import * as server from '../entries/pages/pengawas/_page.server.ts.js';

export const index = 18;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/pengawas/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/pengawas/+page.server.ts";
export const imports = ["_app/immutable/nodes/18.DT5fJJ29.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CaPKEQgU.js","_app/immutable/chunks/-pTrYbTZ.js","_app/immutable/chunks/B9mQgqDt.js","_app/immutable/chunks/CaJ0Bq-R.js","_app/immutable/chunks/C2zOCRZx.js","_app/immutable/chunks/BHWRHSZu.js","_app/immutable/chunks/WMm59K3l.js","_app/immutable/chunks/vX8WsQxo.js","_app/immutable/chunks/WkpPKq5w.js","_app/immutable/chunks/lYmavcFu.js"];
export const stylesheets = [];
export const fonts = [];
