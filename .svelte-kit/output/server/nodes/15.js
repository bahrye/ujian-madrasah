import * as server from '../entries/pages/admin/media-bank/_page.server.ts.js';

export const index = 15;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/media-bank/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/media-bank/+page.server.ts";
export const imports = ["_app/immutable/nodes/15.BRdVIJ0h.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/Qo4WinPi.js","_app/immutable/chunks/DuRu0Cwg.js","_app/immutable/chunks/49jLYmn9.js","_app/immutable/chunks/BWT6d7X8.js","_app/immutable/chunks/DmlZE70N.js","_app/immutable/chunks/DsOXAt_Q.js","_app/immutable/chunks/DuhxvmQ6.js","_app/immutable/chunks/HEhg8pbQ.js","_app/immutable/chunks/CajJ7RZp.js","_app/immutable/chunks/vHirrHqQ.js","_app/immutable/chunks/d_Kyr9Ln.js","_app/immutable/chunks/Di_ZoS8s.js","_app/immutable/chunks/CC9FbFEQ.js","_app/immutable/chunks/UOt-RVu5.js","_app/immutable/chunks/B0xLU1F0.js"];
export const stylesheets = [];
export const fonts = [];
