import * as server from '../entries/pages/admin/_page.server.ts.js';

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/+page.server.ts";
export const imports = ["_app/immutable/nodes/9.CW5EtJNs.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/n3Fn0U0E.js","_app/immutable/chunks/BOzuXFwb.js","_app/immutable/chunks/C9slirZz.js","_app/immutable/chunks/6IlMssVB.js","_app/immutable/chunks/0qFbkZwP.js","_app/immutable/chunks/BSqTHHsY.js","_app/immutable/chunks/xgQ07DsJ.js","_app/immutable/chunks/B5xf_oRu.js","_app/immutable/chunks/Ch0WBF4c.js","_app/immutable/chunks/BE07I85Y.js","_app/immutable/chunks/tGxcAgnL.js","_app/immutable/chunks/ru3zuq2c.js","_app/immutable/chunks/aKOeXeHC.js","_app/immutable/chunks/DbPvmzWc.js","_app/immutable/chunks/Dtlx0U29.js","_app/immutable/chunks/ByCxIQxX.js"];
export const stylesheets = [];
export const fonts = [];
