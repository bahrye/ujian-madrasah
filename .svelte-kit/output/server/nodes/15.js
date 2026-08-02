import * as server from '../entries/pages/admin/students/_page.server.ts.js';

export const index = 15;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/students/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/students/+page.server.ts";
export const imports = ["_app/immutable/nodes/15.DEaLbM4J.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/sTNnV60L.js","_app/immutable/chunks/BWk7RVWn.js","_app/immutable/chunks/ujSxWJbt.js","_app/immutable/chunks/DxUHVDz2.js","_app/immutable/chunks/H0GCy7x3.js","_app/immutable/chunks/wIr1SkV4.js","_app/immutable/chunks/A8wvgMQb.js","_app/immutable/chunks/B7gx0e0r.js","_app/immutable/chunks/o7MXILxX.js","_app/immutable/chunks/DwcZ0eX9.js","_app/immutable/chunks/D10N8TFg.js","_app/immutable/chunks/DTH8v6vZ.js","_app/immutable/chunks/Ctz10O7Q.js","_app/immutable/chunks/Bd0Sg9L2.js"];
export const stylesheets = [];
export const fonts = [];
