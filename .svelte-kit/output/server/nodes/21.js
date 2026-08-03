import * as server from '../entries/pages/guru/_page.server.ts.js';

export const index = 21;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/guru/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/guru/+page.server.ts";
export const imports = ["_app/immutable/nodes/21.DgdJAHku.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BV1hr-UK.js","_app/immutable/chunks/BxH7Qk13.js","_app/immutable/chunks/DIMz4J0V.js","_app/immutable/chunks/B-vHU7aS.js","_app/immutable/chunks/CJVAUuBs.js","_app/immutable/chunks/DUFUeTgQ.js","_app/immutable/chunks/DHon3iv8.js","_app/immutable/chunks/5wCGNfvK.js","_app/immutable/chunks/sHRz0Lil.js","_app/immutable/chunks/C3TyuUHs.js"];
export const stylesheets = [];
export const fonts = [];
