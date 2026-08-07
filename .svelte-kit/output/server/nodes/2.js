import * as server from '../entries/pages/admin/_layout.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/+layout.server.ts";
export const imports = ["_app/immutable/nodes/2.yZrevkxK.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CD7Sw7Ut.js","_app/immutable/chunks/D0O7yx7I.js","_app/immutable/chunks/DA_5OBP1.js","_app/immutable/chunks/CkudF3X1.js","_app/immutable/chunks/CY8zA_BH.js","_app/immutable/chunks/DcrpamBL.js","_app/immutable/chunks/BCrKnTY_.js","_app/immutable/chunks/BbsvC4fo.js","_app/immutable/chunks/onhbUEEH.js","_app/immutable/chunks/BnYE3itn.js","_app/immutable/chunks/D2xMzRQh.js","_app/immutable/chunks/CZWkpYoF.js","_app/immutable/chunks/mtvdH_ec.js","_app/immutable/chunks/B4jzVL06.js","_app/immutable/chunks/B5xf_oRu.js","_app/immutable/chunks/Clo9dMyW.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/DNY9haof.js","_app/immutable/chunks/7I8ZPMCy.js","_app/immutable/chunks/D5ZQkeGD.js","_app/immutable/chunks/BVdG4OGp.js","_app/immutable/chunks/Dc-O5ExP.js","_app/immutable/chunks/DgSQwxXL.js","_app/immutable/chunks/BlACJPux.js","_app/immutable/chunks/DHL7zaVF.js","_app/immutable/chunks/BLrBSU9N.js"];
export const stylesheets = [];
export const fonts = [];
