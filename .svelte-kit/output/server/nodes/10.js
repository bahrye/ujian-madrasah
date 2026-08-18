import * as server from '../entries/pages/admin/bank-soal/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/bank-soal/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/bank-soal/+page.server.ts";
export const imports = ["_app/immutable/nodes/10.CeU_QqAM.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/B3hsJeW7.js","_app/immutable/chunks/D9IgJ_RW.js","_app/immutable/chunks/D9tcitos.js","_app/immutable/chunks/e2idzwbV.js","_app/immutable/chunks/CRdii_PC.js","_app/immutable/chunks/C9yDcl0r.js","_app/immutable/chunks/BdmV_moa.js","_app/immutable/chunks/C0NGp1Jf.js","_app/immutable/chunks/CfbEe77W.js","_app/immutable/chunks/BWrrLwMy.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/CqXZa_Mr.js","_app/immutable/chunks/BIPr9QeH.js","_app/immutable/chunks/qH3QSuMN.js","_app/immutable/chunks/BTEs37z5.js","_app/immutable/chunks/BPxfzyQp.js","_app/immutable/chunks/D0g6almG.js","_app/immutable/chunks/Cu9WMuIz.js","_app/immutable/chunks/MaQ8vaHt.js","_app/immutable/chunks/OECOilvQ.js"];
export const stylesheets = [];
export const fonts = [];
