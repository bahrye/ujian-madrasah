import * as server from '../entries/pages/siswa/_layout.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/siswa/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/siswa/+layout.server.ts";
export const imports = ["_app/immutable/nodes/5.DpRls33s.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/IezoYWdk.js","_app/immutable/chunks/4sJjlQhy.js","_app/immutable/chunks/DbIJ5SVL.js","_app/immutable/chunks/HO8GNNiH.js","_app/immutable/chunks/DRBzC1Fe.js","_app/immutable/chunks/ORHH_Igp.js","_app/immutable/chunks/Dam0L_iG.js","_app/immutable/chunks/DngjJS7A.js","_app/immutable/chunks/CyNw4OuR.js","_app/immutable/chunks/227Yc9SM.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/j7RNdwiI.js","_app/immutable/chunks/reQfrKqm.js","_app/immutable/chunks/BaN57rcw.js","_app/immutable/chunks/Bz-vfPr8.js","_app/immutable/chunks/CcJDwDvi.js","_app/immutable/chunks/BNZVktfm.js","_app/immutable/chunks/Dbe9yHDH.js"];
export const stylesheets = [];
export const fonts = [];
