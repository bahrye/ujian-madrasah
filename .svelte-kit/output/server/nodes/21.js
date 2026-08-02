import * as server from '../entries/pages/guru/penilaian/_page.server.ts.js';

export const index = 21;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/guru/penilaian/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/guru/penilaian/+page.server.ts";
export const imports = ["_app/immutable/nodes/21.DdatH111.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/sTNnV60L.js","_app/immutable/chunks/BWk7RVWn.js","_app/immutable/chunks/ujSxWJbt.js","_app/immutable/chunks/DxUHVDz2.js","_app/immutable/chunks/H0GCy7x3.js","_app/immutable/chunks/wIr1SkV4.js","_app/immutable/chunks/D9If6Oie.js","_app/immutable/chunks/sTTdBBFf.js","_app/immutable/chunks/o7MXILxX.js","_app/immutable/chunks/DwcZ0eX9.js","_app/immutable/chunks/D10N8TFg.js","_app/immutable/chunks/Ctz10O7Q.js","_app/immutable/chunks/CcJDwDvi.js","_app/immutable/chunks/Bd0Sg9L2.js"];
export const stylesheets = [];
export const fonts = [];
