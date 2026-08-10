import * as server from '../entries/pages/guru/_page.server.ts.js';

export const index = 31;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/guru/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/guru/+page.server.ts";
export const imports = ["entries/pages/guru/_page.svelte.js","chunks/index.js","chunks/StatCard.js","chunks/constants.js"];
export const stylesheets = [];
export const fonts = [];
