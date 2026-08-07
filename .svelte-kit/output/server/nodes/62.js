import * as server from '../entries/pages/superadmin/admins/_page.server.ts.js';

export const index = 62;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/superadmin/admins/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/superadmin/admins/+page.server.ts";
export const imports = ["entries/pages/superadmin/admins/_page.svelte.js","chunks/index.js","chunks/date.js","chunks/exports.js","chunks/utils2.js","chunks/root.js","chunks/state.svelte.js","chunks/ConfirmForm.js","chunks/toast.js","chunks/index2.js","chunks/PasswordInput.js"];
export const stylesheets = [];
export const fonts = [];
