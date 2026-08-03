import * as server from '../entries/pages/superadmin/_page.server.ts.js';

export const index = 39;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/superadmin/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/superadmin/+page.server.ts";
export const imports = ["_app/immutable/nodes/39.D1VygX2I.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/Qo4WinPi.js","_app/immutable/chunks/DuRu0Cwg.js","_app/immutable/chunks/49jLYmn9.js","_app/immutable/chunks/BWT6d7X8.js","_app/immutable/chunks/DmlZE70N.js","_app/immutable/chunks/DsOXAt_Q.js","_app/immutable/chunks/d_Kyr9Ln.js","_app/immutable/chunks/DKXeNB_v.js","_app/immutable/chunks/Di_ZoS8s.js"];
export const stylesheets = [];
export const fonts = [];
