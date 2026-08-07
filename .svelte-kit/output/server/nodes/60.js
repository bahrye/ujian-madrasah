import * as server from '../entries/pages/superadmin/_page.server.ts.js';

export const index = 60;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/superadmin/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/superadmin/+page.server.ts";
export const imports = ["_app/immutable/nodes/60.B28LPNdG.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/_VlQjsMb.js","_app/immutable/chunks/X9E9MVLd.js","_app/immutable/chunks/BpR9xdGE.js","_app/immutable/chunks/Bayx_-Iy.js","_app/immutable/chunks/Cy-rfgOk.js","_app/immutable/chunks/DYWR7A6J.js","_app/immutable/chunks/FWi0F-kh.js","_app/immutable/chunks/DkAnnHmn.js","_app/immutable/chunks/CaGhXwzM.js","_app/immutable/chunks/B3lpDNJ6.js","_app/immutable/chunks/CjGyJir6.js","_app/immutable/chunks/n2FWIFl8.js","_app/immutable/chunks/V1n46n78.js","_app/immutable/chunks/DbQjt9qb.js","_app/immutable/chunks/B5xf_oRu.js","_app/immutable/chunks/DgSQwxXL.js"];
export const stylesheets = [];
export const fonts = [];
