import * as server from '../entries/pages/admin/papan-peringkat/_examId_/_page.server.ts.js';

export const index = 23;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/papan-peringkat/_examId_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/papan-peringkat/[examId]/+page.server.ts";
export const imports = ["entries/pages/admin/papan-peringkat/_examId_/_page.svelte.js","chunks/index.js","chunks/date.js"];
export const stylesheets = [];
export const fonts = [];
