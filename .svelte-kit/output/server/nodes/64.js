import * as server from '../entries/pages/siswa/_page.server.ts.js';

export const index = 64;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/siswa/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/siswa/+page.server.ts";
export const imports = ["_app/immutable/nodes/64.BRqGdTDD.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CITop0DM.js","_app/immutable/chunks/C1hmICTo.js","_app/immutable/chunks/DemquJGR.js","_app/immutable/chunks/w4CWCeqT.js","_app/immutable/chunks/By9fOhy2.js","_app/immutable/chunks/BAk4rjLj.js","_app/immutable/chunks/BbTj8kse.js","_app/immutable/chunks/iOUGVc94.js","_app/immutable/chunks/B5xf_oRu.js","_app/immutable/chunks/BK2hv9bf.js","_app/immutable/chunks/B8rfDDoj.js","_app/immutable/chunks/WM6WaA-1.js","_app/immutable/chunks/B5bXpDSO.js","_app/immutable/chunks/DY3k6_nC.js","_app/immutable/chunks/RznJT3oM.js","_app/immutable/chunks/DbPvmzWc.js","_app/immutable/chunks/iQAfk_ag.js","_app/immutable/chunks/BfIzyd1i.js"];
export const stylesheets = [];
export const fonts = [];
