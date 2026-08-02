import * as server from '../entries/pages/superadmin/schools/_page.server.ts.js';

export const index = 31;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/superadmin/schools/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/superadmin/schools/+page.server.ts";
export const imports = ["_app/immutable/nodes/31.BFY0GTS-.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/XJHproLa.js","_app/immutable/chunks/Ch6JU-ZP.js","_app/immutable/chunks/Bhgwp5-i.js","_app/immutable/chunks/EsZKrxhC.js","_app/immutable/chunks/DWNKWhhx.js","_app/immutable/chunks/agXBpoBF.js","_app/immutable/chunks/ByKUxWAE.js","_app/immutable/chunks/DS4QP7q6.js","_app/immutable/chunks/CpKxSNMQ.js","_app/immutable/chunks/vkwiERCJ.js","_app/immutable/chunks/D2ipBr9A.js","_app/immutable/chunks/C6QVxDtv.js","_app/immutable/chunks/CB_zBapq.js"];
export const stylesheets = [];
export const fonts = [];
