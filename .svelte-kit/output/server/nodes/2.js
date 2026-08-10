import * as server from '../entries/pages/admin/_layout.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/+layout.server.ts";
export const imports = ["entries/pages/admin/_layout.svelte.js","chunks/index.js","chunks/AppShell.js","chunks/stores.js","chunks/exports.js","chunks/utils2.js","chunks/root.js","chunks/state.svelte.js","chunks/constants.js","chunks/toast.js","chunks/index2.js","chunks/Toast2.js"];
export const stylesheets = [];
export const fonts = [];
