import * as server from '../entries/pages/admin/results/_page.server.ts.js';

export const index = 16;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/results/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/results/+page.server.ts";
export const imports = ["_app/immutable/nodes/16.BJmuslDp.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/B0ijxZbD.js","_app/immutable/chunks/DPNwnKeP.js","_app/immutable/chunks/3bMWRm-j.js","_app/immutable/chunks/BbB0bEjC.js","_app/immutable/chunks/DArLYInW.js","_app/immutable/chunks/fzEvb87m.js","_app/immutable/chunks/C2PwgiAd.js","_app/immutable/chunks/CN-RRP4J.js","_app/immutable/chunks/DNeMqas3.js","_app/immutable/chunks/BRJ75Y6A.js","_app/immutable/chunks/BD0xYbDy.js","_app/immutable/chunks/J_MZ1nqz.js","_app/immutable/chunks/CX1LO43l.js","_app/immutable/chunks/BjHZ6aL8.js","_app/immutable/chunks/DUrP-I1y.js","_app/immutable/chunks/DkyPrVKW.js","_app/immutable/chunks/BtaQ6AmQ.js","_app/immutable/chunks/DdyDujZQ.js","_app/immutable/chunks/B_CwwvAB.js","_app/immutable/chunks/p3bNDk1t.js"];
export const stylesheets = [];
export const fonts = [];
