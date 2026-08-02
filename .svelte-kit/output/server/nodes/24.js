import * as server from '../entries/pages/pengawas/_page.server.ts.js';

export const index = 24;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/pengawas/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/pengawas/+page.server.ts";
export const imports = ["_app/immutable/nodes/24.BFGJE033.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/B_wgVCD3.js","_app/immutable/chunks/BNACDoGZ.js","_app/immutable/chunks/CSaYYiLa.js","_app/immutable/chunks/lO_yT19u.js","_app/immutable/chunks/DClR96SM.js","_app/immutable/chunks/B1FwHZj5.js","_app/immutable/chunks/B38xbdib.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/2ua-DqRu.js","_app/immutable/chunks/BfiCelro.js","_app/immutable/chunks/ChLNHVnn.js","_app/immutable/chunks/CcJDwDvi.js"];
export const stylesheets = [];
export const fonts = [];
