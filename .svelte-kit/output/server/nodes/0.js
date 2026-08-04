import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.DCkSVsXL.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DIqfK5LK.js","_app/immutable/chunks/GROjdWtC.js","_app/immutable/chunks/BOWj4hxQ.js","_app/immutable/chunks/D7FvC3v6.js","_app/immutable/chunks/CsadQQqy.js","_app/immutable/chunks/C5HAPqUk.js","_app/immutable/chunks/DlcSkKzz.js","_app/immutable/chunks/DNeMqas3.js","_app/immutable/chunks/B7Y6kx2q.js","_app/immutable/chunks/CxSxX2FC.js","_app/immutable/chunks/DRpVg4JV.js","_app/immutable/chunks/D1GDGeK4.js"];
export const stylesheets = ["_app/immutable/assets/0.BKCVdJYj.css"];
export const fonts = [];
