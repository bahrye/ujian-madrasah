import * as server from '../entries/pages/pengawas/_page.server.ts.js';

export const index = 23;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/pengawas/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/pengawas/+page.server.ts";
export const imports = ["_app/immutable/nodes/23.CGdbZghp.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BZbEoyCw.js","_app/immutable/chunks/pVKruFo1.js","_app/immutable/chunks/CbTox5fa.js","_app/immutable/chunks/DKmcUs-K.js","_app/immutable/chunks/BKjL5Qlh.js","_app/immutable/chunks/B6Hc4xX0.js","_app/immutable/chunks/BFKIXuI0.js","_app/immutable/chunks/5iwts6lA.js","_app/immutable/chunks/CBfed4VF.js","_app/immutable/chunks/wmSitu1K.js"];
export const stylesheets = [];
export const fonts = [];
