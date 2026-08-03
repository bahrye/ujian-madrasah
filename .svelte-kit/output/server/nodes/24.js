import * as server from '../entries/pages/guru/penilaian/_page.server.ts.js';

export const index = 24;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/guru/penilaian/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/guru/penilaian/+page.server.ts";
export const imports = ["_app/immutable/nodes/24.BmnjI5bn.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/D7kfP2VJ.js","_app/immutable/chunks/UXPBhQu2.js","_app/immutable/chunks/CjRowugn.js","_app/immutable/chunks/tn2TxHaz.js","_app/immutable/chunks/Te0C24lc.js","_app/immutable/chunks/XjEmyE9H.js","_app/immutable/chunks/DEH5dTWm.js","_app/immutable/chunks/CDHD8d8H.js","_app/immutable/chunks/D5ire4jW.js","_app/immutable/chunks/esG8lSSd.js","_app/immutable/chunks/BQHbywm_.js","_app/immutable/chunks/BmGB27ZV.js","_app/immutable/chunks/CqUTEu1o.js","_app/immutable/chunks/BcQYu49t.js"];
export const stylesheets = [];
export const fonts = [];
