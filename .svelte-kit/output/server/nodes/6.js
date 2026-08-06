import * as server from '../entries/pages/superadmin/_layout.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/superadmin/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/superadmin/+layout.server.ts";
export const imports = ["_app/immutable/nodes/6.CPa1xMLO.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CD7Sw7Ut.js","_app/immutable/chunks/D0O7yx7I.js","_app/immutable/chunks/DA_5OBP1.js","_app/immutable/chunks/CkudF3X1.js","_app/immutable/chunks/CY8zA_BH.js","_app/immutable/chunks/DcrpamBL.js","_app/immutable/chunks/BCrKnTY_.js","_app/immutable/chunks/BAu6P3r8.js","_app/immutable/chunks/onhbUEEH.js","_app/immutable/chunks/BnYE3itn.js","_app/immutable/chunks/D2xMzRQh.js","_app/immutable/chunks/CZWkpYoF.js","_app/immutable/chunks/mtvdH_ec.js","_app/immutable/chunks/B4jzVL06.js","_app/immutable/chunks/B5xf_oRu.js","_app/immutable/chunks/Clo9dMyW.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/DNY9haof.js","_app/immutable/chunks/DHuxq6Bc.js","_app/immutable/chunks/DNHgB_9U.js","_app/immutable/chunks/BVdG4OGp.js","_app/immutable/chunks/CJxWkSG7.js","_app/immutable/chunks/C68tcILF.js","_app/immutable/chunks/BlACJPux.js","_app/immutable/chunks/DHL7zaVF.js","_app/immutable/chunks/BLrBSU9N.js"];
export const stylesheets = [];
export const fonts = [];
