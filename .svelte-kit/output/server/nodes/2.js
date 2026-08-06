import * as server from '../entries/pages/admin/_layout.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/+layout.server.ts";
export const imports = ["_app/immutable/nodes/2.DHF28iE1.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/C7EiyzO9.js","_app/immutable/chunks/DaxUIi1N.js","_app/immutable/chunks/BcBx_DE6.js","_app/immutable/chunks/-dQGtK5g.js","_app/immutable/chunks/DlfC_uMm.js","_app/immutable/chunks/DZWI-wt2.js","_app/immutable/chunks/BP7TrtM-.js","_app/immutable/chunks/CUCcUmA5.js","_app/immutable/chunks/D0kWAKGz.js","_app/immutable/chunks/ByWXOByZ.js","_app/immutable/chunks/fBRbgZ48.js","_app/immutable/chunks/6CbI-N2A.js","_app/immutable/chunks/BD3Z46Uh.js","_app/immutable/chunks/DOunTSY7.js","_app/immutable/chunks/B5xf_oRu.js","_app/immutable/chunks/D9ILMAjX.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/DU3Tf6Gn.js","_app/immutable/chunks/Bo8MAjg6.js","_app/immutable/chunks/nY-h1Ee8.js","_app/immutable/chunks/taqFCRQ_.js","_app/immutable/chunks/CGRbVy_i.js","_app/immutable/chunks/_nKwEuXD.js","_app/immutable/chunks/jrDXix3h.js","_app/immutable/chunks/QYTm9bP2.js","_app/immutable/chunks/CMngEwQg.js"];
export const stylesheets = [];
export const fonts = [];
