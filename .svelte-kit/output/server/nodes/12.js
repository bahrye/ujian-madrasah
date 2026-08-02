import * as server from '../entries/pages/guru/_page.server.ts.js';

export const index = 12;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/guru/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/guru/+page.server.ts";
export const imports = ["_app/immutable/nodes/12.XdeMSUhj.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/Dq_Rz00O.js","_app/immutable/chunks/DessmbUq.js","_app/immutable/chunks/DOJsHMrm.js","_app/immutable/chunks/BqIN69hD.js","_app/immutable/chunks/CexrI33E.js","_app/immutable/chunks/C6iW4SJY.js","_app/immutable/chunks/4UOKLfAq.js","_app/immutable/chunks/XkMkWOCG.js","_app/immutable/chunks/Bs8jRRu2.js","_app/immutable/chunks/C27vI7iq.js","_app/immutable/chunks/BsVi_vsh.js"];
export const stylesheets = [];
export const fonts = [];
