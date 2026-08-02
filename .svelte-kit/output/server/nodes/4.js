import * as server from '../entries/pages/pengawas/_layout.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/pengawas/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/pengawas/+layout.server.ts";
export const imports = ["_app/immutable/nodes/4.5YmleiFS.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BZbEoyCw.js","_app/immutable/chunks/pVKruFo1.js","_app/immutable/chunks/cudmzuk5.js","_app/immutable/chunks/B6Hc4xX0.js","_app/immutable/chunks/BFKIXuI0.js","_app/immutable/chunks/CbTox5fa.js","_app/immutable/chunks/DB5jp40O.js","_app/immutable/chunks/XzJ121RJ.js","_app/immutable/chunks/DGzHoV-x.js","_app/immutable/chunks/BKjL5Qlh.js","_app/immutable/chunks/CBfed4VF.js","_app/immutable/chunks/BA6o9f-S.js","_app/immutable/chunks/CKI3Acvs.js","_app/immutable/chunks/D-_4jWmO.js","_app/immutable/chunks/BFb72ugl.js","_app/immutable/chunks/wmSitu1K.js"];
export const stylesheets = [];
export const fonts = [];
