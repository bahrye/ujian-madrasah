import * as server from '../entries/pages/siswa/_page.server.ts.js';

export const index = 58;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/siswa/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/siswa/+page.server.ts";
export const imports = ["_app/immutable/nodes/58.BHO_zE50.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CJ6315G4.js","_app/immutable/chunks/DU7PTdcz.js","_app/immutable/chunks/CQiepFix.js","_app/immutable/chunks/KjQSC1ua.js","_app/immutable/chunks/kmaicCfi.js","_app/immutable/chunks/CdvAxIBr.js","_app/immutable/chunks/CPHvxiz7.js","_app/immutable/chunks/C60cHTm1.js","_app/immutable/chunks/B5xf_oRu.js","_app/immutable/chunks/B6jGod6a.js","_app/immutable/chunks/DcB8fGZ9.js","_app/immutable/chunks/7z2sG6KI.js","_app/immutable/chunks/DYFg-3Jq.js","_app/immutable/chunks/Czq8_PJR.js","_app/immutable/chunks/DbPvmzWc.js","_app/immutable/chunks/Dhozj9N_.js","_app/immutable/chunks/DBMHJ6_9.js"];
export const stylesheets = [];
export const fonts = [];
