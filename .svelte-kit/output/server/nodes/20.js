import * as server from '../entries/pages/admin/subjects/_page.server.ts.js';

export const index = 20;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/subjects/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/subjects/+page.server.ts";
export const imports = ["_app/immutable/nodes/20.DadXzq9u.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/B0ijxZbD.js","_app/immutable/chunks/DPNwnKeP.js","_app/immutable/chunks/3bMWRm-j.js","_app/immutable/chunks/BbB0bEjC.js","_app/immutable/chunks/DArLYInW.js","_app/immutable/chunks/fzEvb87m.js","_app/immutable/chunks/CHxmxP7F.js","_app/immutable/chunks/Bhp47AVO.js","_app/immutable/chunks/CX1LO43l.js","_app/immutable/chunks/cHPm6rwh.js","_app/immutable/chunks/C2PwgiAd.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/BRJ75Y6A.js","_app/immutable/chunks/B13sAwyh.js","_app/immutable/chunks/BD0xYbDy.js","_app/immutable/chunks/CGSopBCG.js","_app/immutable/chunks/DkyPrVKW.js","_app/immutable/chunks/BtaQ6AmQ.js","_app/immutable/chunks/CN-RRP4J.js","_app/immutable/chunks/DNeMqas3.js","_app/immutable/chunks/p3bNDk1t.js","_app/immutable/chunks/BGA0cP6U.js"];
export const stylesheets = [];
export const fonts = [];
