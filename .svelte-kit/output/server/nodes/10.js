import * as server from '../entries/pages/admin/bank-soal/_examId_/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/bank-soal/_examId_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/bank-soal/[examId]/+page.server.ts";
export const imports = ["_app/immutable/nodes/10.sse6R4q4.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BV1hr-UK.js","_app/immutable/chunks/BxH7Qk13.js","_app/immutable/chunks/DHon3iv8.js","_app/immutable/chunks/DIMz4J0V.js","_app/immutable/chunks/B-vHU7aS.js","_app/immutable/chunks/CJVAUuBs.js","_app/immutable/chunks/BtIbHZYX.js","_app/immutable/chunks/UtP7hS1R.js","_app/immutable/chunks/CSCmeJqC.js","_app/immutable/chunks/B9RqB__j.js","_app/immutable/chunks/DUFUeTgQ.js","_app/immutable/chunks/sHRz0Lil.js","_app/immutable/chunks/Dg0MsMnr.js","_app/immutable/chunks/BiSM0t2o.js","_app/immutable/chunks/D1XK5Bcq.js","_app/immutable/chunks/CzEvOKrl.js","_app/immutable/chunks/DvGlIG5e.js","_app/immutable/chunks/BYaC5aJQ.js","_app/immutable/chunks/CCKuIusd.js","_app/immutable/chunks/DhFlSuqP.js","_app/immutable/chunks/DENypTlv.js","_app/immutable/chunks/nOaBnUdr.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/CaJZ9qC3.js","_app/immutable/chunks/RHhvIjaC.js","_app/immutable/chunks/XT3w68E-.js"];
export const stylesheets = ["_app/immutable/assets/QuestionRenderer.CwYmYea-.css"];
export const fonts = [];
