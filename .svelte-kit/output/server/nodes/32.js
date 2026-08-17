import * as server from '../entries/pages/guru/_page.server.ts.js';

export const index = 32;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/guru/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/guru/+page.server.ts";
export const imports = ["_app/immutable/nodes/32.sRfNmpCP.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/UDcyT5dE.js","_app/immutable/chunks/DsjVLxFs.js","_app/immutable/chunks/vU2YrzcE.js","_app/immutable/chunks/5X7QIpkU.js","_app/immutable/chunks/Vr_N5j1Q.js","_app/immutable/chunks/D9dL3ymz.js","_app/immutable/chunks/BSSW4fmP.js","_app/immutable/chunks/CFsR1-3_.js","_app/immutable/chunks/BajGDXqa.js","_app/immutable/chunks/C3dcuGEb.js","_app/immutable/chunks/D5QCWm8k.js","_app/immutable/chunks/yAu4mK0w.js","_app/immutable/chunks/B5xf_oRu.js","_app/immutable/chunks/BOeQCzk7.js"];
export const stylesheets = [];
export const fonts = [];
