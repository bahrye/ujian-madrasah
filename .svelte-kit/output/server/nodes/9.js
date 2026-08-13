import * as server from '../entries/pages/admin/_page.server.ts.js';

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/+page.server.ts";
export const imports = ["_app/immutable/nodes/9.u5W9r2zB.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DEV4lICE.js","_app/immutable/chunks/DlWfQ4JO.js","_app/immutable/chunks/DNg1Gm6A.js","_app/immutable/chunks/BHaT75b3.js","_app/immutable/chunks/Di6qegb7.js","_app/immutable/chunks/BlV3z5Rm.js","_app/immutable/chunks/BFVEoR70.js","_app/immutable/chunks/DM9h96-p.js","_app/immutable/chunks/B5xf_oRu.js","_app/immutable/chunks/C68dH1AR.js","_app/immutable/chunks/BcJaZxXK.js","_app/immutable/chunks/BvDSmHLP.js","_app/immutable/chunks/Crmf0lUV.js","_app/immutable/chunks/BGS6olL9.js","_app/immutable/chunks/4j8J6LnF.js","_app/immutable/chunks/BpUtQDo9.js","_app/immutable/chunks/Czq8_PJR.js"];
export const stylesheets = [];
export const fonts = [];
