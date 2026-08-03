import * as server from '../entries/pages/admin/exams/_page.server.ts.js';

export const index = 13;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/exams/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/exams/+page.server.ts";
export const imports = ["_app/immutable/nodes/13.C7HLDv08.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/Qo4WinPi.js","_app/immutable/chunks/DuRu0Cwg.js","_app/immutable/chunks/49jLYmn9.js","_app/immutable/chunks/BWT6d7X8.js","_app/immutable/chunks/DmlZE70N.js","_app/immutable/chunks/DsOXAt_Q.js","_app/immutable/chunks/BAgJ2uyp.js","_app/immutable/chunks/CD6ubXrT.js","_app/immutable/chunks/CajJ7RZp.js","_app/immutable/chunks/DngPfJSA.js","_app/immutable/chunks/d_Kyr9Ln.js","_app/immutable/chunks/D65obscI.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/KIzjWQRD.js","_app/immutable/chunks/Bq16tzCR.js","_app/immutable/chunks/k0KhTsjR.js"];
export const stylesheets = [];
export const fonts = [];
