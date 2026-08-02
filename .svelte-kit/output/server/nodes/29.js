import * as server from '../entries/pages/superadmin/_page.server.ts.js';

export const index = 29;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/superadmin/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/superadmin/+page.server.ts";
export const imports = ["_app/immutable/nodes/29.DAS5gKec.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BZbEoyCw.js","_app/immutable/chunks/pVKruFo1.js","_app/immutable/chunks/CbTox5fa.js","_app/immutable/chunks/BFKIXuI0.js","_app/immutable/chunks/XzJ121RJ.js","_app/immutable/chunks/DKmcUs-K.js","_app/immutable/chunks/B6Hc4xX0.js","_app/immutable/chunks/5iwts6lA.js","_app/immutable/chunks/BKjL5Qlh.js","_app/immutable/chunks/CBfed4VF.js"];
export const stylesheets = [];
export const fonts = [];
