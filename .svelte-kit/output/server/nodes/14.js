import * as server from '../entries/pages/admin/results/_page.server.ts.js';

export const index = 14;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/results/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/results/+page.server.ts";
export const imports = ["_app/immutable/nodes/14.RWFI_-fF.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/B3v4fLL-.js","_app/immutable/chunks/DjxZJNjb.js","_app/immutable/chunks/CE25VFzu.js","_app/immutable/chunks/1qQSQ1OQ.js","_app/immutable/chunks/CZGSNwzI.js","_app/immutable/chunks/KyAKootW.js","_app/immutable/chunks/CY-Desj7.js","_app/immutable/chunks/CymmojmY.js","_app/immutable/chunks/wmSitu1K.js"];
export const stylesheets = [];
export const fonts = [];
