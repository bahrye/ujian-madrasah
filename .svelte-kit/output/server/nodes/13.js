import * as server from '../entries/pages/admin/exams/_page.server.ts.js';

export const index = 13;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/exams/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/exams/+page.server.ts";
export const imports = ["_app/immutable/nodes/13.CzgaWHxS.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/B0ijxZbD.js","_app/immutable/chunks/DPNwnKeP.js","_app/immutable/chunks/3bMWRm-j.js","_app/immutable/chunks/BbB0bEjC.js","_app/immutable/chunks/DArLYInW.js","_app/immutable/chunks/fzEvb87m.js","_app/immutable/chunks/Bfx4Etok.js","_app/immutable/chunks/jSlxauXp.js","_app/immutable/chunks/CX1LO43l.js","_app/immutable/chunks/Mz30PhWi.js","_app/immutable/chunks/C2PwgiAd.js","_app/immutable/chunks/DDbFTINM.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/BRJ75Y6A.js","_app/immutable/chunks/B13sAwyh.js","_app/immutable/chunks/BD0xYbDy.js","_app/immutable/chunks/Bq16tzCR.js","_app/immutable/chunks/BGA0cP6U.js"];
export const stylesheets = [];
export const fonts = [];
