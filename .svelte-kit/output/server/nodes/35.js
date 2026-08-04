import * as server from '../entries/pages/pengawas/tokens/_page.server.ts.js';

export const index = 35;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/pengawas/tokens/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/pengawas/tokens/+page.server.ts";
export const imports = ["_app/immutable/nodes/35.C_6vy8iY.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DIqfK5LK.js","_app/immutable/chunks/GROjdWtC.js","_app/immutable/chunks/D7FvC3v6.js","_app/immutable/chunks/CsadQQqy.js","_app/immutable/chunks/C5HAPqUk.js","_app/immutable/chunks/DJqv4JK0.js","_app/immutable/chunks/DVBbKyQv.js","_app/immutable/chunks/Bm-wld5b.js","_app/immutable/chunks/B4DOviFn.js","_app/immutable/chunks/DVVCut0O.js","_app/immutable/chunks/DcVTZJh4.js","_app/immutable/chunks/Dk1X5uEI.js","_app/immutable/chunks/DNeMqas3.js","_app/immutable/chunks/GZBD4ez8.js","_app/immutable/chunks/B7Y6kx2q.js","_app/immutable/chunks/BaTBMN-4.js","_app/immutable/chunks/Yo9yLEva.js","_app/immutable/chunks/L3EouOTm.js","_app/immutable/chunks/DHGzv_gR.js"];
export const stylesheets = [];
export const fonts = [];
