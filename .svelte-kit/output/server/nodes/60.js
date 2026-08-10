import * as server from '../entries/pages/siswa/papan-peringkat/type/_typeId_/exams/_page.server.ts.js';

export const index = 60;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/siswa/papan-peringkat/type/_typeId_/exams/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/siswa/papan-peringkat/type/[typeId]/exams/+page.server.ts";
export const imports = ["entries/pages/siswa/papan-peringkat/type/_typeId_/exams/_page.svelte.js","chunks/index.js"];
export const stylesheets = [];
export const fonts = [];
