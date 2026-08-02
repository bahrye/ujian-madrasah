import * as server from '../entries/pages/_page.server.ts.js';

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/7.S-59InzO.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BAlCm58o.js","_app/immutable/chunks/DDxqhf5o.js"];
export const stylesheets = [];
export const fonts = [];
