import * as server from '../entries/pages/admin/bank-soal/_page.server.ts.js';

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/bank-soal/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/bank-soal/+page.server.ts";
export const imports = ["_app/immutable/nodes/9.D8p8trjg.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CFq-DMXR.js","_app/immutable/chunks/AVlRLuFf.js","_app/immutable/chunks/lbA49JLM.js","_app/immutable/chunks/9xN4Tp6_.js","_app/immutable/chunks/CXjYioOk.js","_app/immutable/chunks/CRecri0e.js","_app/immutable/chunks/X3wsyzLk.js","_app/immutable/chunks/BGvN7eZ5.js","_app/immutable/chunks/8nsapH9C.js","_app/immutable/chunks/CTCe_Py5.js","_app/immutable/chunks/Dh-SComL.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/DR-IX7qX.js","_app/immutable/chunks/CcJDwDvi.js"];
export const stylesheets = [];
export const fonts = [];
