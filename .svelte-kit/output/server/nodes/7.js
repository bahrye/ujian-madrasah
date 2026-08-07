import * as server from '../entries/pages/_page.server.ts.js';

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/7.BsA2Ihq4.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DcQ_8zXo.js","_app/immutable/chunks/D4qA_8uZ.js"];
export const stylesheets = [];
export const fonts = [];
