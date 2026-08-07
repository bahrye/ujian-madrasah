import * as server from '../entries/pages/_page.server.ts.js';

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/7.D_lNmPTs.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/_VlQjsMb.js","_app/immutable/chunks/X9E9MVLd.js"];
export const stylesheets = [];
export const fonts = [];
