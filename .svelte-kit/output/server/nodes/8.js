import * as server from '../entries/pages/_page.server.ts.js';

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/8.DAz4XLSP.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/n3Fn0U0E.js","_app/immutable/chunks/BOzuXFwb.js"];
export const stylesheets = [];
export const fonts = [];
