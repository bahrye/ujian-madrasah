import * as server from '../entries/pages/pengawas/_layout.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/pengawas/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/pengawas/+layout.server.ts";
export const imports = ["_app/immutable/nodes/4.DhbDoGqX.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/6x_KM-Kz.js","_app/immutable/chunks/DOZg3a7v.js","_app/immutable/chunks/CvzHmU1D.js","_app/immutable/chunks/C1_-IDZG.js","_app/immutable/chunks/BasuolqT.js","_app/immutable/chunks/BJRsbCec.js","_app/immutable/chunks/BA-vAwG_.js","_app/immutable/chunks/DVVdW3Ew.js","_app/immutable/chunks/Dg9RuzyS.js","_app/immutable/chunks/DOI8Cl5d.js","_app/immutable/chunks/zZ2mw7y0.js","_app/immutable/chunks/BuVnnTUz.js","_app/immutable/chunks/Ba2j75td.js","_app/immutable/chunks/B5xf_oRu.js","_app/immutable/chunks/DXj087wk.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/B4boIcdg.js","_app/immutable/chunks/BoUE2LXW.js","_app/immutable/chunks/gqIzBvjN.js","_app/immutable/chunks/_o5hkGCt.js","_app/immutable/chunks/RznJT3oM.js","_app/immutable/chunks/euQgGAy5.js","_app/immutable/chunks/Cs4Ebf8o.js","_app/immutable/chunks/DbPvmzWc.js","_app/immutable/chunks/CFXE84Gq.js"];
export const stylesheets = [];
export const fonts = [];
