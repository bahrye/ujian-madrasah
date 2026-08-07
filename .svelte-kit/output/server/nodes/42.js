import * as server from '../entries/pages/guru/results/_attemptId_/_page.server.ts.js';

export const index = 42;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/guru/results/_attemptId_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/guru/results/[attemptId]/+page.server.ts";
export const imports = ["entries/pages/guru/results/_attemptId_/_page.svelte.js","chunks/index.js","chunks/date.js","chunks/constants.js","chunks/html.js"];
export const stylesheets = [];
export const fonts = [];
