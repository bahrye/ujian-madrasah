import * as server from '../entries/pages/superadmin/_layout.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/superadmin/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/superadmin/+layout.server.ts";
export const imports = ["_app/immutable/nodes/6.DchORcJh.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/IezoYWdk.js","_app/immutable/chunks/4sJjlQhy.js","_app/immutable/chunks/DbIJ5SVL.js","_app/immutable/chunks/HO8GNNiH.js","_app/immutable/chunks/DRBzC1Fe.js","_app/immutable/chunks/ORHH_Igp.js","_app/immutable/chunks/CJ5i2fCm.js","_app/immutable/chunks/DngjJS7A.js","_app/immutable/chunks/CyNw4OuR.js","_app/immutable/chunks/227Yc9SM.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/j7RNdwiI.js","_app/immutable/chunks/DEjw_0G9.js","_app/immutable/chunks/CSjRjWuT.js","_app/immutable/chunks/Bz-vfPr8.js","_app/immutable/chunks/CcJDwDvi.js","_app/immutable/chunks/BNZVktfm.js","_app/immutable/chunks/Dbe9yHDH.js"];
export const stylesheets = [];
export const fonts = [];
