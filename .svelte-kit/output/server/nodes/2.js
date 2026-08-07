import * as server from '../entries/pages/admin/_layout.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/+layout.server.ts";
export const imports = ["_app/immutable/nodes/2.k36NA98q.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BIooOAay.js","_app/immutable/chunks/knUfZVuA.js","_app/immutable/chunks/TqWdQ2Fy.js","_app/immutable/chunks/SdMqDBkV.js","_app/immutable/chunks/IzJYtrUp.js","_app/immutable/chunks/By8t3yp7.js","_app/immutable/chunks/diGzQ5hW.js","_app/immutable/chunks/Bb2YTqzE.js","_app/immutable/chunks/DILnuZdk.js","_app/immutable/chunks/BsEC6tHK.js","_app/immutable/chunks/DYMRbNWA.js","_app/immutable/chunks/B4Jp31M-.js","_app/immutable/chunks/BKknBcrp.js","_app/immutable/chunks/DQK-PM_o.js","_app/immutable/chunks/B5xf_oRu.js","_app/immutable/chunks/BqEmaHRA.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/BcaEBPl8.js","_app/immutable/chunks/WC-1djGU.js","_app/immutable/chunks/DIh1qUCu.js","_app/immutable/chunks/Daeh1Iq0.js","_app/immutable/chunks/Cb-y7Cqy.js","_app/immutable/chunks/DgSQwxXL.js","_app/immutable/chunks/BCxay1Sd.js","_app/immutable/chunks/LrOn3ws3.js","_app/immutable/chunks/C0afqFtf.js"];
export const stylesheets = [];
export const fonts = [];
