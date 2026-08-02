import * as server from '../entries/pages/siswa/_page.server.ts.js';

export const index = 29;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/siswa/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/siswa/+page.server.ts";
export const imports = ["_app/immutable/nodes/29.DRU3_0WB.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DAPi2KHF.js","_app/immutable/chunks/BYpKmSk7.js","_app/immutable/chunks/Cyp6lZf_.js","_app/immutable/chunks/C4hz3o9S.js","_app/immutable/chunks/C5YBDGaV.js","_app/immutable/chunks/BtDjKQnb.js","_app/immutable/chunks/BoDCKNnL.js","_app/immutable/chunks/CRJPPOXR.js","_app/immutable/chunks/CdDFzSxs.js","_app/immutable/chunks/Ko9SR4FI.js"];
export const stylesheets = [];
export const fonts = [];
