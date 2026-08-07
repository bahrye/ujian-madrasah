import * as server from '../entries/pages/admin/tokens/_page.server.ts.js';

export const index = 27;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/tokens/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/tokens/+page.server.ts";
export const imports = ["entries/pages/admin/tokens/_page.svelte.js","chunks/index.js","chunks/date.js","chunks/index-server.js","chunks/exports.js","chunks/utils2.js","chunks/root.js","chunks/state.svelte.js","chunks/constants.js","chunks/toast.js","chunks/index2.js"];
export const stylesheets = [];
export const fonts = [];
