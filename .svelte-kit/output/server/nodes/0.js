import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.BmkQ9l5-.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/B0ijxZbD.js","_app/immutable/chunks/DPNwnKeP.js","_app/immutable/chunks/DkyPrVKW.js","_app/immutable/chunks/CX1LO43l.js","_app/immutable/chunks/3bMWRm-j.js","_app/immutable/chunks/BbB0bEjC.js","_app/immutable/chunks/HLPvsicz.js","_app/immutable/chunks/DNeMqas3.js","_app/immutable/chunks/BRJ75Y6A.js","_app/immutable/chunks/Ct1RyXg2.js","_app/immutable/chunks/DCop3B6M.js","_app/immutable/chunks/Dr0s9hqZ.js"];
export const stylesheets = ["_app/immutable/assets/0.-Lpr3moa.css"];
export const fonts = [];
