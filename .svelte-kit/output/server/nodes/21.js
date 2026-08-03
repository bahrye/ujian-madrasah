import * as server from '../entries/pages/guru/_page.server.ts.js';

export const index = 21;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/guru/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/guru/+page.server.ts";
export const imports = ["_app/immutable/nodes/21.BGQIuwOi.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/B0ijxZbD.js","_app/immutable/chunks/DPNwnKeP.js","_app/immutable/chunks/3bMWRm-j.js","_app/immutable/chunks/DArLYInW.js","_app/immutable/chunks/fzEvb87m.js","_app/immutable/chunks/C2PwgiAd.js","_app/immutable/chunks/BRJ75Y6A.js","_app/immutable/chunks/BD0xYbDy.js","_app/immutable/chunks/BbB0bEjC.js","_app/immutable/chunks/Fw2DnseW.js","_app/immutable/chunks/CN-RRP4J.js","_app/immutable/chunks/DNeMqas3.js","_app/immutable/chunks/Bq16tzCR.js"];
export const stylesheets = [];
export const fonts = [];
