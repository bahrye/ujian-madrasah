import * as server from '../entries/pages/admin/bank-soal/_examId_/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/bank-soal/_examId_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/bank-soal/[examId]/+page.server.ts";
export const imports = ["_app/immutable/nodes/10.Dx4TlnRq.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DClErzyl.js","_app/immutable/chunks/D5nW2bLe.js","_app/immutable/chunks/D9VyE4-j.js","_app/immutable/chunks/CcNdKUAA.js","_app/immutable/chunks/D8jXJOew.js","_app/immutable/chunks/el_xgqqX.js","_app/immutable/chunks/BC4qLlzU.js","_app/immutable/chunks/0YV8f1FJ.js","_app/immutable/chunks/DN402ODw.js","_app/immutable/chunks/CHX1ae3Y.js","_app/immutable/chunks/DTc3-fU9.js","_app/immutable/chunks/-wDmKmfL.js","_app/immutable/chunks/CJywgdyC.js","_app/immutable/chunks/BkAjnQ0c.js","_app/immutable/chunks/CcJDwDvi.js","_app/immutable/chunks/BbdOSnfv.js","_app/immutable/chunks/MtqMPcD1.js"];
export const stylesheets = [];
export const fonts = [];
