import * as server from '../entries/pages/guru/_page.server.ts.js';

export const index = 21;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/guru/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/guru/+page.server.ts";
export const imports = ["_app/immutable/nodes/21.B8_nmSSP.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/Qo4WinPi.js","_app/immutable/chunks/DuRu0Cwg.js","_app/immutable/chunks/49jLYmn9.js","_app/immutable/chunks/DmlZE70N.js","_app/immutable/chunks/DsOXAt_Q.js","_app/immutable/chunks/d_Kyr9Ln.js","_app/immutable/chunks/BWT6d7X8.js","_app/immutable/chunks/DKXeNB_v.js","_app/immutable/chunks/Di_ZoS8s.js","_app/immutable/chunks/Bq16tzCR.js"];
export const stylesheets = [];
export const fonts = [];
