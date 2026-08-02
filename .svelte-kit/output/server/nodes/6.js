import * as server from '../entries/pages/superadmin/_layout.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/superadmin/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/superadmin/+layout.server.ts";
export const imports = ["_app/immutable/nodes/6.Dyn5ZnvG.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/sTNnV60L.js","_app/immutable/chunks/BWk7RVWn.js","_app/immutable/chunks/BTZ-Y-16.js","_app/immutable/chunks/Ctz10O7Q.js","_app/immutable/chunks/DxUHVDz2.js","_app/immutable/chunks/ujSxWJbt.js","_app/immutable/chunks/BsOW4xxs.js","_app/immutable/chunks/H0GCy7x3.js","_app/immutable/chunks/BeRHcy4k.js","_app/immutable/chunks/DwcZ0eX9.js","_app/immutable/chunks/D10N8TFg.js","_app/immutable/chunks/Bd0Sg9L2.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/DgEIujhR.js","_app/immutable/chunks/C783aGWO.js","_app/immutable/chunks/sTTdBBFf.js","_app/immutable/chunks/o7MXILxX.js","_app/immutable/chunks/CcJDwDvi.js"];
export const stylesheets = [];
export const fonts = [];
