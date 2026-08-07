import * as server from '../entries/pages/admin/bank-soal/_examId_/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/bank-soal/_examId_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/bank-soal/[examId]/+page.server.ts";
export const imports = ["entries/pages/admin/bank-soal/_examId_/_page.svelte.js","chunks/index.js","chunks/exports.js","chunks/utils2.js","chunks/root.js","chunks/shared-server.js","chunks/state.svelte.js","chunks/ConfirmForm.js","chunks/constants.js","chunks/RichTextEditor.svelte_svelte_type_style_lang.js","chunks/toast.js","chunks/index2.js","chunks/html.js","chunks/stores.js"];
export const stylesheets = ["_app/immutable/assets/QuestionRenderer.CwYmYea-.css","_app/immutable/assets/RichTextEditor.DLtijARe.css"];
export const fonts = [];
