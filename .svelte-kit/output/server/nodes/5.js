import * as server from '../entries/pages/siswa/_layout.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/siswa/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/siswa/+layout.server.ts";
export const imports = ["_app/immutable/nodes/5.BDKurFbS.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/XJHproLa.js","_app/immutable/chunks/Ch6JU-ZP.js","_app/immutable/chunks/hn72lqDK.js","_app/immutable/chunks/C6QVxDtv.js","_app/immutable/chunks/EsZKrxhC.js","_app/immutable/chunks/Bhgwp5-i.js","_app/immutable/chunks/Cb5lUtfP.js","_app/immutable/chunks/DWNKWhhx.js","_app/immutable/chunks/BLI7mfbv.js","_app/immutable/chunks/vkwiERCJ.js","_app/immutable/chunks/D2ipBr9A.js","_app/immutable/chunks/CB_zBapq.js","_app/immutable/chunks/SS6pUT4g.js","_app/immutable/chunks/mTaiw9P4.js","_app/immutable/chunks/DS4QP7q6.js","_app/immutable/chunks/CpKxSNMQ.js","_app/immutable/chunks/wmSitu1K.js"];
export const stylesheets = [];
export const fonts = [];
