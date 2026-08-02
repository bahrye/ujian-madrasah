import * as server from '../entries/pages/pengawas/monitor/_page.server.ts.js';

export const index = 24;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/pengawas/monitor/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/pengawas/monitor/+page.server.ts";
export const imports = ["_app/immutable/nodes/24.DcqEzd07.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DUsJYYB0.js","_app/immutable/chunks/CU8GDMOV.js","_app/immutable/chunks/wB4-hfvW.js","_app/immutable/chunks/BXPOcUf6.js","_app/immutable/chunks/3LTNAl1K.js","_app/immutable/chunks/Bdf9-QMz.js","_app/immutable/chunks/C3w7pWtu.js","_app/immutable/chunks/C1wD_v8K.js","_app/immutable/chunks/BxVUYu5z.js","_app/immutable/chunks/DfffyYgv.js","_app/immutable/chunks/C7N5bGVP.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/CoMbuitR.js","_app/immutable/chunks/CcJDwDvi.js","_app/immutable/chunks/4wsoLfBG.js"];
export const stylesheets = [];
export const fonts = [];
