import * as server from '../entries/pages/admin/monitor/_page.server.ts.js';

export const index = 20;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/monitor/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/monitor/+page.server.ts";
export const imports = ["_app/immutable/nodes/20.DgjPTgqz.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CITop0DM.js","_app/immutable/chunks/C1hmICTo.js","_app/immutable/chunks/DemquJGR.js","_app/immutable/chunks/w4CWCeqT.js","_app/immutable/chunks/By9fOhy2.js","_app/immutable/chunks/BAk4rjLj.js","_app/immutable/chunks/BbTj8kse.js","_app/immutable/chunks/DU2Qmv7W.js","_app/immutable/chunks/iOUGVc94.js","_app/immutable/chunks/B5xf_oRu.js","_app/immutable/chunks/CzfOSxal.js","_app/immutable/chunks/iSSBcAib.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/B8rfDDoj.js","_app/immutable/chunks/NPcWGZYY.js","_app/immutable/chunks/WM6WaA-1.js","_app/immutable/chunks/B5bXpDSO.js","_app/immutable/chunks/DY3k6_nC.js","_app/immutable/chunks/DbPvmzWc.js","_app/immutable/chunks/Dw5s3hvE.js","_app/immutable/chunks/-hcCc4zI.js","_app/immutable/chunks/D0g6almG.js","_app/immutable/chunks/yw-NgfFr.js"];
export const stylesheets = [];
export const fonts = [];
