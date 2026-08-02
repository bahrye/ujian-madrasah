import * as server from '../entries/pages/admin/results/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/results/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/results/+page.server.ts";
export const imports = ["_app/immutable/nodes/10.C4fN7cPb.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/Dq_Rz00O.js","_app/immutable/chunks/DessmbUq.js","_app/immutable/chunks/DOJsHMrm.js","_app/immutable/chunks/XkMkWOCG.js","_app/immutable/chunks/BqIN69hD.js","_app/immutable/chunks/CexrI33E.js","_app/immutable/chunks/C27vI7iq.js","_app/immutable/chunks/4UOKLfAq.js","_app/immutable/chunks/BsVi_vsh.js"];
export const stylesheets = [];
export const fonts = [];
