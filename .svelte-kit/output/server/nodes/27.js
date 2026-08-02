import * as server from '../entries/pages/siswa/ujian/_page.server.ts.js';

export const index = 27;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/siswa/ujian/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/siswa/ujian/+page.server.ts";
export const imports = ["_app/immutable/nodes/27.CfxOQqta.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BZbEoyCw.js","_app/immutable/chunks/pVKruFo1.js","_app/immutable/chunks/CbTox5fa.js","_app/immutable/chunks/BFKIXuI0.js","_app/immutable/chunks/DKmcUs-K.js","_app/immutable/chunks/BOfnpBj4.js","_app/immutable/chunks/Bka8VT6E.js","_app/immutable/chunks/BFb72ugl.js","_app/immutable/chunks/BKjL5Qlh.js","_app/immutable/chunks/B6Hc4xX0.js","_app/immutable/chunks/wmSitu1K.js"];
export const stylesheets = [];
export const fonts = [];
