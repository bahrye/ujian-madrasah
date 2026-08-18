import * as server from '../entries/pages/print/_layout.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/print/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/print/+layout.server.ts";
export const imports = ["_app/immutable/nodes/5.BQ91qE6X.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/B3hsJeW7.js","_app/immutable/chunks/D9IgJ_RW.js","_app/immutable/chunks/D1x44OQM.js","_app/immutable/chunks/BdmV_moa.js"];
export const stylesheets = [];
export const fonts = [];
