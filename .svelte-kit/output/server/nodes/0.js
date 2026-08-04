import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.CBjjb9nk.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DIqfK5LK.js","_app/immutable/chunks/GROjdWtC.js","_app/immutable/chunks/BOWj4hxQ.js","_app/immutable/chunks/D7FvC3v6.js","_app/immutable/chunks/CsadQQqy.js","_app/immutable/chunks/C5HAPqUk.js","_app/immutable/chunks/DlcSkKzz.js","_app/immutable/chunks/DNeMqas3.js","_app/immutable/chunks/B7Y6kx2q.js","_app/immutable/chunks/3dRbXXZy.js","_app/immutable/chunks/oe0IQBgH.js","_app/immutable/chunks/FJBunwqp.js"];
export const stylesheets = ["_app/immutable/assets/0.Ds_I9hO4.css"];
export const fonts = [];
