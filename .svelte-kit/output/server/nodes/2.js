import * as server from '../entries/pages/admin/_layout.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/+layout.server.ts";
export const imports = ["_app/immutable/nodes/2.Lx_kAI9R.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/D7kfP2VJ.js","_app/immutable/chunks/UXPBhQu2.js","_app/immutable/chunks/8tFkQ78t.js","_app/immutable/chunks/BQHbywm_.js","_app/immutable/chunks/tn2TxHaz.js","_app/immutable/chunks/CjRowugn.js","_app/immutable/chunks/FFbfRUdm.js","_app/immutable/chunks/Te0C24lc.js","_app/immutable/chunks/ChUIta5Z.js","_app/immutable/chunks/BmGB27ZV.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/Cmj-fKM8.js","_app/immutable/chunks/NrNCO-my.js","_app/immutable/chunks/gAUueYg6.js","_app/immutable/chunks/D5ire4jW.js","_app/immutable/chunks/CDiECmez.js","_app/immutable/chunks/CqUTEu1o.js","_app/immutable/chunks/DWlwkvQT.js","_app/immutable/chunks/BcQYu49t.js"];
export const stylesheets = [];
export const fonts = [];
