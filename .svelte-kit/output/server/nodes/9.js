import * as server from '../entries/pages/admin/bank-soal/_page.server.ts.js';

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/bank-soal/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/bank-soal/+page.server.ts";
export const imports = ["_app/immutable/nodes/9.Cd3z0rJ1.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/IezoYWdk.js","_app/immutable/chunks/4sJjlQhy.js","_app/immutable/chunks/ORHH_Igp.js","_app/immutable/chunks/DRBzC1Fe.js","_app/immutable/chunks/DngjJS7A.js","_app/immutable/chunks/BQKkEFI8.js","_app/immutable/chunks/DqwKuy76.js","_app/immutable/chunks/BBemU5uL.js","_app/immutable/chunks/Bz-vfPr8.js","_app/immutable/chunks/HO8GNNiH.js","_app/immutable/chunks/B9FCRLYK.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/CcJDwDvi.js"];
export const stylesheets = [];
export const fonts = [];
