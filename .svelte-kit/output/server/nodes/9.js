import * as server from '../entries/pages/admin/bank-soal/_page.server.ts.js';

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/bank-soal/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/bank-soal/+page.server.ts";
export const imports = ["_app/immutable/nodes/9.DDltplHc.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/XJHproLa.js","_app/immutable/chunks/Ch6JU-ZP.js","_app/immutable/chunks/Bhgwp5-i.js","_app/immutable/chunks/EsZKrxhC.js","_app/immutable/chunks/DWNKWhhx.js","_app/immutable/chunks/agXBpoBF.js","_app/immutable/chunks/vkwiERCJ.js","_app/immutable/chunks/C6QVxDtv.js","_app/immutable/chunks/wmSitu1K.js"];
export const stylesheets = [];
export const fonts = [];
