import * as server from '../entries/pages/siswa/jadwal/_page.server.ts.js';

export const index = 65;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/siswa/jadwal/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/siswa/jadwal/+page.server.ts";
export const imports = ["_app/immutable/nodes/65.CJy-EZ_O.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/UDcyT5dE.js","_app/immutable/chunks/DsjVLxFs.js","_app/immutable/chunks/vU2YrzcE.js","_app/immutable/chunks/D5QCWm8k.js","_app/immutable/chunks/5X7QIpkU.js","_app/immutable/chunks/Vr_N5j1Q.js","_app/immutable/chunks/Dgkh7M1X.js","_app/immutable/chunks/D9dL3ymz.js","_app/immutable/chunks/BSSW4fmP.js","_app/immutable/chunks/CFsR1-3_.js","_app/immutable/chunks/BajGDXqa.js","_app/immutable/chunks/DbPvmzWc.js","_app/immutable/chunks/iQAfk_ag.js","_app/immutable/chunks/ByCxIQxX.js"];
export const stylesheets = [];
export const fonts = [];
