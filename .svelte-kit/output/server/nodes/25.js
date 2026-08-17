import * as server from '../entries/pages/admin/results/_page.server.ts.js';

export const index = 25;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/results/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/results/+page.server.ts";
export const imports = ["_app/immutable/nodes/25.DGHlunzi.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CJ6315G4.js","_app/immutable/chunks/DU7PTdcz.js","_app/immutable/chunks/KjQSC1ua.js","_app/immutable/chunks/kmaicCfi.js","_app/immutable/chunks/CdvAxIBr.js","_app/immutable/chunks/CPHvxiz7.js","_app/immutable/chunks/C60cHTm1.js","_app/immutable/chunks/B5xf_oRu.js","_app/immutable/chunks/B6jGod6a.js","_app/immutable/chunks/DcB8fGZ9.js","_app/immutable/chunks/7z2sG6KI.js","_app/immutable/chunks/DYFg-3Jq.js","_app/immutable/chunks/DbPvmzWc.js","_app/immutable/chunks/BRlo2wsf.js","_app/immutable/chunks/CQiepFix.js","_app/immutable/chunks/ByCxIQxX.js","_app/immutable/chunks/DWrr8Zog.js","_app/immutable/chunks/CuWA6tYq.js","_app/immutable/chunks/xERt-kcN.js","_app/immutable/chunks/B-B2XL51.js","_app/immutable/chunks/C4idOEyI.js","_app/immutable/chunks/C1d1T5oY.js","_app/immutable/chunks/BgX6hkEH.js","_app/immutable/chunks/9r67jZnA.js","_app/immutable/chunks/Bbl8GUe1.js","_app/immutable/chunks/a-GantZ8.js","_app/immutable/chunks/CKN5doRT.js","_app/immutable/chunks/Bb4aI_Yy.js"];
export const stylesheets = [];
export const fonts = [];
