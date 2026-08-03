import * as server from '../entries/pages/guru/bank-soal/_page.server.ts.js';

export const index = 20;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/guru/bank-soal/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/guru/bank-soal/+page.server.ts";
export const imports = ["_app/immutable/nodes/20.BeWigc9L.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DTI0Se7w.js","_app/immutable/chunks/B-m1hCzt.js","_app/immutable/chunks/DbD9IbZI.js","_app/immutable/chunks/CQCwlsVV.js","_app/immutable/chunks/MtbvIQbS.js","_app/immutable/chunks/DA7HkAFo.js","_app/immutable/chunks/BOyX-nHx.js","_app/immutable/chunks/BsUggxSY.js","_app/immutable/chunks/Cf_qrmRJ.js","_app/immutable/chunks/DvrgDJkh.js","_app/immutable/chunks/wHeWtbPT.js","_app/immutable/chunks/B0fnQzBR.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/DBWUiwG_.js"];
export const stylesheets = [];
export const fonts = [];
