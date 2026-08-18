import * as server from '../entries/pages/print/kartu/_exam_id_/_page.server.ts.js';

export const index = 65;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/print/kartu/_exam_id_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/print/kartu/[exam_id]/+page.server.ts";
export const imports = ["_app/immutable/nodes/65.ChUaPzj8.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BkDc5lsC.js","_app/immutable/chunks/77oVT6gL.js","_app/immutable/chunks/CBVzxlgg.js","_app/immutable/chunks/9rnmF-J1.js","_app/immutable/chunks/DA6k4PCA.js","_app/immutable/chunks/DZSNLIV1.js","_app/immutable/chunks/Ccci742D.js","_app/immutable/chunks/BBfBhjn1.js","_app/immutable/chunks/D5OSDHHL.js","_app/immutable/chunks/CKhHHlMD.js","_app/immutable/chunks/iQAfk_ag.js"];
export const stylesheets = [];
export const fonts = [];
