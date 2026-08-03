import * as server from '../entries/pages/admin/exams/_page.server.ts.js';

export const index = 12;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/exams/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/exams/+page.server.ts";
export const imports = ["_app/immutable/nodes/12.2txfraa1.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DTI0Se7w.js","_app/immutable/chunks/B-m1hCzt.js","_app/immutable/chunks/DbD9IbZI.js","_app/immutable/chunks/CQCwlsVV.js","_app/immutable/chunks/MtbvIQbS.js","_app/immutable/chunks/DA7HkAFo.js","_app/immutable/chunks/tmlx-iqP.js","_app/immutable/chunks/DA_u7Zny.js","_app/immutable/chunks/Cf_qrmRJ.js","_app/immutable/chunks/BzGUm-N8.js","_app/immutable/chunks/wHeWtbPT.js","_app/immutable/chunks/B0fnQzBR.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/Bid1EWMa.js","_app/immutable/chunks/CqUTEu1o.js","_app/immutable/chunks/Cj3TY-os.js"];
export const stylesheets = [];
export const fonts = [];
