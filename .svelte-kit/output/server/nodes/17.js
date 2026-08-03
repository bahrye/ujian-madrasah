import * as server from '../entries/pages/admin/subjects/_page.server.ts.js';

export const index = 17;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/subjects/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/subjects/+page.server.ts";
export const imports = ["_app/immutable/nodes/17.DAG0e-MX.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DAPi2KHF.js","_app/immutable/chunks/BYpKmSk7.js","_app/immutable/chunks/C4hz3o9S.js","_app/immutable/chunks/C5YBDGaV.js","_app/immutable/chunks/BtDjKQnb.js","_app/immutable/chunks/BoDCKNnL.js","_app/immutable/chunks/HgaT0_12.js","_app/immutable/chunks/EdVd12-H.js","_app/immutable/chunks/Cyp6lZf_.js","_app/immutable/chunks/BDMlq3in.js","_app/immutable/chunks/CRJPPOXR.js","_app/immutable/chunks/KKfDvFM6.js","_app/immutable/chunks/CK7XYWQh.js","_app/immutable/chunks/DLGtX8Cu.js","_app/immutable/chunks/CdDFzSxs.js","_app/immutable/chunks/DmTSHefo.js","_app/immutable/chunks/jlDPBGc6.js"];
export const stylesheets = [];
export const fonts = [];
