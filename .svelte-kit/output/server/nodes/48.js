import * as server from '../entries/pages/siswa/_page.server.ts.js';

export const index = 48;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/siswa/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/siswa/+page.server.ts";
export const imports = ["_app/immutable/nodes/48.C9eN7hP1.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CD7Sw7Ut.js","_app/immutable/chunks/D0O7yx7I.js","_app/immutable/chunks/BVdG4OGp.js","_app/immutable/chunks/onhbUEEH.js","_app/immutable/chunks/BnYE3itn.js","_app/immutable/chunks/D2xMzRQh.js","_app/immutable/chunks/KK8x-0AI.js","_app/immutable/chunks/mtvdH_ec.js","_app/immutable/chunks/B4jzVL06.js","_app/immutable/chunks/B5xf_oRu.js","_app/immutable/chunks/CkudF3X1.js","_app/immutable/chunks/CY8zA_BH.js","_app/immutable/chunks/DcrpamBL.js","_app/immutable/chunks/BCrKnTY_.js","_app/immutable/chunks/-LO9irFG.js"];
export const stylesheets = [];
export const fonts = [];
