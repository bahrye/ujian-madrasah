import * as server from '../entries/pages/siswa/ujian/_page.server.ts.js';

export const index = 35;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/siswa/ujian/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/siswa/ujian/+page.server.ts";
export const imports = ["_app/immutable/nodes/35.CmDK8d6N.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/D7kfP2VJ.js","_app/immutable/chunks/UXPBhQu2.js","_app/immutable/chunks/CjRowugn.js","_app/immutable/chunks/tn2TxHaz.js","_app/immutable/chunks/XjEmyE9H.js","_app/immutable/chunks/B3VeeBW3.js","_app/immutable/chunks/DVKm98Wd.js","_app/immutable/chunks/D5ire4jW.js","_app/immutable/chunks/QRE00NdU.js","_app/immutable/chunks/BQHbywm_.js","_app/immutable/chunks/DAr8Grfg.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/Cmj-fKM8.js","_app/immutable/chunks/CqUTEu1o.js"];
export const stylesheets = [];
export const fonts = [];
