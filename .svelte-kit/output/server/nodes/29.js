import * as server from '../entries/pages/guru/_page.server.ts.js';

export const index = 29;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/guru/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/guru/+page.server.ts";
export const imports = ["_app/immutable/nodes/29.X2wm_k7Y.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BIooOAay.js","_app/immutable/chunks/knUfZVuA.js","_app/immutable/chunks/DILnuZdk.js","_app/immutable/chunks/DYMRbNWA.js","_app/immutable/chunks/DNfnSWAg.js","_app/immutable/chunks/BKknBcrp.js","_app/immutable/chunks/SdMqDBkV.js","_app/immutable/chunks/IzJYtrUp.js","_app/immutable/chunks/By8t3yp7.js","_app/immutable/chunks/diGzQ5hW.js","_app/immutable/chunks/BsH3C5YT.js","_app/immutable/chunks/BsEC6tHK.js","_app/immutable/chunks/DQK-PM_o.js","_app/immutable/chunks/B5xf_oRu.js","_app/immutable/chunks/DgSQwxXL.js"];
export const stylesheets = [];
export const fonts = [];
