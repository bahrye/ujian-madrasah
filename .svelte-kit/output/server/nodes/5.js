import * as server from '../entries/pages/print/_layout.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/print/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/print/+layout.server.ts";
export const imports = ["_app/immutable/nodes/5.4xaDdvf_.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CITop0DM.js","_app/immutable/chunks/C1hmICTo.js","_app/immutable/chunks/CmtVvTtB.js","_app/immutable/chunks/BbTj8kse.js"];
export const stylesheets = [];
export const fonts = [];
