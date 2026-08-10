import * as server from '../entries/pages/admin/students/_page.server.ts.js';

export const index = 27;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/students/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/students/+page.server.ts";
export const imports = ["entries/pages/admin/students/_page.svelte.js","chunks/index.js","chunks/exports.js","chunks/utils2.js","chunks/root.js","chunks/shared-server.js","chunks/state.svelte.js","chunks/ConfirmForm.js","chunks/toast.js","chunks/index2.js","chunks/constants.js"];
export const stylesheets = ["_app/immutable/assets/_page.VB0kvX3s.css"];
export const fonts = [];
