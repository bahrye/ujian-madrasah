import * as server from '../entries/pages/pengawas/tokens/_page.server.ts.js';

export const index = 25;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/pengawas/tokens/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/pengawas/tokens/+page.server.ts";
export const imports = ["_app/immutable/nodes/25.CoPxGRl7.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/sTNnV60L.js","_app/immutable/chunks/BWk7RVWn.js","_app/immutable/chunks/o7MXILxX.js","_app/immutable/chunks/ujSxWJbt.js","_app/immutable/chunks/DxUHVDz2.js","_app/immutable/chunks/H0GCy7x3.js","_app/immutable/chunks/wIr1SkV4.js","_app/immutable/chunks/A8wvgMQb.js","_app/immutable/chunks/B7gx0e0r.js","_app/immutable/chunks/DwcZ0eX9.js","_app/immutable/chunks/D10N8TFg.js","_app/immutable/chunks/DTH8v6vZ.js","_app/immutable/chunks/Ctz10O7Q.js","_app/immutable/chunks/CcJDwDvi.js","_app/immutable/chunks/Bd0Sg9L2.js","_app/immutable/chunks/DOO9OaXS.js"];
export const stylesheets = [];
export const fonts = [];
