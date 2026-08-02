import * as server from '../entries/pages/admin/classes/_page.server.ts.js';

export const index = 11;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/classes/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/classes/+page.server.ts";
export const imports = ["_app/immutable/nodes/11.Be-CHUZ5.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/B_wgVCD3.js","_app/immutable/chunks/BNACDoGZ.js","_app/immutable/chunks/CSaYYiLa.js","_app/immutable/chunks/lO_yT19u.js","_app/immutable/chunks/DClR96SM.js","_app/immutable/chunks/B1FwHZj5.js","_app/immutable/chunks/CwtSxmsW.js","_app/immutable/chunks/D6K6sTnQ.js","_app/immutable/chunks/CeghRj4g.js","_app/immutable/chunks/B38xbdib.js","_app/immutable/chunks/CRorGl2V.js","_app/immutable/chunks/BdvkfkWv.js","_app/immutable/chunks/DvIkDlGS.js","_app/immutable/chunks/ChLNHVnn.js","_app/immutable/chunks/BLnsRq1k.js","_app/immutable/chunks/DLQ0tvUh.js"];
export const stylesheets = [];
export const fonts = [];
