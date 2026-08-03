import * as server from '../entries/pages/pengawas/_layout.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/pengawas/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/pengawas/+layout.server.ts";
export const imports = ["_app/immutable/nodes/4.d5imzvhR.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DTI0Se7w.js","_app/immutable/chunks/B-m1hCzt.js","_app/immutable/chunks/DkUc_N3Q.js","_app/immutable/chunks/wHeWtbPT.js","_app/immutable/chunks/CQCwlsVV.js","_app/immutable/chunks/DbD9IbZI.js","_app/immutable/chunks/BZU9mWAU.js","_app/immutable/chunks/MtbvIQbS.js","_app/immutable/chunks/CPy_5-Al.js","_app/immutable/chunks/VibP_tje.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/Bid1EWMa.js","_app/immutable/chunks/1nmtHMib.js","_app/immutable/chunks/pjnrDu98.js","_app/immutable/chunks/Cf_qrmRJ.js","_app/immutable/chunks/COqa9KOH.js","_app/immutable/chunks/DBWUiwG_.js","_app/immutable/chunks/COui177k.js","_app/immutable/chunks/Cj3TY-os.js"];
export const stylesheets = [];
export const fonts = [];
