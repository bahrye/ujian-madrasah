import * as server from '../entries/pages/superadmin/_layout.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/superadmin/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/superadmin/+layout.server.ts";
export const imports = ["_app/immutable/nodes/6.BkbWp05h.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BV1hr-UK.js","_app/immutable/chunks/BxH7Qk13.js","_app/immutable/chunks/CzEvOKrl.js","_app/immutable/chunks/DUFUeTgQ.js","_app/immutable/chunks/DHon3iv8.js","_app/immutable/chunks/DIMz4J0V.js","_app/immutable/chunks/CNBMc3QT.js","_app/immutable/chunks/B-vHU7aS.js","_app/immutable/chunks/DvGlIG5e.js","_app/immutable/chunks/sHRz0Lil.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/CX_A_iYc.js","_app/immutable/chunks/DMBmrML1.js","_app/immutable/chunks/BrU0cvcn.js","_app/immutable/chunks/CSCmeJqC.js","_app/immutable/chunks/Zee0eR3e.js","_app/immutable/chunks/C3TyuUHs.js","_app/immutable/chunks/CqGvnb0q.js","_app/immutable/chunks/RHhvIjaC.js"];
export const stylesheets = [];
export const fonts = [];
