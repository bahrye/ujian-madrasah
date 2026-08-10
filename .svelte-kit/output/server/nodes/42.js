import * as server from '../entries/pages/guru/remedial/_examId_/_page.server.ts.js';

export const index = 42;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/guru/remedial/_examId_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/guru/remedial/[examId]/+page.server.ts";
export const imports = ["entries/pages/guru/remedial/_examId_/_page.svelte.js","chunks/index.js","chunks/date.js","chunks/exports.js","chunks/utils2.js","chunks/root.js","chunks/state.svelte.js","chunks/constants.js","chunks/ConfirmForm.js"];
export const stylesheets = [];
export const fonts = [];
