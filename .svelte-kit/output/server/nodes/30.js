import * as server from '../entries/pages/pengawas/tokens/_page.server.ts.js';

export const index = 30;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/pengawas/tokens/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/pengawas/tokens/+page.server.ts";
export const imports = ["_app/immutable/nodes/30.B3EMAowm.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DTI0Se7w.js","_app/immutable/chunks/B-m1hCzt.js","_app/immutable/chunks/Cf_qrmRJ.js","_app/immutable/chunks/DbD9IbZI.js","_app/immutable/chunks/CQCwlsVV.js","_app/immutable/chunks/MtbvIQbS.js","_app/immutable/chunks/DA7HkAFo.js","_app/immutable/chunks/D1utX3Gr.js","_app/immutable/chunks/CNNr0Pfb.js","_app/immutable/chunks/D5CQljT8.js","_app/immutable/chunks/wHeWtbPT.js","_app/immutable/chunks/VibP_tje.js","_app/immutable/chunks/B0fnQzBR.js","_app/immutable/chunks/DBWUiwG_.js","_app/immutable/chunks/Cj3TY-os.js","_app/immutable/chunks/Dgn4zA1U.js"];
export const stylesheets = [];
export const fonts = [];
