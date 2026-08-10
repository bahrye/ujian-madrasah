import * as server from '../entries/pages/siswa/ujian/_page.server.ts.js';

export const index = 63;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/siswa/ujian/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/siswa/ujian/+page.server.ts";
export const imports = ["entries/pages/siswa/ujian/_page.svelte.js","chunks/index.js","chunks/exports.js","chunks/utils2.js","chunks/root.js","chunks/state.svelte.js","chunks/constants.js"];
export const stylesheets = [];
export const fonts = [];
