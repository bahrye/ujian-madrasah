import * as server from '../entries/pages/admin/_layout.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/+layout.server.ts";
export const imports = ["_app/immutable/nodes/2.DO-bfejp.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DTI0Se7w.js","_app/immutable/chunks/B-m1hCzt.js","_app/immutable/chunks/DkUc_N3Q.js","_app/immutable/chunks/wHeWtbPT.js","_app/immutable/chunks/CQCwlsVV.js","_app/immutable/chunks/DbD9IbZI.js","_app/immutable/chunks/CoCOIaPd.js","_app/immutable/chunks/MtbvIQbS.js","_app/immutable/chunks/CPy_5-Al.js","_app/immutable/chunks/VibP_tje.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/Bid1EWMa.js","_app/immutable/chunks/xnlt23tG.js","_app/immutable/chunks/DG5urDyy.js","_app/immutable/chunks/Cf_qrmRJ.js","_app/immutable/chunks/CJQs7TRJ.js","_app/immutable/chunks/DBWUiwG_.js","_app/immutable/chunks/COui177k.js","_app/immutable/chunks/Cj3TY-os.js"];
export const stylesheets = [];
export const fonts = [];
