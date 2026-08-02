import * as server from '../entries/pages/superadmin/admins/_page.server.ts.js';

export const index = 30;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/superadmin/admins/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/superadmin/admins/+page.server.ts";
export const imports = ["_app/immutable/nodes/30.Ck2ZCJqR.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/B3v4fLL-.js","_app/immutable/chunks/DjxZJNjb.js","_app/immutable/chunks/CE25VFzu.js","_app/immutable/chunks/1qQSQ1OQ.js","_app/immutable/chunks/CZGSNwzI.js","_app/immutable/chunks/KyAKootW.js","_app/immutable/chunks/D2qh4vM2.js","_app/immutable/chunks/DkTtOBem.js","_app/immutable/chunks/BYZt9H8_.js","_app/immutable/chunks/OB5CYTL5.js","_app/immutable/chunks/CymmojmY.js","_app/immutable/chunks/DusaULsA.js"];
export const stylesheets = [];
export const fonts = [];
