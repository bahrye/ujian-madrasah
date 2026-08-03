import * as server from '../entries/pages/admin/classes/_page.server.ts.js';

export const index = 12;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/classes/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/classes/+page.server.ts";
export const imports = ["_app/immutable/nodes/12.BX72gwSC.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/Qo4WinPi.js","_app/immutable/chunks/DuRu0Cwg.js","_app/immutable/chunks/49jLYmn9.js","_app/immutable/chunks/BWT6d7X8.js","_app/immutable/chunks/DmlZE70N.js","_app/immutable/chunks/DsOXAt_Q.js","_app/immutable/chunks/D6zPlqqA.js","_app/immutable/chunks/OGsI3xdJ.js","_app/immutable/chunks/CajJ7RZp.js","_app/immutable/chunks/B-irjc3l.js","_app/immutable/chunks/d_Kyr9Ln.js","_app/immutable/chunks/uF33su8-.js","_app/immutable/chunks/CX5A_R8J.js","_app/immutable/chunks/tmHuRQzV.js","_app/immutable/chunks/Di_ZoS8s.js","_app/immutable/chunks/B0xLU1F0.js","_app/immutable/chunks/k0KhTsjR.js"];
export const stylesheets = [];
export const fonts = [];
