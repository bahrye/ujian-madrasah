import * as server from '../entries/pages/admin/papan-peringkat/type/_typeId_/exams/_page.server.ts.js';

export const index = 20;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/papan-peringkat/type/_typeId_/exams/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/papan-peringkat/type/[typeId]/exams/+page.server.ts";
export const imports = ["entries/pages/admin/papan-peringkat/type/_typeId_/exams/_page.svelte.js","chunks/index.js"];
export const stylesheets = [];
export const fonts = [];
