import * as server from '../entries/pages/siswa/_page.server.ts.js';

export const index = 26;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/siswa/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/siswa/+page.server.ts";
export const imports = ["_app/immutable/nodes/26.DmuzIxYP.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/B3v4fLL-.js","_app/immutable/chunks/DjxZJNjb.js","_app/immutable/chunks/CE25VFzu.js","_app/immutable/chunks/1qQSQ1OQ.js","_app/immutable/chunks/CZGSNwzI.js","_app/immutable/chunks/KyAKootW.js","_app/immutable/chunks/OB5CYTL5.js","_app/immutable/chunks/CY-Desj7.js","_app/immutable/chunks/CymmojmY.js","_app/immutable/chunks/wmSitu1K.js"];
export const stylesheets = [];
export const fonts = [];
