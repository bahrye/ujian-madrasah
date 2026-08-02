import * as server from '../entries/pages/pengawas/monitor/_page.server.ts.js';

export const index = 24;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/pengawas/monitor/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/pengawas/monitor/+page.server.ts";
export const imports = ["_app/immutable/nodes/24.xLzI8vkz.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/B3v4fLL-.js","_app/immutable/chunks/DjxZJNjb.js","_app/immutable/chunks/CE25VFzu.js","_app/immutable/chunks/1qQSQ1OQ.js","_app/immutable/chunks/CZGSNwzI.js","_app/immutable/chunks/KyAKootW.js","_app/immutable/chunks/D2qh4vM2.js","_app/immutable/chunks/DkTtOBem.js","_app/immutable/chunks/BYZt9H8_.js","_app/immutable/chunks/OB5CYTL5.js","_app/immutable/chunks/CY-Desj7.js","_app/immutable/chunks/BYCkQm33.js","_app/immutable/chunks/CymmojmY.js","_app/immutable/chunks/wmSitu1K.js","_app/immutable/chunks/DusaULsA.js"];
export const stylesheets = [];
export const fonts = [];
