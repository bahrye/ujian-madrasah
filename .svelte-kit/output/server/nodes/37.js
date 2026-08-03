import * as server from '../entries/pages/siswa/ujian/_page.server.ts.js';

export const index = 37;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/siswa/ujian/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/siswa/ujian/+page.server.ts";
export const imports = ["_app/immutable/nodes/37.U8u_ZdH0.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/Qo4WinPi.js","_app/immutable/chunks/DuRu0Cwg.js","_app/immutable/chunks/49jLYmn9.js","_app/immutable/chunks/BWT6d7X8.js","_app/immutable/chunks/DsOXAt_Q.js","_app/immutable/chunks/CsuL1vEk.js","_app/immutable/chunks/h_N9tYbB.js","_app/immutable/chunks/CajJ7RZp.js","_app/immutable/chunks/2arm1PC1.js","_app/immutable/chunks/d_Kyr9Ln.js","_app/immutable/chunks/B9G_uX7s.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/KIzjWQRD.js","_app/immutable/chunks/Bq16tzCR.js"];
export const stylesheets = [];
export const fonts = [];
