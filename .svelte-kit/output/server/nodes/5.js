import * as server from '../entries/pages/print/_layout.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/print/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/print/+layout.server.ts";
export const imports = ["_app/immutable/nodes/5.CPrJRAKc.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/q3ZFHJDQ.js","_app/immutable/chunks/ClRrpZeN.js","_app/immutable/chunks/CiiCNIbB.js","_app/immutable/chunks/DbEAIv_x.js","_app/immutable/chunks/BKlKzBv1.js","_app/immutable/chunks/i_5gAELL.js","_app/immutable/chunks/oZ_RSl7A.js"];
export const stylesheets = [];
export const fonts = [];
