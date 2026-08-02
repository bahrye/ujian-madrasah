import * as server from '../entries/pages/admin/results/_page.server.ts.js';

export const index = 14;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/results/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/results/+page.server.ts";
export const imports = ["_app/immutable/nodes/14.D0ort9ud.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BAlCm58o.js","_app/immutable/chunks/DDxqhf5o.js","_app/immutable/chunks/CL4nhdES.js","_app/immutable/chunks/Col4vhdl.js","_app/immutable/chunks/Cu5DELs4.js","_app/immutable/chunks/B-c1GX-B.js","_app/immutable/chunks/CS303wAA.js","_app/immutable/chunks/Dc4AZ3On.js","_app/immutable/chunks/D40_HmD-.js","_app/immutable/chunks/CcJDwDvi.js"];
export const stylesheets = [];
export const fonts = [];
