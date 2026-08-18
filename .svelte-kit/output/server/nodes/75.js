import * as server from '../entries/pages/siswa/papan-peringkat/_examId_/_page.server.ts.js';

export const index = 75;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/siswa/papan-peringkat/_examId_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/siswa/papan-peringkat/[examId]/+page.server.ts";
export const imports = ["_app/immutable/nodes/75.CBYKNBOL.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/B3hsJeW7.js","_app/immutable/chunks/D9IgJ_RW.js","_app/immutable/chunks/D9tcitos.js","_app/immutable/chunks/e2idzwbV.js","_app/immutable/chunks/CRdii_PC.js","_app/immutable/chunks/BdmV_moa.js","_app/immutable/chunks/CqXZa_Mr.js","_app/immutable/chunks/qH3QSuMN.js","_app/immutable/chunks/BTEs37z5.js","_app/immutable/chunks/BPxfzyQp.js","_app/immutable/chunks/DbPvmzWc.js"];
export const stylesheets = [];
export const fonts = [];
