import * as server from '../entries/pages/siswa/_layout.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/siswa/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/siswa/+layout.server.ts";
export const imports = ["_app/immutable/nodes/5.CdNw0oMV.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CaPKEQgU.js","_app/immutable/chunks/-pTrYbTZ.js","_app/immutable/chunks/VWdgTvMB.js","_app/immutable/chunks/BHWRHSZu.js","_app/immutable/chunks/WMm59K3l.js","_app/immutable/chunks/B9mQgqDt.js","_app/immutable/chunks/DMpCDc0u.js","_app/immutable/chunks/DPqbTPA8.js","_app/immutable/chunks/aTHKHmMS.js","_app/immutable/chunks/C2zOCRZx.js","_app/immutable/chunks/WkpPKq5w.js","_app/immutable/chunks/DgSeWHQG.js","_app/immutable/chunks/j1bG5Wpa.js","_app/immutable/chunks/4cJ5ZcUL.js","_app/immutable/chunks/siOObrh7.js","_app/immutable/chunks/lYmavcFu.js"];
export const stylesheets = [];
export const fonts = [];
