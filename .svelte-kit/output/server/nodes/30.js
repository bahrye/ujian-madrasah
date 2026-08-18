import * as server from '../entries/pages/admin/students/_page.server.ts.js';

export const index = 30;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/students/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/students/+page.server.ts";
export const imports = ["_app/immutable/nodes/30.BgfM3Okg.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/B3hsJeW7.js","_app/immutable/chunks/D9IgJ_RW.js","_app/immutable/chunks/D9tcitos.js","_app/immutable/chunks/e2idzwbV.js","_app/immutable/chunks/CRdii_PC.js","_app/immutable/chunks/BdmV_moa.js","_app/immutable/chunks/C0NGp1Jf.js","_app/immutable/chunks/CLHZOUS6.js","_app/immutable/chunks/B5xf_oRu.js","_app/immutable/chunks/CfbEe77W.js","_app/immutable/chunks/BWrrLwMy.js","_app/immutable/chunks/DxA8IqEl.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/CqXZa_Mr.js","_app/immutable/chunks/BIPr9QeH.js","_app/immutable/chunks/qH3QSuMN.js","_app/immutable/chunks/BTEs37z5.js","_app/immutable/chunks/BPxfzyQp.js","_app/immutable/chunks/Cu9WMuIz.js","_app/immutable/chunks/MaQ8vaHt.js","_app/immutable/chunks/OECOilvQ.js","_app/immutable/chunks/DA8P_PEi.js","_app/immutable/chunks/C9yDcl0r.js","_app/immutable/chunks/D1x44OQM.js","_app/immutable/chunks/CdBxKiRy.js","_app/immutable/chunks/CKN5doRT.js","_app/immutable/chunks/Ca3EAAx6.js","_app/immutable/chunks/DbPvmzWc.js","_app/immutable/chunks/D0g6almG.js","_app/immutable/chunks/CAy_9aVp.js"];
export const stylesheets = ["_app/immutable/assets/30.VB0kvX3s.css"];
export const fonts = [];
