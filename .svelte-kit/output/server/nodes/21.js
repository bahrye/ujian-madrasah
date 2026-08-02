import * as server from '../entries/pages/guru/penilaian/_page.server.ts.js';

export const index = 21;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/guru/penilaian/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/guru/penilaian/+page.server.ts";
export const imports = ["_app/immutable/nodes/21.DfeBupTW.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/IezoYWdk.js","_app/immutable/chunks/4sJjlQhy.js","_app/immutable/chunks/ORHH_Igp.js","_app/immutable/chunks/DRBzC1Fe.js","_app/immutable/chunks/DngjJS7A.js","_app/immutable/chunks/BQKkEFI8.js","_app/immutable/chunks/CrY0nwtS.js","_app/immutable/chunks/DQwcUQzm.js","_app/immutable/chunks/Bz-vfPr8.js","_app/immutable/chunks/HO8GNNiH.js","_app/immutable/chunks/227Yc9SM.js","_app/immutable/chunks/CcJDwDvi.js","_app/immutable/chunks/Dbe9yHDH.js"];
export const stylesheets = [];
export const fonts = [];
