import * as server from '../entries/pages/admin/exams/_page.server.ts.js';

export const index = 12;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/exams/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/exams/+page.server.ts";
export const imports = ["_app/immutable/nodes/12.CH7DZu5R.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/IezoYWdk.js","_app/immutable/chunks/4sJjlQhy.js","_app/immutable/chunks/ORHH_Igp.js","_app/immutable/chunks/DRBzC1Fe.js","_app/immutable/chunks/DngjJS7A.js","_app/immutable/chunks/BQKkEFI8.js","_app/immutable/chunks/dT5EG4FX.js","_app/immutable/chunks/0cOhpd4V.js","_app/immutable/chunks/Bz-vfPr8.js","_app/immutable/chunks/HO8GNNiH.js","_app/immutable/chunks/23xvJz2n.js","_app/immutable/chunks/B9FCRLYK.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/j7RNdwiI.js","_app/immutable/chunks/CcJDwDvi.js","_app/immutable/chunks/Dbe9yHDH.js"];
export const stylesheets = [];
export const fonts = [];
