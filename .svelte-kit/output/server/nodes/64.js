import * as server from '../entries/pages/siswa/ujian/_attemptId_/_page.server.ts.js';

export const index = 64;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/siswa/ujian/_attemptId_/_page@.svelte.js')).default;
export { server };
export const server_id = "src/routes/siswa/ujian/[attemptId]/+page.server.ts";
export const imports = ["entries/pages/siswa/ujian/_attemptId_/_page@.svelte.js","chunks/index.js","chunks/index-server.js","chunks/exports.js","chunks/utils2.js","chunks/root.js","chunks/state.svelte.js","chunks/QuestionRenderer.js","chunks/constants.js","chunks/html.js","chunks/Toast2.js","chunks/toast.js","chunks/index2.js"];
export const stylesheets = ["_app/immutable/assets/QuestionRenderer.CwYmYea-.css"];
export const fonts = [];
