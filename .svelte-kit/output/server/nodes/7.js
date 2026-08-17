import * as server from '../entries/pages/superadmin/_layout.server.ts.js';

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/superadmin/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/superadmin/+layout.server.ts";
export const imports = ["_app/immutable/nodes/7.CtFi7R69.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CJ6315G4.js","_app/immutable/chunks/DU7PTdcz.js","_app/immutable/chunks/xERt-kcN.js","_app/immutable/chunks/B6jGod6a.js","_app/immutable/chunks/DcB8fGZ9.js","_app/immutable/chunks/7z2sG6KI.js","_app/immutable/chunks/DYFg-3Jq.js","_app/immutable/chunks/DCqV2Sc1.js","_app/immutable/chunks/KjQSC1ua.js","_app/immutable/chunks/kmaicCfi.js","_app/immutable/chunks/CdvAxIBr.js","_app/immutable/chunks/B-B2XL51.js","_app/immutable/chunks/C60cHTm1.js","_app/immutable/chunks/B5xf_oRu.js","_app/immutable/chunks/C1d1T5oY.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/DTdIuDjY.js","_app/immutable/chunks/BROjngnH.js","_app/immutable/chunks/BUX62iCi.js","_app/immutable/chunks/CQiepFix.js","_app/immutable/chunks/ByCxIQxX.js","_app/immutable/chunks/Bb4aI_Yy.js","_app/immutable/chunks/30I-1-mF.js","_app/immutable/chunks/DbPvmzWc.js","_app/immutable/chunks/Ch4NoCW3.js"];
export const stylesheets = [];
export const fonts = [];
