import * as server from '../entries/pages/admin/classes/_page.server.ts.js';

export const index = 11;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/classes/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/classes/+page.server.ts";
export const imports = ["_app/immutable/nodes/11.HvggToKC.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DTI0Se7w.js","_app/immutable/chunks/B-m1hCzt.js","_app/immutable/chunks/DbD9IbZI.js","_app/immutable/chunks/CQCwlsVV.js","_app/immutable/chunks/MtbvIQbS.js","_app/immutable/chunks/DA7HkAFo.js","_app/immutable/chunks/B0ixhghs.js","_app/immutable/chunks/BeaId2Q8.js","_app/immutable/chunks/Cf_qrmRJ.js","_app/immutable/chunks/-Gio4bF8.js","_app/immutable/chunks/wHeWtbPT.js","_app/immutable/chunks/Da5j8cPD.js","_app/immutable/chunks/DkUc_N3Q.js","_app/immutable/chunks/CPy_5-Al.js","_app/immutable/chunks/VibP_tje.js","_app/immutable/chunks/B8RpUdjU.js","_app/immutable/chunks/Cj3TY-os.js"];
export const stylesheets = [];
export const fonts = [];
