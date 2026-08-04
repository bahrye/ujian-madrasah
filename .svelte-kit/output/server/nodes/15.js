import * as server from '../entries/pages/admin/media-bank/_page.server.ts.js';

export const index = 15;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/media-bank/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/media-bank/+page.server.ts";
export const imports = ["_app/immutable/nodes/15.Ch0pinDe.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/B0ijxZbD.js","_app/immutable/chunks/DPNwnKeP.js","_app/immutable/chunks/3bMWRm-j.js","_app/immutable/chunks/BbB0bEjC.js","_app/immutable/chunks/DArLYInW.js","_app/immutable/chunks/fzEvb87m.js","_app/immutable/chunks/D5moDLie.js","_app/immutable/chunks/LeSFzz4r.js","_app/immutable/chunks/CX1LO43l.js","_app/immutable/chunks/DKTjufxK.js","_app/immutable/chunks/C2PwgiAd.js","_app/immutable/chunks/CN-RRP4J.js","_app/immutable/chunks/DNeMqas3.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/BRJ75Y6A.js","_app/immutable/chunks/B13sAwyh.js","_app/immutable/chunks/BD0xYbDy.js","_app/immutable/chunks/U5-DdvY4.js","_app/immutable/chunks/HLPvsicz.js","_app/immutable/chunks/p3bNDk1t.js","_app/immutable/chunks/BohRGGTn.js"];
export const stylesheets = [];
export const fonts = [];
