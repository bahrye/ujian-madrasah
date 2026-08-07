import * as server from '../entries/pages/pengawas/jadwal/saya/_page.server.ts.js';

export const index = 45;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/pengawas/jadwal/saya/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/pengawas/jadwal/saya/+page.server.ts";
export const imports = ["entries/pages/pengawas/jadwal/saya/_page.svelte.js","chunks/index.js","chunks/date.js","chunks/constants.js"];
export const stylesheets = [];
export const fonts = [];
