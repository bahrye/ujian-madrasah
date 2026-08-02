import * as server from '../entries/pages/pengawas/_layout.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/pengawas/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/pengawas/+layout.server.ts";
export const imports = ["_app/immutable/nodes/4.X2Cdl4nH.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DClErzyl.js","_app/immutable/chunks/D5nW2bLe.js","_app/immutable/chunks/BF9VjJNF.js","_app/immutable/chunks/BkAjnQ0c.js","_app/immutable/chunks/D9VyE4-j.js","_app/immutable/chunks/CcNdKUAA.js","_app/immutable/chunks/CxwxPbFF.js","_app/immutable/chunks/D8jXJOew.js","_app/immutable/chunks/lVlqf7hY.js","_app/immutable/chunks/CHX1ae3Y.js","_app/immutable/chunks/DTc3-fU9.js","_app/immutable/chunks/BbdOSnfv.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/zOdT1pHR.js","_app/immutable/chunks/RBbBve_4.js","_app/immutable/chunks/DZ8Cn22W.js","_app/immutable/chunks/DN402ODw.js","_app/immutable/chunks/CcJDwDvi.js"];
export const stylesheets = [];
export const fonts = [];
