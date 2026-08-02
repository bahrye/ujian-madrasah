import * as server from '../entries/pages/admin/results/_attemptId_/_page.server.ts.js';

export const index = 15;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/results/_attemptId_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/results/[attemptId]/+page.server.ts";
export const imports = ["_app/immutable/nodes/15.C6sZRFio.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/B_wgVCD3.js","_app/immutable/chunks/BNACDoGZ.js","_app/immutable/chunks/CSaYYiLa.js","_app/immutable/chunks/lO_yT19u.js","_app/immutable/chunks/DClR96SM.js","_app/immutable/chunks/DzGvzWgW.js","_app/immutable/chunks/B1FwHZj5.js","_app/immutable/chunks/B38xbdib.js","_app/immutable/chunks/ChLNHVnn.js","_app/immutable/chunks/CcJDwDvi.js"];
export const stylesheets = [];
export const fonts = [];
