import * as server from '../entries/pages/superadmin/_page.server.ts.js';

export const index = 37;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/superadmin/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/superadmin/+page.server.ts";
export const imports = ["_app/immutable/nodes/37.Cf2C03lY.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/D7kfP2VJ.js","_app/immutable/chunks/UXPBhQu2.js","_app/immutable/chunks/CjRowugn.js","_app/immutable/chunks/tn2TxHaz.js","_app/immutable/chunks/Te0C24lc.js","_app/immutable/chunks/XjEmyE9H.js","_app/immutable/chunks/BQHbywm_.js","_app/immutable/chunks/H1hNwe-u.js","_app/immutable/chunks/BmGB27ZV.js"];
export const stylesheets = [];
export const fonts = [];
