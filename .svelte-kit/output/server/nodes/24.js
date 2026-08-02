import * as server from '../entries/pages/pengawas/monitor/_page.server.ts.js';

export const index = 24;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/pengawas/monitor/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/pengawas/monitor/+page.server.ts";
export const imports = ["_app/immutable/nodes/24.DCx5cr7e.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/XJHproLa.js","_app/immutable/chunks/Ch6JU-ZP.js","_app/immutable/chunks/Bhgwp5-i.js","_app/immutable/chunks/EsZKrxhC.js","_app/immutable/chunks/DWNKWhhx.js","_app/immutable/chunks/agXBpoBF.js","_app/immutable/chunks/ByKUxWAE.js","_app/immutable/chunks/DS4QP7q6.js","_app/immutable/chunks/CpKxSNMQ.js","_app/immutable/chunks/vkwiERCJ.js","_app/immutable/chunks/D2ipBr9A.js","_app/immutable/chunks/SS6pUT4g.js","_app/immutable/chunks/C6QVxDtv.js","_app/immutable/chunks/wmSitu1K.js","_app/immutable/chunks/CB_zBapq.js"];
export const stylesheets = [];
export const fonts = [];
