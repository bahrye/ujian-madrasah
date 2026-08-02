import * as server from '../entries/pages/admin/students/_page.server.ts.js';

export const index = 15;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/students/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/students/+page.server.ts";
export const imports = ["_app/immutable/nodes/15.mIdrPC4I.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/IezoYWdk.js","_app/immutable/chunks/4sJjlQhy.js","_app/immutable/chunks/ORHH_Igp.js","_app/immutable/chunks/DRBzC1Fe.js","_app/immutable/chunks/DngjJS7A.js","_app/immutable/chunks/BQKkEFI8.js","_app/immutable/chunks/cXXC-rXM.js","_app/immutable/chunks/BajqonBB.js","_app/immutable/chunks/Bz-vfPr8.js","_app/immutable/chunks/HO8GNNiH.js","_app/immutable/chunks/227Yc9SM.js","_app/immutable/chunks/B9FCRLYK.js","_app/immutable/chunks/RtMt4zXj.js","_app/immutable/chunks/DbIJ5SVL.js","_app/immutable/chunks/CyNw4OuR.js","_app/immutable/chunks/HUMXMPGN.js","_app/immutable/chunks/Dbe9yHDH.js"];
export const stylesheets = [];
export const fonts = [];
