import * as server from '../entries/pages/superadmin/_layout.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/superadmin/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/superadmin/+layout.server.ts";
export const imports = ["_app/immutable/nodes/6.DsSxrLba.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BV1hr-UK.js","_app/immutable/chunks/BxH7Qk13.js","_app/immutable/chunks/CzEvOKrl.js","_app/immutable/chunks/DUFUeTgQ.js","_app/immutable/chunks/DHon3iv8.js","_app/immutable/chunks/DIMz4J0V.js","_app/immutable/chunks/DJocAs0K.js","_app/immutable/chunks/B-vHU7aS.js","_app/immutable/chunks/DvGlIG5e.js","_app/immutable/chunks/BR9p7IiS.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/CX_A_iYc.js","_app/immutable/chunks/CkhvprA2.js","_app/immutable/chunks/Cntf_pij.js","_app/immutable/chunks/CSCmeJqC.js","_app/immutable/chunks/DpJM4fw3.js","_app/immutable/chunks/CaJZ9qC3.js","_app/immutable/chunks/Cup9CWmZ.js","_app/immutable/chunks/RHhvIjaC.js"];
export const stylesheets = [];
export const fonts = [];
