import * as server from '../entries/pages/admin/results/_page.server.ts.js';

export const index = 16;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/results/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/results/+page.server.ts";
export const imports = ["_app/immutable/nodes/16.LMaTzkIK.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DIqfK5LK.js","_app/immutable/chunks/GROjdWtC.js","_app/immutable/chunks/CsadQQqy.js","_app/immutable/chunks/C5HAPqUk.js","_app/immutable/chunks/DJqv4JK0.js","_app/immutable/chunks/DVBbKyQv.js","_app/immutable/chunks/DcVTZJh4.js","_app/immutable/chunks/Dk1X5uEI.js","_app/immutable/chunks/DNeMqas3.js","_app/immutable/chunks/B7Y6kx2q.js","_app/immutable/chunks/BaTBMN-4.js","_app/immutable/chunks/YALfQytS.js","_app/immutable/chunks/D7FvC3v6.js","_app/immutable/chunks/BjHZ6aL8.js","_app/immutable/chunks/Bp9huitm.js","_app/immutable/chunks/BOWj4hxQ.js","_app/immutable/chunks/C3qCnave.js","_app/immutable/chunks/C6p9BOze.js","_app/immutable/chunks/UbvmOhJu.js","_app/immutable/chunks/BGnpMMhG.js"];
export const stylesheets = [];
export const fonts = [];
