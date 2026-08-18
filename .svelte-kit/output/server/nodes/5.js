import * as server from '../entries/pages/print/_layout.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/print/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/print/+layout.server.ts";
export const imports = ["_app/immutable/nodes/5.rRfbmJoE.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BkDc5lsC.js","_app/immutable/chunks/77oVT6gL.js","_app/immutable/chunks/DDS-YbJB.js","_app/immutable/chunks/DZSNLIV1.js"];
export const stylesheets = [];
export const fonts = [];
