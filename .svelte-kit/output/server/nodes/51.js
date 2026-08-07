import * as server from '../entries/pages/siswa/hasil-ujian/_page.server.ts.js';

export const index = 51;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/siswa/hasil-ujian/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/siswa/hasil-ujian/+page.server.ts";
export const imports = ["entries/pages/siswa/hasil-ujian/_page.svelte.js","chunks/index.js","chunks/date.js","chunks/constants.js","chunks/ScoreDisplay.js","chunks/index-server.js"];
export const stylesheets = [];
export const fonts = [];
