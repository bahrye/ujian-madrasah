import * as server from '../entries/pages/superadmin/admins/_page.server.ts.js';

export const index = 30;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/superadmin/admins/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/superadmin/admins/+page.server.ts";
export const imports = ["_app/immutable/nodes/30.BnNRITVN.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BZbEoyCw.js","_app/immutable/chunks/pVKruFo1.js","_app/immutable/chunks/CbTox5fa.js","_app/immutable/chunks/BFKIXuI0.js","_app/immutable/chunks/XzJ121RJ.js","_app/immutable/chunks/DKmcUs-K.js","_app/immutable/chunks/7sLs0-Fu.js","_app/immutable/chunks/CaZgupNK.js","_app/immutable/chunks/BFb72ugl.js","_app/immutable/chunks/BKjL5Qlh.js","_app/immutable/chunks/B6Hc4xX0.js","_app/immutable/chunks/BA6o9f-S.js"];
export const stylesheets = [];
export const fonts = [];
