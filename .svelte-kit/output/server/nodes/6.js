import * as server from '../entries/pages/superadmin/_layout.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/superadmin/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/superadmin/+layout.server.ts";
export const imports = ["_app/immutable/nodes/6.BrsFfDlG.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DAPi2KHF.js","_app/immutable/chunks/BYpKmSk7.js","_app/immutable/chunks/CK7XYWQh.js","_app/immutable/chunks/CRJPPOXR.js","_app/immutable/chunks/C5YBDGaV.js","_app/immutable/chunks/C4hz3o9S.js","_app/immutable/chunks/D7Q2_DT6.js","_app/immutable/chunks/BtDjKQnb.js","_app/immutable/chunks/DLGtX8Cu.js","_app/immutable/chunks/CdDFzSxs.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/D9C9tGTi.js","_app/immutable/chunks/CwSXRFSF.js","_app/immutable/chunks/9i03UTY1.js","_app/immutable/chunks/Cyp6lZf_.js","_app/immutable/chunks/Dd0U9sfd.js","_app/immutable/chunks/Ko9SR4FI.js","_app/immutable/chunks/C4MHh0yo.js","_app/immutable/chunks/jlDPBGc6.js"];
export const stylesheets = [];
export const fonts = [];
