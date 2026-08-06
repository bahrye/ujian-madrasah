import * as server from '../entries/pages/admin/results/_page.server.ts.js';

export const index = 21;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/results/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/results/+page.server.ts";
export const imports = ["_app/immutable/nodes/21.96hRghwi.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CD7Sw7Ut.js","_app/immutable/chunks/D0O7yx7I.js","_app/immutable/chunks/CIsL3k1w.js","_app/immutable/chunks/BnYE3itn.js","_app/immutable/chunks/D2xMzRQh.js","_app/immutable/chunks/KK8x-0AI.js","_app/immutable/chunks/mtvdH_ec.js","_app/immutable/chunks/B4jzVL06.js","_app/immutable/chunks/B5xf_oRu.js","_app/immutable/chunks/CkudF3X1.js","_app/immutable/chunks/CY8zA_BH.js","_app/immutable/chunks/DcrpamBL.js","_app/immutable/chunks/BCrKnTY_.js","_app/immutable/chunks/KKSeIgY0.js","_app/immutable/chunks/DtciLVgV.js","_app/immutable/chunks/-LO9irFG.js","_app/immutable/chunks/BMQa8wFT.js","_app/immutable/chunks/DA_5OBP1.js","_app/immutable/chunks/x1Xo2tJm.js","_app/immutable/chunks/Cimf0Tid.js","_app/immutable/chunks/Dx_inKhY.js","_app/immutable/chunks/CJ8WVpfA.js","_app/immutable/chunks/Bsb9LDRK.js","_app/immutable/chunks/B3QGTHzW.js","_app/immutable/chunks/CKN5doRT.js","_app/immutable/chunks/BlACJPux.js"];
export const stylesheets = [];
export const fonts = [];
