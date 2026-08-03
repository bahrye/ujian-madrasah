import * as server from '../entries/pages/admin/classes/_page.server.ts.js';

export const index = 12;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/classes/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/classes/+page.server.ts";
export const imports = ["_app/immutable/nodes/12.FwIvgS_3.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BV1hr-UK.js","_app/immutable/chunks/BxH7Qk13.js","_app/immutable/chunks/DIMz4J0V.js","_app/immutable/chunks/DHon3iv8.js","_app/immutable/chunks/B-vHU7aS.js","_app/immutable/chunks/CJVAUuBs.js","_app/immutable/chunks/CF0qWKAQ.js","_app/immutable/chunks/DNNF_unx.js","_app/immutable/chunks/CSCmeJqC.js","_app/immutable/chunks/C6CDd4zl.js","_app/immutable/chunks/DUFUeTgQ.js","_app/immutable/chunks/BYQ_jW0W.js","_app/immutable/chunks/CzEvOKrl.js","_app/immutable/chunks/DvGlIG5e.js","_app/immutable/chunks/BR9p7IiS.js","_app/immutable/chunks/BYaC5aJQ.js","_app/immutable/chunks/RHhvIjaC.js"];
export const stylesheets = [];
export const fonts = [];
