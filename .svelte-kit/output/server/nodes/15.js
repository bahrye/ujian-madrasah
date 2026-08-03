import * as server from '../entries/pages/admin/media-bank/_page.server.ts.js';

export const index = 15;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/media-bank/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/media-bank/+page.server.ts";
export const imports = ["_app/immutable/nodes/15.DvrCyGYL.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BV1hr-UK.js","_app/immutable/chunks/BxH7Qk13.js","_app/immutable/chunks/DIMz4J0V.js","_app/immutable/chunks/DHon3iv8.js","_app/immutable/chunks/B-vHU7aS.js","_app/immutable/chunks/CJVAUuBs.js","_app/immutable/chunks/ByPI8wOR.js","_app/immutable/chunks/DRi8vVW5.js","_app/immutable/chunks/CSCmeJqC.js","_app/immutable/chunks/Cfbw3jCc.js","_app/immutable/chunks/DUFUeTgQ.js","_app/immutable/chunks/BR9p7IiS.js","_app/immutable/chunks/BJX0sixW.js","_app/immutable/chunks/5-oMPTAv.js","_app/immutable/chunks/BYaC5aJQ.js"];
export const stylesheets = [];
export const fonts = [];
