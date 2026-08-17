import * as server from '../entries/pages/admin/_page.server.ts.js';

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/+page.server.ts";
export const imports = ["_app/immutable/nodes/9.De1yey3v.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/6x_KM-Kz.js","_app/immutable/chunks/DOZg3a7v.js","_app/immutable/chunks/Dg9RuzyS.js","_app/immutable/chunks/DOI8Cl5d.js","_app/immutable/chunks/zZ2mw7y0.js","_app/immutable/chunks/mlCGHXdM.js","_app/immutable/chunks/Ba2j75td.js","_app/immutable/chunks/B5xf_oRu.js","_app/immutable/chunks/C6NCpCaH.js","_app/immutable/chunks/C1_-IDZG.js","_app/immutable/chunks/BasuolqT.js","_app/immutable/chunks/BJRsbCec.js","_app/immutable/chunks/BA-vAwG_.js","_app/immutable/chunks/DbPvmzWc.js","_app/immutable/chunks/0VxQdYFq.js","_app/immutable/chunks/RznJT3oM.js"];
export const stylesheets = [];
export const fonts = [];
