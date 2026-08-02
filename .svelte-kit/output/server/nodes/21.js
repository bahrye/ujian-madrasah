import * as server from '../entries/pages/siswa/_page.server.ts.js';

export const index = 21;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/siswa/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/siswa/+page.server.ts";
export const imports = ["_app/immutable/nodes/21.B5RvdFho.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CaPKEQgU.js","_app/immutable/chunks/-pTrYbTZ.js","_app/immutable/chunks/B9mQgqDt.js","_app/immutable/chunks/WMm59K3l.js","_app/immutable/chunks/DPqbTPA8.js","_app/immutable/chunks/CaJ0Bq-R.js","_app/immutable/chunks/C2zOCRZx.js","_app/immutable/chunks/WkpPKq5w.js","_app/immutable/chunks/BHWRHSZu.js","_app/immutable/chunks/lYmavcFu.js"];
export const stylesheets = [];
export const fonts = [];
