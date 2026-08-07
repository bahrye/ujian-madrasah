import * as server from '../entries/pages/guru/media-bank/_page.server.ts.js';

export const index = 33;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/guru/media-bank/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/guru/media-bank/+page.server.ts";
export const imports = ["entries/pages/guru/media-bank/_page.svelte.js","chunks/index.js","chunks/exports.js","chunks/utils2.js","chunks/root.js","chunks/state.svelte.js"];
export const stylesheets = [];
export const fonts = [];
