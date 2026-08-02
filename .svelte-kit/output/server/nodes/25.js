import * as server from '../entries/pages/pengawas/tokens/_page.server.ts.js';

export const index = 25;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/pengawas/tokens/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/pengawas/tokens/+page.server.ts";
export const imports = ["_app/immutable/nodes/25.CnrejKnj.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/IezoYWdk.js","_app/immutable/chunks/4sJjlQhy.js","_app/immutable/chunks/Bz-vfPr8.js","_app/immutable/chunks/ORHH_Igp.js","_app/immutable/chunks/DRBzC1Fe.js","_app/immutable/chunks/DngjJS7A.js","_app/immutable/chunks/BQKkEFI8.js","_app/immutable/chunks/cXXC-rXM.js","_app/immutable/chunks/BajqonBB.js","_app/immutable/chunks/HO8GNNiH.js","_app/immutable/chunks/227Yc9SM.js","_app/immutable/chunks/B9FCRLYK.js","_app/immutable/chunks/CcJDwDvi.js","_app/immutable/chunks/Dbe9yHDH.js","_app/immutable/chunks/tUwqYXC6.js"];
export const stylesheets = [];
export const fonts = [];
