import * as server from '../entries/pages/print/berita-acara/_exam_id_/_page.server.ts.js';

export const index = 52;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/print/berita-acara/_exam_id_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/print/berita-acara/[exam_id]/+page.server.ts";
export const imports = ["entries/pages/print/berita-acara/_exam_id_/_page.svelte.js","chunks/index.js","chunks/date.js"];
export const stylesheets = [];
export const fonts = [];
