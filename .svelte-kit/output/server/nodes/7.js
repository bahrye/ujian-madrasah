import * as server from '../entries/pages/_page.server.ts.js';

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/7.BEq1hn20.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/C7EiyzO9.js","_app/immutable/chunks/DaxUIi1N.js"];
export const stylesheets = [];
export const fonts = [];
