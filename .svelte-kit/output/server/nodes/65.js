import * as server from '../entries/pages/print/kartu/_exam_id_/_page.server.ts.js';

export const index = 65;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/print/kartu/_exam_id_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/print/kartu/[exam_id]/+page.server.ts";
export const imports = ["_app/immutable/nodes/65.CyRlq1IG.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BSevKU_i.js","_app/immutable/chunks/C1iwYQEC.js","_app/immutable/chunks/CpNQxTAW.js","_app/immutable/chunks/klE4_vFh.js","_app/immutable/chunks/s8-Vb9Km.js","_app/immutable/chunks/DEDvlLfQ.js","_app/immutable/chunks/iHfl78vX.js","_app/immutable/chunks/RbyIVtyM.js","_app/immutable/chunks/qu17wuJm.js","_app/immutable/chunks/BPD4iswW.js","_app/immutable/chunks/iQAfk_ag.js","_app/immutable/chunks/O-HmUUsL.js"];
export const stylesheets = [];
export const fonts = [];
