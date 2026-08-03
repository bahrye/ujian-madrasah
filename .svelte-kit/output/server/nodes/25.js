import * as server from '../entries/pages/guru/results/_page.server.ts.js';

export const index = 25;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/guru/results/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/guru/results/+page.server.ts";
export const imports = ["_app/immutable/nodes/25.GzrRlSE7.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DTI0Se7w.js","_app/immutable/chunks/B-m1hCzt.js","_app/immutable/chunks/DbD9IbZI.js","_app/immutable/chunks/CQCwlsVV.js","_app/immutable/chunks/MtbvIQbS.js","_app/immutable/chunks/DA7HkAFo.js","_app/immutable/chunks/wHeWtbPT.js","_app/immutable/chunks/VibP_tje.js","_app/immutable/chunks/7tyrtqFX.js","_app/immutable/chunks/Cf_qrmRJ.js","_app/immutable/chunks/DBWUiwG_.js"];
export const stylesheets = [];
export const fonts = [];
