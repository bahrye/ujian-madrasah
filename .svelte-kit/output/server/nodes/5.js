import * as server from '../entries/pages/siswa/_layout.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/siswa/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/siswa/+layout.server.ts";
export const imports = ["_app/immutable/nodes/5.D0NpvvnD.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/B0ijxZbD.js","_app/immutable/chunks/DPNwnKeP.js","_app/immutable/chunks/DkyPrVKW.js","_app/immutable/chunks/BRJ75Y6A.js","_app/immutable/chunks/BD0xYbDy.js","_app/immutable/chunks/BbB0bEjC.js","_app/immutable/chunks/3bMWRm-j.js","_app/immutable/chunks/Dkh1dD6n.js","_app/immutable/chunks/DArLYInW.js","_app/immutable/chunks/BtaQ6AmQ.js","_app/immutable/chunks/C2PwgiAd.js","_app/immutable/chunks/CN-RRP4J.js","_app/immutable/chunks/DNeMqas3.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/B13sAwyh.js","_app/immutable/chunks/SVc2WiKL.js","_app/immutable/chunks/B_CwwvAB.js","_app/immutable/chunks/CX1LO43l.js","_app/immutable/chunks/J_MZ1nqz.js","_app/immutable/chunks/BjHZ6aL8.js","_app/immutable/chunks/B6IhlMNo.js","_app/immutable/chunks/BGA0cP6U.js"];
export const stylesheets = [];
export const fonts = [];
