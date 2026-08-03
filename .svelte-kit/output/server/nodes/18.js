import * as server from '../entries/pages/admin/subjects/_page.server.ts.js';

export const index = 18;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/subjects/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/subjects/+page.server.ts";
export const imports = ["_app/immutable/nodes/18.xM86uZ_m.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/D7kfP2VJ.js","_app/immutable/chunks/UXPBhQu2.js","_app/immutable/chunks/CjRowugn.js","_app/immutable/chunks/tn2TxHaz.js","_app/immutable/chunks/Te0C24lc.js","_app/immutable/chunks/XjEmyE9H.js","_app/immutable/chunks/C_RX8k0K.js","_app/immutable/chunks/cuocvnSE.js","_app/immutable/chunks/D5ire4jW.js","_app/immutable/chunks/ZcFzFJft.js","_app/immutable/chunks/BQHbywm_.js","_app/immutable/chunks/qjpYcv5P.js","_app/immutable/chunks/8tFkQ78t.js","_app/immutable/chunks/ChUIta5Z.js","_app/immutable/chunks/BmGB27ZV.js","_app/immutable/chunks/DI2LD4bk.js","_app/immutable/chunks/BcQYu49t.js"];
export const stylesheets = [];
export const fonts = [];
