import * as server from '../entries/pages/admin/_layout.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/+layout.server.ts";
export const imports = ["_app/immutable/nodes/2.BtPBsUZF.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/B3v4fLL-.js","_app/immutable/chunks/DjxZJNjb.js","_app/immutable/chunks/CV1v1yow.js","_app/immutable/chunks/CymmojmY.js","_app/immutable/chunks/1qQSQ1OQ.js","_app/immutable/chunks/CE25VFzu.js","_app/immutable/chunks/DPAiWpk_.js","_app/immutable/chunks/CZGSNwzI.js","_app/immutable/chunks/BwfueOc3.js","_app/immutable/chunks/OB5CYTL5.js","_app/immutable/chunks/CY-Desj7.js","_app/immutable/chunks/DusaULsA.js","_app/immutable/chunks/BYCkQm33.js","_app/immutable/chunks/DkTtOBem.js","_app/immutable/chunks/BYZt9H8_.js","_app/immutable/chunks/wmSitu1K.js"];
export const stylesheets = [];
export const fonts = [];
