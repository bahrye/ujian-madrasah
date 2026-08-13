import * as server from '../entries/pages/superadmin/_layout.server.ts.js';

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/superadmin/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/superadmin/+layout.server.ts";
export const imports = ["_app/immutable/nodes/7.B7oxF9zS.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DEV4lICE.js","_app/immutable/chunks/DlWfQ4JO.js","_app/immutable/chunks/Bp7yYOqu.js","_app/immutable/chunks/BcJaZxXK.js","_app/immutable/chunks/BvDSmHLP.js","_app/immutable/chunks/Crmf0lUV.js","_app/immutable/chunks/BGS6olL9.js","_app/immutable/chunks/Dmt2gyl0.js","_app/immutable/chunks/DNg1Gm6A.js","_app/immutable/chunks/BHaT75b3.js","_app/immutable/chunks/Di6qegb7.js","_app/immutable/chunks/BmiNS92U.js","_app/immutable/chunks/BFVEoR70.js","_app/immutable/chunks/DM9h96-p.js","_app/immutable/chunks/B5xf_oRu.js","_app/immutable/chunks/CMgRbdcp.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/BbHmEh2l.js","_app/immutable/chunks/DZMEtNNB.js","_app/immutable/chunks/CXfAO0BX.js","_app/immutable/chunks/42hr0qj6.js","_app/immutable/chunks/Ccg8rInU.js","_app/immutable/chunks/Czq8_PJR.js","_app/immutable/chunks/Dy4wo2UF.js","_app/immutable/chunks/WS7GvWbI.js","_app/immutable/chunks/B_nV3ng5.js"];
export const stylesheets = [];
export const fonts = [];
