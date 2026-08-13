import * as server from '../entries/pages/siswa/papan-peringkat/_examId_/_page.server.ts.js';

export const index = 64;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/siswa/papan-peringkat/_examId_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/siswa/papan-peringkat/[examId]/+page.server.ts";
export const imports = ["_app/immutable/nodes/64.DVL30gg1.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DEV4lICE.js","_app/immutable/chunks/DlWfQ4JO.js","_app/immutable/chunks/DNg1Gm6A.js","_app/immutable/chunks/BHaT75b3.js","_app/immutable/chunks/Di6qegb7.js","_app/immutable/chunks/BlV3z5Rm.js","_app/immutable/chunks/BFVEoR70.js","_app/immutable/chunks/BcJaZxXK.js","_app/immutable/chunks/BvDSmHLP.js","_app/immutable/chunks/Crmf0lUV.js","_app/immutable/chunks/BGS6olL9.js"];
export const stylesheets = [];
export const fonts = [];
