import * as server from '../entries/pages/print/kartu/_exam_id_/_page.server.ts.js';

export const index = 53;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/print/kartu/_exam_id_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/print/kartu/[exam_id]/+page.server.ts";
export const imports = ["entries/pages/print/kartu/_exam_id_/_page.svelte.js","chunks/index.js"];
export const stylesheets = [];
export const fonts = [];
