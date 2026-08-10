import * as server from '../entries/pages/siswa/jadwal/_page.server.ts.js';

export const index = 57;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/siswa/jadwal/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/siswa/jadwal/+page.server.ts";
export const imports = ["entries/pages/siswa/jadwal/_page.svelte.js","chunks/index.js","chunks/date.js","chunks/constants.js"];
export const stylesheets = [];
export const fonts = [];
