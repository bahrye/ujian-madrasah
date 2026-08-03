import * as server from '../entries/pages/admin/classes/_page.server.ts.js';

export const index = 11;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/classes/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/classes/+page.server.ts";
export const imports = ["_app/immutable/nodes/11.CluYFX77.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DAPi2KHF.js","_app/immutable/chunks/BYpKmSk7.js","_app/immutable/chunks/C4hz3o9S.js","_app/immutable/chunks/C5YBDGaV.js","_app/immutable/chunks/BtDjKQnb.js","_app/immutable/chunks/BoDCKNnL.js","_app/immutable/chunks/BaN3aT1Z.js","_app/immutable/chunks/B_210Vg4.js","_app/immutable/chunks/Cyp6lZf_.js","_app/immutable/chunks/CQ5oB8GY.js","_app/immutable/chunks/CRJPPOXR.js","_app/immutable/chunks/DQjXemq7.js","_app/immutable/chunks/CK7XYWQh.js","_app/immutable/chunks/DLGtX8Cu.js","_app/immutable/chunks/CdDFzSxs.js","_app/immutable/chunks/DmTSHefo.js","_app/immutable/chunks/jlDPBGc6.js"];
export const stylesheets = [];
export const fonts = [];
