import * as server from '../entries/pages/guru/media-bank/_page.server.ts.js';

export const index = 25;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/guru/media-bank/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/guru/media-bank/+page.server.ts";
export const imports = ["_app/immutable/nodes/25.BEwm7I-7.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/Qo4WinPi.js","_app/immutable/chunks/DuRu0Cwg.js","_app/immutable/chunks/49jLYmn9.js","_app/immutable/chunks/BWT6d7X8.js","_app/immutable/chunks/DmlZE70N.js","_app/immutable/chunks/DsOXAt_Q.js","_app/immutable/chunks/CsuL1vEk.js","_app/immutable/chunks/h_N9tYbB.js","_app/immutable/chunks/CajJ7RZp.js","_app/immutable/chunks/2arm1PC1.js","_app/immutable/chunks/d_Kyr9Ln.js","_app/immutable/chunks/Di_ZoS8s.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/KIzjWQRD.js","_app/immutable/chunks/DwmCH61S.js","_app/immutable/chunks/UOt-RVu5.js","_app/immutable/chunks/B0xLU1F0.js"];
export const stylesheets = [];
export const fonts = [];
