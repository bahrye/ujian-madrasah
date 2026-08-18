import * as server from '../entries/pages/print/berita-acara/_exam_id_/_page.server.ts.js';

export const index = 60;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/print/berita-acara/_exam_id_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/print/berita-acara/[exam_id]/+page.server.ts";
export const imports = ["_app/immutable/nodes/60.V3WNZZEb.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/B3hsJeW7.js","_app/immutable/chunks/D9IgJ_RW.js","_app/immutable/chunks/D9tcitos.js","_app/immutable/chunks/e2idzwbV.js","_app/immutable/chunks/CRdii_PC.js","_app/immutable/chunks/BdmV_moa.js","_app/immutable/chunks/CLHZOUS6.js","_app/immutable/chunks/B5xf_oRu.js","_app/immutable/chunks/BWrrLwMy.js","_app/immutable/chunks/CqXZa_Mr.js","_app/immutable/chunks/qH3QSuMN.js","_app/immutable/chunks/BTEs37z5.js","_app/immutable/chunks/BPxfzyQp.js","_app/immutable/chunks/DbPvmzWc.js"];
export const stylesheets = ["_app/immutable/assets/60.DGZBcpNZ.css"];
export const fonts = [];
