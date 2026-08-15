import * as server from '../entries/pages/_page.server.ts.js';

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/8.Cds1h4E9.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CJ6315G4.js","_app/immutable/chunks/DU7PTdcz.js"];
export const stylesheets = [];
export const fonts = [];
