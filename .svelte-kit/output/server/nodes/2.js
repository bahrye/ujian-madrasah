import * as server from '../entries/pages/admin/_layout.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/+layout.server.ts";
export const imports = ["_app/immutable/nodes/2.Cvh72Q-t.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/B3hsJeW7.js","_app/immutable/chunks/D9IgJ_RW.js","_app/immutable/chunks/D1x44OQM.js","_app/immutable/chunks/CqXZa_Mr.js","_app/immutable/chunks/qH3QSuMN.js","_app/immutable/chunks/BTEs37z5.js","_app/immutable/chunks/BPxfzyQp.js","_app/immutable/chunks/DoZSyCtb.js","_app/immutable/chunks/D9tcitos.js","_app/immutable/chunks/e2idzwbV.js","_app/immutable/chunks/CRdii_PC.js","_app/immutable/chunks/CdBxKiRy.js","_app/immutable/chunks/CLHZOUS6.js","_app/immutable/chunks/B5xf_oRu.js","_app/immutable/chunks/CfbEe77W.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/BIPr9QeH.js","_app/immutable/chunks/BU7o6El9.js","_app/immutable/chunks/MaQ8vaHt.js","_app/immutable/chunks/OECOilvQ.js","_app/immutable/chunks/D0g6almG.js","_app/immutable/chunks/Ca3EAAx6.js","_app/immutable/chunks/BcbZzcyZ.js","_app/immutable/chunks/DbPvmzWc.js","_app/immutable/chunks/CtzQQWzA.js"];
export const stylesheets = [];
export const fonts = [];
