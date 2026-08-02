import * as server from '../entries/pages/siswa/_layout.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/siswa/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/siswa/+layout.server.ts";
export const imports = ["_app/immutable/nodes/5.CBDn__Kr.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CFq-DMXR.js","_app/immutable/chunks/AVlRLuFf.js","_app/immutable/chunks/QH71-4V9.js","_app/immutable/chunks/DR-IX7qX.js","_app/immutable/chunks/9xN4Tp6_.js","_app/immutable/chunks/lbA49JLM.js","_app/immutable/chunks/B_T09O_c.js","_app/immutable/chunks/CXjYioOk.js","_app/immutable/chunks/CtfNg4u3.js","_app/immutable/chunks/CTCe_Py5.js","_app/immutable/chunks/_akGJUBL.js","_app/immutable/chunks/B6lMH4d6.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/CC2uZoHq.js","_app/immutable/chunks/CN5U9A7i.js","_app/immutable/chunks/DlzSeXTU.js","_app/immutable/chunks/8nsapH9C.js","_app/immutable/chunks/CcJDwDvi.js"];
export const stylesheets = [];
export const fonts = [];
