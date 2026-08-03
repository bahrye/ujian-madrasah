import * as server from '../entries/pages/siswa/_page.server.ts.js';

export const index = 35;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/siswa/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/siswa/+page.server.ts";
export const imports = ["_app/immutable/nodes/35.BK3K7maZ.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/Qo4WinPi.js","_app/immutable/chunks/DuRu0Cwg.js","_app/immutable/chunks/CajJ7RZp.js","_app/immutable/chunks/49jLYmn9.js","_app/immutable/chunks/BWT6d7X8.js","_app/immutable/chunks/DmlZE70N.js","_app/immutable/chunks/DsOXAt_Q.js","_app/immutable/chunks/d_Kyr9Ln.js","_app/immutable/chunks/Di_ZoS8s.js","_app/immutable/chunks/fKeFOqVQ.js"];
export const stylesheets = [];
export const fonts = [];
