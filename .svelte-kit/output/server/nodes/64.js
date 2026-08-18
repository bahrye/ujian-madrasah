import * as server from '../entries/pages/print/kartu/type/_typeId_/_page.server.ts.js';

export const index = 64;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/print/kartu/type/_typeId_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/print/kartu/type/[typeId]/+page.server.ts";
export const imports = ["_app/immutable/nodes/64.BVe2nm7D.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BkDc5lsC.js","_app/immutable/chunks/77oVT6gL.js","_app/immutable/chunks/CBVzxlgg.js","_app/immutable/chunks/9rnmF-J1.js","_app/immutable/chunks/DA6k4PCA.js","_app/immutable/chunks/DZSNLIV1.js","_app/immutable/chunks/BDi7KY7o.js","_app/immutable/chunks/B5xf_oRu.js","_app/immutable/chunks/Ccci742D.js","_app/immutable/chunks/BBfBhjn1.js","_app/immutable/chunks/D5OSDHHL.js","_app/immutable/chunks/CKhHHlMD.js"];
export const stylesheets = ["_app/immutable/assets/64.roWMPQR0.css"];
export const fonts = [];
