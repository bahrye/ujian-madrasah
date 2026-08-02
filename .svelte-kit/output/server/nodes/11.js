import * as server from '../entries/pages/admin/classes/_page.server.ts.js';

export const index = 11;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/classes/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/classes/+page.server.ts";
export const imports = ["_app/immutable/nodes/11.DrxZ8e0M.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/XJHproLa.js","_app/immutable/chunks/Ch6JU-ZP.js","_app/immutable/chunks/Bhgwp5-i.js","_app/immutable/chunks/EsZKrxhC.js","_app/immutable/chunks/DWNKWhhx.js","_app/immutable/chunks/agXBpoBF.js","_app/immutable/chunks/CoCdk3MR.js","_app/immutable/chunks/Dz8ORDNu.js","_app/immutable/chunks/CpKxSNMQ.js","_app/immutable/chunks/vkwiERCJ.js","_app/immutable/chunks/C6QVxDtv.js","_app/immutable/chunks/CB_zBapq.js"];
export const stylesheets = [];
export const fonts = [];
