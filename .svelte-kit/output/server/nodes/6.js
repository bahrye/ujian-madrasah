import * as server from '../entries/pages/superadmin/_layout.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/superadmin/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/superadmin/+layout.server.ts";
export const imports = ["_app/immutable/nodes/6.CLyh8_Kj.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DUDzixAQ.js","_app/immutable/chunks/-TJSwNDh.js","_app/immutable/chunks/BKwkxVZO.js","_app/immutable/chunks/DiaExpHg.js","_app/immutable/chunks/DohkKvsF.js","_app/immutable/chunks/BEdG_931.js","_app/immutable/chunks/CwUXdClv.js","_app/immutable/chunks/B30wE_HX.js","_app/immutable/chunks/DUcXSsSa.js","_app/immutable/chunks/GjP_84M4.js","_app/immutable/chunks/C9mxu4Tt.js","_app/immutable/chunks/C61N3wUs.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/o811rUN2.js","_app/immutable/chunks/DVc8Acv7.js","_app/immutable/chunks/CQc2cYcg.js","_app/immutable/chunks/nLbxFLzU.js","_app/immutable/chunks/wmSitu1K.js"];
export const stylesheets = [];
export const fonts = [];
