import * as server from '../entries/pages/admin/exams/_page.server.ts.js';

export const index = 13;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/exams/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/exams/+page.server.ts";
export const imports = ["_app/immutable/nodes/13.Bqn8UkFj.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DIqfK5LK.js","_app/immutable/chunks/GROjdWtC.js","_app/immutable/chunks/CsadQQqy.js","_app/immutable/chunks/C5HAPqUk.js","_app/immutable/chunks/DJqv4JK0.js","_app/immutable/chunks/DVBbKyQv.js","_app/immutable/chunks/C2w_iHTZ.js","_app/immutable/chunks/CB6xqxjU.js","_app/immutable/chunks/D7FvC3v6.js","_app/immutable/chunks/e0-nipqg.js","_app/immutable/chunks/DcVTZJh4.js","_app/immutable/chunks/GZBD4ez8.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/B7Y6kx2q.js","_app/immutable/chunks/C8XpPPYO.js","_app/immutable/chunks/BaTBMN-4.js","_app/immutable/chunks/Yo9yLEva.js","_app/immutable/chunks/L3EouOTm.js"];
export const stylesheets = [];
export const fonts = [];
