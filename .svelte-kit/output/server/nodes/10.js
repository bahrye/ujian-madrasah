import * as server from '../entries/pages/admin/bank-soal/_examId_/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/bank-soal/_examId_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/bank-soal/[examId]/+page.server.ts";
export const imports = ["_app/immutable/nodes/10.MQAdmyMV.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DIqfK5LK.js","_app/immutable/chunks/GROjdWtC.js","_app/immutable/chunks/C5HAPqUk.js","_app/immutable/chunks/CsadQQqy.js","_app/immutable/chunks/DJqv4JK0.js","_app/immutable/chunks/DVBbKyQv.js","_app/immutable/chunks/DdnGqoCZ.js","_app/immutable/chunks/FJBunwqp.js","_app/immutable/chunks/D7FvC3v6.js","_app/immutable/chunks/oe0IQBgH.js","_app/immutable/chunks/DcVTZJh4.js","_app/immutable/chunks/Dk1X5uEI.js","_app/immutable/chunks/DNeMqas3.js","_app/immutable/chunks/CDNPW2Ck.js","_app/immutable/chunks/GZBD4ez8.js","_app/immutable/chunks/B7Y6kx2q.js","_app/immutable/chunks/BaTBMN-4.js","_app/immutable/chunks/CQPO8yOr.js","_app/immutable/chunks/BOWj4hxQ.js","_app/immutable/chunks/C3qCnave.js","_app/immutable/chunks/BGnpMMhG.js","_app/immutable/chunks/C42ZiouF.js","_app/immutable/chunks/DlcSkKzz.js","_app/immutable/chunks/Bs9oZy6u.js","_app/immutable/chunks/BbGSPML3.js","_app/immutable/chunks/CIed95JV.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/BjHZ6aL8.js","_app/immutable/chunks/f-6e9z0s.js","_app/immutable/chunks/CKN5doRT.js","_app/immutable/chunks/L3EouOTm.js","_app/immutable/chunks/3dRbXXZy.js"];
export const stylesheets = ["_app/immutable/assets/QuestionRenderer.CwYmYea-.css"];
export const fonts = [];
