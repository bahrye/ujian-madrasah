import * as server from '../entries/pages/admin/classes/_page.server.ts.js';

export const index = 12;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/classes/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/classes/+page.server.ts";
export const imports = ["_app/immutable/nodes/12.BYJqCsVr.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BIooOAay.js","_app/immutable/chunks/knUfZVuA.js","_app/immutable/chunks/DILnuZdk.js","_app/immutable/chunks/BsEC6tHK.js","_app/immutable/chunks/DYMRbNWA.js","_app/immutable/chunks/DNfnSWAg.js","_app/immutable/chunks/EbaY8tE5.js","_app/immutable/chunks/BKknBcrp.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/SdMqDBkV.js","_app/immutable/chunks/BcaEBPl8.js","_app/immutable/chunks/IzJYtrUp.js","_app/immutable/chunks/By8t3yp7.js","_app/immutable/chunks/diGzQ5hW.js","_app/immutable/chunks/HiQEVhZr.js","_app/immutable/chunks/C7oyR_8K.js","_app/immutable/chunks/Daeh1Iq0.js","_app/immutable/chunks/Btynw7wr.js","_app/immutable/chunks/BJWeB4GZ.js","_app/immutable/chunks/TqWdQ2Fy.js","_app/immutable/chunks/B4Jp31M-.js","_app/immutable/chunks/DQK-PM_o.js","_app/immutable/chunks/B5xf_oRu.js","_app/immutable/chunks/Djlry0b1.js","_app/immutable/chunks/BCxay1Sd.js"];
export const stylesheets = [];
export const fonts = [];
