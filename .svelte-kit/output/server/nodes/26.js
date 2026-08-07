import * as server from '../entries/pages/admin/subjects/_page.server.ts.js';

export const index = 26;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/subjects/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/subjects/+page.server.ts";
export const imports = ["entries/pages/admin/subjects/_page.svelte.js","chunks/index.js","chunks/exports.js","chunks/utils2.js","chunks/root.js","chunks/state.svelte.js","chunks/ConfirmForm.js","chunks/toast.js","chunks/index2.js"];
export const stylesheets = [];
export const fonts = [];
