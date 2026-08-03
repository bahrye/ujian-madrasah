import * as server from '../entries/pages/admin/results/_page.server.ts.js';

export const index = 16;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/results/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/results/+page.server.ts";
export const imports = ["_app/immutable/nodes/16.DpTjWiu5.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BV1hr-UK.js","_app/immutable/chunks/BxH7Qk13.js","_app/immutable/chunks/DIMz4J0V.js","_app/immutable/chunks/DHon3iv8.js","_app/immutable/chunks/B-vHU7aS.js","_app/immutable/chunks/CJVAUuBs.js","_app/immutable/chunks/DUFUeTgQ.js","_app/immutable/chunks/BR9p7IiS.js","_app/immutable/chunks/DpJM4fw3.js","_app/immutable/chunks/CSCmeJqC.js","_app/immutable/chunks/CaJZ9qC3.js","_app/immutable/chunks/CP_aJkzS.js","_app/immutable/chunks/CzEvOKrl.js","_app/immutable/chunks/DvGlIG5e.js","_app/immutable/chunks/D7gVJjnX.js","_app/immutable/chunks/Cntf_pij.js","_app/immutable/chunks/BYaC5aJQ.js"];
export const stylesheets = [];
export const fonts = [];
