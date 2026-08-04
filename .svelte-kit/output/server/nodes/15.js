import * as server from '../entries/pages/admin/media-bank/_page.server.ts.js';

export const index = 15;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/media-bank/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/media-bank/+page.server.ts";
export const imports = ["_app/immutable/nodes/15.BqZGZa5b.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DIqfK5LK.js","_app/immutable/chunks/GROjdWtC.js","_app/immutable/chunks/CsadQQqy.js","_app/immutable/chunks/C5HAPqUk.js","_app/immutable/chunks/DJqv4JK0.js","_app/immutable/chunks/DVBbKyQv.js","_app/immutable/chunks/BFYIvGaq.js","_app/immutable/chunks/D8eScMie.js","_app/immutable/chunks/D7FvC3v6.js","_app/immutable/chunks/gK45pW27.js","_app/immutable/chunks/DcVTZJh4.js","_app/immutable/chunks/Dk1X5uEI.js","_app/immutable/chunks/DNeMqas3.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/B7Y6kx2q.js","_app/immutable/chunks/C8XpPPYO.js","_app/immutable/chunks/BaTBMN-4.js","_app/immutable/chunks/BuncTwWH.js","_app/immutable/chunks/DlcSkKzz.js","_app/immutable/chunks/BGnpMMhG.js","_app/immutable/chunks/DSLd5j-z.js"];
export const stylesheets = [];
export const fonts = [];
