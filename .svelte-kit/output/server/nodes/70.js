import * as server from '../entries/pages/siswa/ujian/_page.server.ts.js';

export const index = 70;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/siswa/ujian/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/siswa/ujian/+page.server.ts";
export const imports = ["_app/immutable/nodes/70.D485BjdM.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CJ6315G4.js","_app/immutable/chunks/DU7PTdcz.js","_app/immutable/chunks/KjQSC1ua.js","_app/immutable/chunks/kmaicCfi.js","_app/immutable/chunks/CdvAxIBr.js","_app/immutable/chunks/CPHvxiz7.js","_app/immutable/chunks/C4idOEyI.js","_app/immutable/chunks/C1d1T5oY.js","_app/immutable/chunks/BgX6hkEH.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/B6jGod6a.js","_app/immutable/chunks/DTdIuDjY.js","_app/immutable/chunks/DcB8fGZ9.js","_app/immutable/chunks/7z2sG6KI.js","_app/immutable/chunks/DYFg-3Jq.js","_app/immutable/chunks/D5BJHHT0.js","_app/immutable/chunks/b9NQSyc0.js","_app/immutable/chunks/CQiepFix.js","_app/immutable/chunks/lnYnPmaX.js","_app/immutable/chunks/ByCxIQxX.js","_app/immutable/chunks/iQAfk_ag.js"];
export const stylesheets = [];
export const fonts = [];
