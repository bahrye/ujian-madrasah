import * as server from '../entries/pages/admin/exams/_page.server.ts.js';

export const index = 12;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/exams/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/exams/+page.server.ts";
export const imports = ["_app/immutable/nodes/12.DeVh4ciD.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/XJHproLa.js","_app/immutable/chunks/Ch6JU-ZP.js","_app/immutable/chunks/Bhgwp5-i.js","_app/immutable/chunks/EsZKrxhC.js","_app/immutable/chunks/DWNKWhhx.js","_app/immutable/chunks/agXBpoBF.js","_app/immutable/chunks/ByKUxWAE.js","_app/immutable/chunks/DS4QP7q6.js","_app/immutable/chunks/CpKxSNMQ.js","_app/immutable/chunks/vkwiERCJ.js","_app/immutable/chunks/f0D7Ro0S.js","_app/immutable/chunks/D27nI7KM.js","_app/immutable/chunks/SS6pUT4g.js","_app/immutable/chunks/C6QVxDtv.js","_app/immutable/chunks/wmSitu1K.js","_app/immutable/chunks/CB_zBapq.js"];
export const stylesheets = [];
export const fonts = [];
