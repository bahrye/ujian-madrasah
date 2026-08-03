import * as server from '../entries/pages/pengawas/_page.server.ts.js';

export const index = 26;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/pengawas/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/pengawas/+page.server.ts";
export const imports = ["_app/immutable/nodes/26.9mK0hCRd.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DAPi2KHF.js","_app/immutable/chunks/BYpKmSk7.js","_app/immutable/chunks/C4hz3o9S.js","_app/immutable/chunks/C5YBDGaV.js","_app/immutable/chunks/BtDjKQnb.js","_app/immutable/chunks/BoDCKNnL.js","_app/immutable/chunks/CRJPPOXR.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/D9C9tGTi.js","_app/immutable/chunks/BjnN4-yn.js","_app/immutable/chunks/CdDFzSxs.js","_app/immutable/chunks/B9YYi567.js"];
export const stylesheets = [];
export const fonts = [];
