import * as server from '../entries/pages/admin/students/_page.server.ts.js';

export const index = 15;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/students/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/students/+page.server.ts";
export const imports = ["_app/immutable/nodes/15.aTvwlKn6.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CFq-DMXR.js","_app/immutable/chunks/AVlRLuFf.js","_app/immutable/chunks/lbA49JLM.js","_app/immutable/chunks/9xN4Tp6_.js","_app/immutable/chunks/CXjYioOk.js","_app/immutable/chunks/CRecri0e.js","_app/immutable/chunks/BCe4d04r.js","_app/immutable/chunks/DlzSeXTU.js","_app/immutable/chunks/8nsapH9C.js","_app/immutable/chunks/CTCe_Py5.js","_app/immutable/chunks/_akGJUBL.js","_app/immutable/chunks/Dh-SComL.js","_app/immutable/chunks/DR-IX7qX.js","_app/immutable/chunks/B6lMH4d6.js"];
export const stylesheets = [];
export const fonts = [];
