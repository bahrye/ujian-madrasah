import * as server from '../entries/pages/admin/classes/_page.server.ts.js';

export const index = 11;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/classes/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/classes/+page.server.ts";
export const imports = ["_app/immutable/nodes/11.BPqtvddd.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DClErzyl.js","_app/immutable/chunks/D5nW2bLe.js","_app/immutable/chunks/CcNdKUAA.js","_app/immutable/chunks/D9VyE4-j.js","_app/immutable/chunks/D8jXJOew.js","_app/immutable/chunks/el_xgqqX.js","_app/immutable/chunks/Cv7GqTl-.js","_app/immutable/chunks/qDJq-feT.js","_app/immutable/chunks/DN402ODw.js","_app/immutable/chunks/CHX1ae3Y.js","_app/immutable/chunks/BkAjnQ0c.js","_app/immutable/chunks/BbdOSnfv.js"];
export const stylesheets = [];
export const fonts = [];
