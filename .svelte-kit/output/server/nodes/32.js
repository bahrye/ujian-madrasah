import * as server from '../entries/pages/pengawas/tokens/_page.server.ts.js';

export const index = 32;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/pengawas/tokens/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/pengawas/tokens/+page.server.ts";
export const imports = ["_app/immutable/nodes/32.CfXy6KHC.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/D7kfP2VJ.js","_app/immutable/chunks/UXPBhQu2.js","_app/immutable/chunks/D5ire4jW.js","_app/immutable/chunks/CjRowugn.js","_app/immutable/chunks/tn2TxHaz.js","_app/immutable/chunks/Te0C24lc.js","_app/immutable/chunks/XjEmyE9H.js","_app/immutable/chunks/CrgAZif1.js","_app/immutable/chunks/CDiECmez.js","_app/immutable/chunks/gAUueYg6.js","_app/immutable/chunks/BQHbywm_.js","_app/immutable/chunks/BmGB27ZV.js","_app/immutable/chunks/vbBCqoRC.js","_app/immutable/chunks/CqUTEu1o.js","_app/immutable/chunks/BcQYu49t.js","_app/immutable/chunks/NrNCO-my.js"];
export const stylesheets = [];
export const fonts = [];
