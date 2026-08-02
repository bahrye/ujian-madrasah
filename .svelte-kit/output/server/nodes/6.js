import * as server from '../entries/pages/superadmin/_layout.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/superadmin/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/superadmin/+layout.server.ts";
export const imports = ["_app/immutable/nodes/6.CObpz0Fa.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/B_wgVCD3.js","_app/immutable/chunks/BNACDoGZ.js","_app/immutable/chunks/BdvkfkWv.js","_app/immutable/chunks/B38xbdib.js","_app/immutable/chunks/lO_yT19u.js","_app/immutable/chunks/CSaYYiLa.js","_app/immutable/chunks/BklQyYrP.js","_app/immutable/chunks/DClR96SM.js","_app/immutable/chunks/DvIkDlGS.js","_app/immutable/chunks/ChLNHVnn.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/2ua-DqRu.js","_app/immutable/chunks/d1HEby0M.js","_app/immutable/chunks/D6K6sTnQ.js","_app/immutable/chunks/CeghRj4g.js","_app/immutable/chunks/CcJDwDvi.js","_app/immutable/chunks/BZDKLjsO.js","_app/immutable/chunks/DLQ0tvUh.js"];
export const stylesheets = [];
export const fonts = [];
