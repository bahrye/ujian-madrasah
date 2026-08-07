import * as server from '../entries/pages/pengawas/_page.server.ts.js';

export const index = 44;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/pengawas/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/pengawas/+page.server.ts";
export const imports = ["entries/pages/pengawas/_page.svelte.js","chunks/index.js","chunks/date.js","chunks/index-server.js","chunks/StatCard.js","chunks/constants.js"];
export const stylesheets = [];
export const fonts = [];
