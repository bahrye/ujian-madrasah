import * as server from '../entries/pages/superadmin/_layout.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/superadmin/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/superadmin/+layout.server.ts";
export const imports = ["_app/immutable/nodes/6.CtSDftOX.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DIqfK5LK.js","_app/immutable/chunks/GROjdWtC.js","_app/immutable/chunks/BOWj4hxQ.js","_app/immutable/chunks/B7Y6kx2q.js","_app/immutable/chunks/BaTBMN-4.js","_app/immutable/chunks/C5HAPqUk.js","_app/immutable/chunks/CsadQQqy.js","_app/immutable/chunks/Cmhvdsrw.js","_app/immutable/chunks/DJqv4JK0.js","_app/immutable/chunks/C3qCnave.js","_app/immutable/chunks/DcVTZJh4.js","_app/immutable/chunks/Dk1X5uEI.js","_app/immutable/chunks/DNeMqas3.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/C8XpPPYO.js","_app/immutable/chunks/BdJnH7Pw.js","_app/immutable/chunks/3LmywpQn.js","_app/immutable/chunks/D7FvC3v6.js","_app/immutable/chunks/BJMcTASC.js","_app/immutable/chunks/BjHZ6aL8.js","_app/immutable/chunks/Cayn2wdQ.js","_app/immutable/chunks/L3EouOTm.js"];
export const stylesheets = [];
export const fonts = [];
