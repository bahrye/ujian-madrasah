import * as server from '../entries/pages/guru/results/_page.server.ts.js';

export const index = 23;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/guru/results/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/guru/results/+page.server.ts";
export const imports = ["_app/immutable/nodes/23.CEQXLZ8l.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DAPi2KHF.js","_app/immutable/chunks/BYpKmSk7.js","_app/immutable/chunks/C4hz3o9S.js","_app/immutable/chunks/C5YBDGaV.js","_app/immutable/chunks/BtDjKQnb.js","_app/immutable/chunks/BoDCKNnL.js","_app/immutable/chunks/CRJPPOXR.js","_app/immutable/chunks/CdDFzSxs.js","_app/immutable/chunks/D9Ltvifd.js","_app/immutable/chunks/Cyp6lZf_.js","_app/immutable/chunks/B9YYi567.js"];
export const stylesheets = [];
export const fonts = [];
