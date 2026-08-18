import * as server from '../entries/pages/print/kartu/type/_typeId_/_page.server.ts.js';

export const index = 64;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/print/kartu/type/_typeId_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/print/kartu/type/[typeId]/+page.server.ts";
export const imports = ["_app/immutable/nodes/64.21HmqctB.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BSevKU_i.js","_app/immutable/chunks/C1iwYQEC.js","_app/immutable/chunks/C4l_QUTv.js","_app/immutable/chunks/klE4_vFh.js","_app/immutable/chunks/s8-Vb9Km.js","_app/immutable/chunks/DEDvlLfQ.js","_app/immutable/chunks/CSSbYJ54.js","_app/immutable/chunks/B5xf_oRu.js","_app/immutable/chunks/iHfl78vX.js","_app/immutable/chunks/RbyIVtyM.js","_app/immutable/chunks/qu17wuJm.js","_app/immutable/chunks/BPD4iswW.js","_app/immutable/chunks/sH0DAvFM.js"];
export const stylesheets = ["_app/immutable/assets/64.roWMPQR0.css"];
export const fonts = [];
