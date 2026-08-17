import * as server from '../entries/pages/admin/bank-soal/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/bank-soal/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/bank-soal/+page.server.ts";
export const imports = ["_app/immutable/nodes/10.DHwelXUO.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/UDcyT5dE.js","_app/immutable/chunks/DsjVLxFs.js","_app/immutable/chunks/vU2YrzcE.js","_app/immutable/chunks/D5QCWm8k.js","_app/immutable/chunks/5X7QIpkU.js","_app/immutable/chunks/CZLknIZU.js","_app/immutable/chunks/Vr_N5j1Q.js","_app/immutable/chunks/CRwfoxkr.js","_app/immutable/chunks/Dgkh7M1X.js","_app/immutable/chunks/B-Cj2XlU.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/D9dL3ymz.js","_app/immutable/chunks/DRglPlYD.js","_app/immutable/chunks/BSSW4fmP.js","_app/immutable/chunks/CFsR1-3_.js","_app/immutable/chunks/BajGDXqa.js","_app/immutable/chunks/BOeQCzk7.js","_app/immutable/chunks/B0TnXkdy.js","_app/immutable/chunks/C88u1isR.js","_app/immutable/chunks/Bp3hrXGM.js"];
export const stylesheets = [];
export const fonts = [];
