import * as server from '../entries/pages/siswa/_page.server.ts.js';

export const index = 26;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/siswa/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/siswa/+page.server.ts";
export const imports = ["_app/immutable/nodes/26.DVTL4t4M.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DUDzixAQ.js","_app/immutable/chunks/-TJSwNDh.js","_app/immutable/chunks/BEdG_931.js","_app/immutable/chunks/DohkKvsF.js","_app/immutable/chunks/B30wE_HX.js","_app/immutable/chunks/CzAQhjZv.js","_app/immutable/chunks/GjP_84M4.js","_app/immutable/chunks/C9mxu4Tt.js","_app/immutable/chunks/DiaExpHg.js","_app/immutable/chunks/wmSitu1K.js"];
export const stylesheets = [];
export const fonts = [];
