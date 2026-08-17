import * as server from '../entries/pages/admin/results/_page.server.ts.js';

export const index = 25;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/results/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/results/+page.server.ts";
export const imports = ["_app/immutable/nodes/25.DIn7jD1S.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/6x_KM-Kz.js","_app/immutable/chunks/DOZg3a7v.js","_app/immutable/chunks/_o5hkGCt.js","_app/immutable/chunks/Dg9RuzyS.js","_app/immutable/chunks/DOI8Cl5d.js","_app/immutable/chunks/zZ2mw7y0.js","_app/immutable/chunks/mlCGHXdM.js","_app/immutable/chunks/BYNha9Up.js","_app/immutable/chunks/Ba2j75td.js","_app/immutable/chunks/B5xf_oRu.js","_app/immutable/chunks/C1_-IDZG.js","_app/immutable/chunks/BasuolqT.js","_app/immutable/chunks/BJRsbCec.js","_app/immutable/chunks/BA-vAwG_.js","_app/immutable/chunks/DbPvmzWc.js","_app/immutable/chunks/DG99rMYe.js","_app/immutable/chunks/DA9aaspQ.js","_app/immutable/chunks/BOeQCzk7.js","_app/immutable/chunks/ADB_46Wj.js","_app/immutable/chunks/CxtcGqoz.js","_app/immutable/chunks/CvzHmU1D.js","_app/immutable/chunks/BuVnnTUz.js","_app/immutable/chunks/DXj087wk.js","_app/immutable/chunks/BSI2mhrl.js","_app/immutable/chunks/CyVzE_Zz.js","_app/immutable/chunks/CKN5doRT.js","_app/immutable/chunks/euQgGAy5.js"];
export const stylesheets = [];
export const fonts = [];
