import * as server from '../entries/pages/print/_layout.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/print/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/print/+layout.server.ts";
export const imports = ["entries/pages/print/_layout.svelte.js","chunks/index.js"];
export const stylesheets = [];
export const fonts = [];
