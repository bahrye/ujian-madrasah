import * as server from '../entries/pages/admin/results/_page.server.ts.js';

export const index = 14;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/results/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/results/+page.server.ts";
export const imports = ["_app/immutable/nodes/14.aYTuSPwF.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DAPi2KHF.js","_app/immutable/chunks/BYpKmSk7.js","_app/immutable/chunks/C4hz3o9S.js","_app/immutable/chunks/C5YBDGaV.js","_app/immutable/chunks/BtDjKQnb.js","_app/immutable/chunks/BoDCKNnL.js","_app/immutable/chunks/CRJPPOXR.js","_app/immutable/chunks/CdDFzSxs.js","_app/immutable/chunks/B_210Vg4.js","_app/immutable/chunks/Cyp6lZf_.js","_app/immutable/chunks/B9YYi567.js","_app/immutable/chunks/DQjXemq7.js","_app/immutable/chunks/CK7XYWQh.js","_app/immutable/chunks/DLGtX8Cu.js","_app/immutable/chunks/BaN3aT1Z.js","_app/immutable/chunks/CQ5oB8GY.js","_app/immutable/chunks/DmTSHefo.js"];
export const stylesheets = [];
export const fonts = [];
