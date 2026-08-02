import * as server from '../entries/pages/pengawas/_page.server.ts.js';

export const index = 23;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/pengawas/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/pengawas/+page.server.ts";
export const imports = ["_app/immutable/nodes/23.dUtIlTFy.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DUDzixAQ.js","_app/immutable/chunks/-TJSwNDh.js","_app/immutable/chunks/BEdG_931.js","_app/immutable/chunks/CzAQhjZv.js","_app/immutable/chunks/GjP_84M4.js","_app/immutable/chunks/DiaExpHg.js","_app/immutable/chunks/DohkKvsF.js","_app/immutable/chunks/Cro4qT6V.js","_app/immutable/chunks/C9mxu4Tt.js","_app/immutable/chunks/wmSitu1K.js"];
export const stylesheets = [];
export const fonts = [];
