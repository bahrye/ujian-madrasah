import * as server from '../entries/pages/admin/tokens/_page.server.ts.js';

export const index = 30;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/tokens/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/tokens/+page.server.ts";
export const imports = ["_app/immutable/nodes/30.u0xJ3JKu.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CJ6315G4.js","_app/immutable/chunks/DU7PTdcz.js","_app/immutable/chunks/CQiepFix.js","_app/immutable/chunks/KjQSC1ua.js","_app/immutable/chunks/7z2sG6KI.js","_app/immutable/chunks/DYFg-3Jq.js","_app/immutable/chunks/kmaicCfi.js","_app/immutable/chunks/CdvAxIBr.js","_app/immutable/chunks/CPHvxiz7.js","_app/immutable/chunks/C4idOEyI.js","_app/immutable/chunks/C60cHTm1.js","_app/immutable/chunks/B5xf_oRu.js","_app/immutable/chunks/CwJQ6YeO.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/B6jGod6a.js","_app/immutable/chunks/DTdIuDjY.js","_app/immutable/chunks/DcB8fGZ9.js","_app/immutable/chunks/DbPvmzWc.js","_app/immutable/chunks/DUDnlW92.js","_app/immutable/chunks/TvfVeDO1.js","_app/immutable/chunks/DxZdvZHW.js","_app/immutable/chunks/ByCxIQxX.js","_app/immutable/chunks/Bb4aI_Yy.js","_app/immutable/chunks/BzrZV2Yd.js"];
export const stylesheets = [];
export const fonts = [];
