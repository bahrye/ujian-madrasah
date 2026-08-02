import * as server from '../entries/pages/admin/bank-soal/_examId_/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/bank-soal/_examId_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/bank-soal/[examId]/+page.server.ts";
export const imports = ["_app/immutable/nodes/10.D5eD65Gg.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DAPi2KHF.js","_app/immutable/chunks/BYpKmSk7.js","_app/immutable/chunks/C5YBDGaV.js","_app/immutable/chunks/C4hz3o9S.js","_app/immutable/chunks/BtDjKQnb.js","_app/immutable/chunks/BoDCKNnL.js","_app/immutable/chunks/BXa8prFy.js","_app/immutable/chunks/Dd0U9sfd.js","_app/immutable/chunks/Cyp6lZf_.js","_app/immutable/chunks/9i03UTY1.js","_app/immutable/chunks/CRJPPOXR.js","_app/immutable/chunks/CdDFzSxs.js","_app/immutable/chunks/UU5ipmUI.js","_app/immutable/chunks/C4w1PCZZ.js","_app/immutable/chunks/4ljxv0xc.js","_app/immutable/chunks/CK7XYWQh.js","_app/immutable/chunks/DLGtX8Cu.js","_app/immutable/chunks/DmTSHefo.js","_app/immutable/chunks/Ko9SR4FI.js","_app/immutable/chunks/jlDPBGc6.js","_app/immutable/chunks/CwSXRFSF.js"];
export const stylesheets = [];
export const fonts = [];
