import * as server from '../entries/pages/superadmin/_page.server.ts.js';

export const index = 30;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/superadmin/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/superadmin/+page.server.ts";
export const imports = ["_app/immutable/nodes/30.DEZL1iVF.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DUsJYYB0.js","_app/immutable/chunks/CU8GDMOV.js","_app/immutable/chunks/wB4-hfvW.js","_app/immutable/chunks/BXPOcUf6.js","_app/immutable/chunks/3LTNAl1K.js","_app/immutable/chunks/Bdf9-QMz.js","_app/immutable/chunks/DfffyYgv.js","_app/immutable/chunks/Dnl1TGkb.js","_app/immutable/chunks/C7N5bGVP.js"];
export const stylesheets = [];
export const fonts = [];
