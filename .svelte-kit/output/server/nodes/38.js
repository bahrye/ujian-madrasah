import * as server from '../entries/pages/superadmin/_page.server.ts.js';

export const index = 38;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/superadmin/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/superadmin/+page.server.ts";
export const imports = ["_app/immutable/nodes/38.B6Xq3g5Y.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BV1hr-UK.js","_app/immutable/chunks/BxH7Qk13.js","_app/immutable/chunks/DIMz4J0V.js","_app/immutable/chunks/DHon3iv8.js","_app/immutable/chunks/B-vHU7aS.js","_app/immutable/chunks/CJVAUuBs.js","_app/immutable/chunks/DUFUeTgQ.js","_app/immutable/chunks/5wCGNfvK.js","_app/immutable/chunks/sHRz0Lil.js"];
export const stylesheets = [];
export const fonts = [];
