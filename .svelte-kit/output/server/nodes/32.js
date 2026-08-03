import * as server from '../entries/pages/pengawas/monitor/_page.server.ts.js';

export const index = 32;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/pengawas/monitor/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/pengawas/monitor/+page.server.ts";
export const imports = ["_app/immutable/nodes/32.D0xe52pg.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BV1hr-UK.js","_app/immutable/chunks/BxH7Qk13.js","_app/immutable/chunks/CSCmeJqC.js","_app/immutable/chunks/DIMz4J0V.js","_app/immutable/chunks/DHon3iv8.js","_app/immutable/chunks/B-vHU7aS.js","_app/immutable/chunks/CJVAUuBs.js","_app/immutable/chunks/CU4UqKC8.js","_app/immutable/chunks/Bhm67iwx.js","_app/immutable/chunks/ZhyRUZK4.js","_app/immutable/chunks/DUFUeTgQ.js","_app/immutable/chunks/sHRz0Lil.js","_app/immutable/chunks/DhFlSuqP.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/CX_A_iYc.js","_app/immutable/chunks/CaJZ9qC3.js","_app/immutable/chunks/RHhvIjaC.js"];
export const stylesheets = [];
export const fonts = [];
