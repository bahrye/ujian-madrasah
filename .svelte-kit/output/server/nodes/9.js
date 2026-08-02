import * as server from '../entries/pages/admin/exams/_page.server.ts.js';

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/exams/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/exams/+page.server.ts";
export const imports = ["_app/immutable/nodes/9.C3I9ts1x.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CaPKEQgU.js","_app/immutable/chunks/-pTrYbTZ.js","_app/immutable/chunks/B9mQgqDt.js","_app/immutable/chunks/WMm59K3l.js","_app/immutable/chunks/DPqbTPA8.js","_app/immutable/chunks/CaJ0Bq-R.js","_app/immutable/chunks/B9dxDUUo.js","_app/immutable/chunks/4cJ5ZcUL.js","_app/immutable/chunks/siOObrh7.js","_app/immutable/chunks/C2zOCRZx.js","_app/immutable/chunks/COvBwKwx.js","_app/immutable/chunks/j1bG5Wpa.js","_app/immutable/chunks/BHWRHSZu.js","_app/immutable/chunks/lYmavcFu.js","_app/immutable/chunks/DgSeWHQG.js"];
export const stylesheets = [];
export const fonts = [];
