import * as server from '../entries/pages/guru/bank-soal/_page.server.ts.js';

export const index = 20;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/guru/bank-soal/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/guru/bank-soal/+page.server.ts";
export const imports = ["_app/immutable/nodes/20.BycYAicf.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DAPi2KHF.js","_app/immutable/chunks/BYpKmSk7.js","_app/immutable/chunks/C4hz3o9S.js","_app/immutable/chunks/C5YBDGaV.js","_app/immutable/chunks/BtDjKQnb.js","_app/immutable/chunks/BoDCKNnL.js","_app/immutable/chunks/BOze_TGh.js","_app/immutable/chunks/DKQTJ5RU.js","_app/immutable/chunks/Cyp6lZf_.js","_app/immutable/chunks/B3xkqmzb.js","_app/immutable/chunks/CRJPPOXR.js","_app/immutable/chunks/C4w1PCZZ.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/B9YYi567.js"];
export const stylesheets = [];
export const fonts = [];
