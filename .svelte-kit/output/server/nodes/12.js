import * as server from '../entries/pages/admin/classes/_page.server.ts.js';

export const index = 12;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/classes/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/classes/+page.server.ts";
export const imports = ["_app/immutable/nodes/12.EHNmlpze.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DIqfK5LK.js","_app/immutable/chunks/GROjdWtC.js","_app/immutable/chunks/CsadQQqy.js","_app/immutable/chunks/C5HAPqUk.js","_app/immutable/chunks/DJqv4JK0.js","_app/immutable/chunks/DVBbKyQv.js","_app/immutable/chunks/h2DrFCup.js","_app/immutable/chunks/CI03RLNl.js","_app/immutable/chunks/D7FvC3v6.js","_app/immutable/chunks/B1hbkFy7.js","_app/immutable/chunks/DcVTZJh4.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/B7Y6kx2q.js","_app/immutable/chunks/C8XpPPYO.js","_app/immutable/chunks/BaTBMN-4.js","_app/immutable/chunks/a6FgbPSA.js","_app/immutable/chunks/BOWj4hxQ.js","_app/immutable/chunks/C3qCnave.js","_app/immutable/chunks/Dk1X5uEI.js","_app/immutable/chunks/DNeMqas3.js","_app/immutable/chunks/BGnpMMhG.js","_app/immutable/chunks/L3EouOTm.js"];
export const stylesheets = [];
export const fonts = [];
