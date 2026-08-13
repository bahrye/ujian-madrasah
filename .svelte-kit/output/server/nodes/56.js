import * as server from '../entries/pages/print/kartu/_exam_id_/_page.server.ts.js';

export const index = 56;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/print/kartu/_exam_id_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/print/kartu/[exam_id]/+page.server.ts";
export const imports = ["_app/immutable/nodes/56.BO5v4-3i.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DEV4lICE.js","_app/immutable/chunks/DlWfQ4JO.js","_app/immutable/chunks/DNg1Gm6A.js","_app/immutable/chunks/BHaT75b3.js","_app/immutable/chunks/Di6qegb7.js","_app/immutable/chunks/BlV3z5Rm.js","_app/immutable/chunks/BFVEoR70.js","_app/immutable/chunks/BcJaZxXK.js","_app/immutable/chunks/BvDSmHLP.js","_app/immutable/chunks/Crmf0lUV.js","_app/immutable/chunks/BGS6olL9.js"];
export const stylesheets = ["_app/immutable/assets/55.roWMPQR0.css"];
export const fonts = [];
