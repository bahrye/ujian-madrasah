import * as server from '../entries/pages/siswa/ujian/_page.server.ts.js';

export const index = 22;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/siswa/ujian/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/siswa/ujian/+page.server.ts";
export const imports = ["_app/immutable/nodes/22.4nmKiN-j.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CaPKEQgU.js","_app/immutable/chunks/-pTrYbTZ.js","_app/immutable/chunks/B9mQgqDt.js","_app/immutable/chunks/WMm59K3l.js","_app/immutable/chunks/CaJ0Bq-R.js","_app/immutable/chunks/B9dxDUUo.js","_app/immutable/chunks/4cJ5ZcUL.js","_app/immutable/chunks/siOObrh7.js","_app/immutable/chunks/C2zOCRZx.js","_app/immutable/chunks/BHWRHSZu.js","_app/immutable/chunks/lYmavcFu.js"];
export const stylesheets = [];
export const fonts = [];
