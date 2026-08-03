import * as server from '../entries/pages/admin/students/_page.server.ts.js';

export const index = 16;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/students/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/students/+page.server.ts";
export const imports = ["_app/immutable/nodes/16.XZDyFA1X.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DTI0Se7w.js","_app/immutable/chunks/B-m1hCzt.js","_app/immutable/chunks/DbD9IbZI.js","_app/immutable/chunks/CQCwlsVV.js","_app/immutable/chunks/MtbvIQbS.js","_app/immutable/chunks/DA7HkAFo.js","_app/immutable/chunks/DVm3RVN-.js","_app/immutable/chunks/UE-O9ZMc.js","_app/immutable/chunks/Cf_qrmRJ.js","_app/immutable/chunks/Dc7uF_uw.js","_app/immutable/chunks/wHeWtbPT.js","_app/immutable/chunks/VibP_tje.js","_app/immutable/chunks/B0fnQzBR.js","_app/immutable/chunks/DhbfQNSQ.js","_app/immutable/chunks/DkUc_N3Q.js","_app/immutable/chunks/CPy_5-Al.js","_app/immutable/chunks/B8RpUdjU.js","_app/immutable/chunks/Cj3TY-os.js"];
export const stylesheets = [];
export const fonts = [];
