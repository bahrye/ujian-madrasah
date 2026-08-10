import * as server from '../entries/pages/superadmin/_page.server.ts.js';

export const index = 65;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/superadmin/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/superadmin/+page.server.ts";
export const imports = ["entries/pages/superadmin/_page.svelte.js","chunks/index.js","chunks/date.js","chunks/StatCard.js","chunks/constants.js"];
export const stylesheets = [];
export const fonts = [];
