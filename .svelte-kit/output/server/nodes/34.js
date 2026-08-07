import * as server from '../entries/pages/guru/papan-peringkat/_page.server.ts.js';

export const index = 34;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/guru/papan-peringkat/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/guru/papan-peringkat/+page.server.ts";
export const imports = ["entries/pages/guru/papan-peringkat/_page.svelte.js","chunks/index.js"];
export const stylesheets = [];
export const fonts = [];
