import * as server from '../entries/pages/admin/_layout.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/+layout.server.ts";
export const imports = ["_app/immutable/nodes/2.B7Am3avA.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/XJHproLa.js","_app/immutable/chunks/Ch6JU-ZP.js","_app/immutable/chunks/hn72lqDK.js","_app/immutable/chunks/C6QVxDtv.js","_app/immutable/chunks/EsZKrxhC.js","_app/immutable/chunks/Bhgwp5-i.js","_app/immutable/chunks/x6kFKx9C.js","_app/immutable/chunks/DWNKWhhx.js","_app/immutable/chunks/BLI7mfbv.js","_app/immutable/chunks/vkwiERCJ.js","_app/immutable/chunks/D2ipBr9A.js","_app/immutable/chunks/CB_zBapq.js","_app/immutable/chunks/SS6pUT4g.js","_app/immutable/chunks/Wbc0Fc4U.js","_app/immutable/chunks/Dz8ORDNu.js","_app/immutable/chunks/CpKxSNMQ.js","_app/immutable/chunks/wmSitu1K.js"];
export const stylesheets = [];
export const fonts = [];
