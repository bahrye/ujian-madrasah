import * as server from '../entries/pages/admin/_layout.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/+layout.server.ts";
export const imports = ["_app/immutable/nodes/2.Bzl80lfY.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CJ6315G4.js","_app/immutable/chunks/DU7PTdcz.js","_app/immutable/chunks/xERt-kcN.js","_app/immutable/chunks/B6jGod6a.js","_app/immutable/chunks/DcB8fGZ9.js","_app/immutable/chunks/7z2sG6KI.js","_app/immutable/chunks/DYFg-3Jq.js","_app/immutable/chunks/B6nL619Y.js","_app/immutable/chunks/KjQSC1ua.js","_app/immutable/chunks/kmaicCfi.js","_app/immutable/chunks/CdvAxIBr.js","_app/immutable/chunks/B-B2XL51.js","_app/immutable/chunks/C60cHTm1.js","_app/immutable/chunks/B5xf_oRu.js","_app/immutable/chunks/C1d1T5oY.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/DTdIuDjY.js","_app/immutable/chunks/DQt8Uo7J.js","_app/immutable/chunks/CikCLPo9.js","_app/immutable/chunks/CQiepFix.js","_app/immutable/chunks/9IoSHjh7.js","_app/immutable/chunks/Czq8_PJR.js","_app/immutable/chunks/Bb4aI_Yy.js","_app/immutable/chunks/30I-1-mF.js","_app/immutable/chunks/Ch4NoCW3.js"];
export const stylesheets = [];
export const fonts = [];
