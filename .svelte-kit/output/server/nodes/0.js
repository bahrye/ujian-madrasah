import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.DCancGkM.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BAlCm58o.js","_app/immutable/chunks/DDxqhf5o.js","_app/immutable/chunks/BPo3cuOX.js"];
export const stylesheets = ["_app/immutable/assets/0.DZUh2HEk.css"];
export const fonts = [];
