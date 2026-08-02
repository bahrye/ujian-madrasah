import * as server from '../entries/pages/admin/classes/_page.server.ts.js';

export const index = 11;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/classes/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/classes/+page.server.ts";
export const imports = ["_app/immutable/nodes/11.C4kA2t4N.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DUDzixAQ.js","_app/immutable/chunks/-TJSwNDh.js","_app/immutable/chunks/BEdG_931.js","_app/immutable/chunks/DohkKvsF.js","_app/immutable/chunks/B30wE_HX.js","_app/immutable/chunks/CzAQhjZv.js","_app/immutable/chunks/CgALfXMs.js","_app/immutable/chunks/CQc2cYcg.js","_app/immutable/chunks/nLbxFLzU.js","_app/immutable/chunks/GjP_84M4.js","_app/immutable/chunks/DiaExpHg.js","_app/immutable/chunks/C61N3wUs.js"];
export const stylesheets = [];
export const fonts = [];
