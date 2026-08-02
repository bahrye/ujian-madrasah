import * as server from '../entries/pages/pengawas/monitor/_page.server.ts.js';

export const index = 24;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/pengawas/monitor/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/pengawas/monitor/+page.server.ts";
export const imports = ["_app/immutable/nodes/24.DiDlEKtO.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/IezoYWdk.js","_app/immutable/chunks/4sJjlQhy.js","_app/immutable/chunks/ORHH_Igp.js","_app/immutable/chunks/DRBzC1Fe.js","_app/immutable/chunks/DngjJS7A.js","_app/immutable/chunks/BQKkEFI8.js","_app/immutable/chunks/CE5EFgR-.js","_app/immutable/chunks/BAOARYwA.js","_app/immutable/chunks/Bz-vfPr8.js","_app/immutable/chunks/HO8GNNiH.js","_app/immutable/chunks/227Yc9SM.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/j7RNdwiI.js","_app/immutable/chunks/CcJDwDvi.js","_app/immutable/chunks/Dbe9yHDH.js"];
export const stylesheets = [];
export const fonts = [];
