import * as server from '../entries/pages/print/_layout.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/print/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/print/+layout.server.ts";
export const imports = ["_app/immutable/nodes/5.BQ_lK_H1.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DEV4lICE.js","_app/immutable/chunks/DlWfQ4JO.js","_app/immutable/chunks/42hr0qj6.js","_app/immutable/chunks/DNg1Gm6A.js","_app/immutable/chunks/Bp7yYOqu.js","_app/immutable/chunks/BlV3z5Rm.js","_app/immutable/chunks/BcJaZxXK.js"];
export const stylesheets = [];
export const fonts = [];
