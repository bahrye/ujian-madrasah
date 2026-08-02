import * as server from '../entries/pages/pengawas/monitor/_page.server.ts.js';

export const index = 24;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/pengawas/monitor/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/pengawas/monitor/+page.server.ts";
export const imports = ["_app/immutable/nodes/24.Cd5zlmUr.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/sTNnV60L.js","_app/immutable/chunks/BWk7RVWn.js","_app/immutable/chunks/ujSxWJbt.js","_app/immutable/chunks/DxUHVDz2.js","_app/immutable/chunks/H0GCy7x3.js","_app/immutable/chunks/wIr1SkV4.js","_app/immutable/chunks/D9If6Oie.js","_app/immutable/chunks/sTTdBBFf.js","_app/immutable/chunks/o7MXILxX.js","_app/immutable/chunks/DwcZ0eX9.js","_app/immutable/chunks/D10N8TFg.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/Ctz10O7Q.js","_app/immutable/chunks/DgEIujhR.js","_app/immutable/chunks/CcJDwDvi.js","_app/immutable/chunks/Bd0Sg9L2.js"];
export const stylesheets = [];
export const fonts = [];
