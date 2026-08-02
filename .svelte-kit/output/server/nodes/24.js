import * as server from '../entries/pages/pengawas/monitor/_page.server.ts.js';

export const index = 24;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/pengawas/monitor/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/pengawas/monitor/+page.server.ts";
export const imports = ["_app/immutable/nodes/24.CLYzyPIc.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CFq-DMXR.js","_app/immutable/chunks/AVlRLuFf.js","_app/immutable/chunks/lbA49JLM.js","_app/immutable/chunks/9xN4Tp6_.js","_app/immutable/chunks/CXjYioOk.js","_app/immutable/chunks/CRecri0e.js","_app/immutable/chunks/BCe4d04r.js","_app/immutable/chunks/DlzSeXTU.js","_app/immutable/chunks/8nsapH9C.js","_app/immutable/chunks/CTCe_Py5.js","_app/immutable/chunks/_akGJUBL.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/DR-IX7qX.js","_app/immutable/chunks/CC2uZoHq.js","_app/immutable/chunks/CcJDwDvi.js","_app/immutable/chunks/B6lMH4d6.js"];
export const stylesheets = [];
export const fonts = [];
