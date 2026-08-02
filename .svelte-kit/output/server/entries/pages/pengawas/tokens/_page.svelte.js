import { h as head, i as attr, c as ensure_array_like, d as attr_class, e as escape_html, b as bind_props } from "../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import "../../../../chunks/state.svelte.js";
import { I as ICONS } from "../../../../chunks/constants.js";
import { t as toasts } from "../../../../chunks/toast.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let tokens;
    let data = $$props["data"];
    let form = $$props["form"];
    function isExpired(expiresAt) {
      return new Date(expiresAt) < /* @__PURE__ */ new Date();
    }
    if (form?.success) toasts.success(form.success);
    if (form?.error) toasts.error(form.error);
    tokens = data.tokens;
    head("1ve9738", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Token Ujian — Ujian Online Madrasah</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6 animate-in"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h1 class="text-2xl font-bold text-slate-800">Token Ujian</h1> <p class="text-sm text-slate-500 mt-1">Generate dan kelola token akses ujian</p></div> <button class="btn-primary"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.plus)}></path></svg> Generate Token</button></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="space-y-3">`);
    const each_array_1 = ensure_array_like(tokens);
    if (each_array_1.length !== 0) {
      $$renderer2.push("<!--[-->");
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let token = each_array_1[$$index_1];
        const expired = isExpired(token.expires_at);
        $$renderer2.push(`<div${attr_class(`card p-5 ${expired ? "opacity-60" : ""}`)}><div class="flex flex-col sm:flex-row sm:items-center gap-4"><div class="flex-1 min-w-0"><div class="flex items-center gap-3 mb-2"><span${attr_class(`text-2xl font-mono font-bold tracking-[0.2em] ${token.is_released ? "text-emerald-600" : "text-slate-700"}`)}>${escape_html(token.token_code)}</span> `);
        if (token.is_released) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="badge-success">Dirilis</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<span class="badge bg-slate-100 text-slate-500">Belum dirilis</span>`);
        }
        $$renderer2.push(`<!--]--> `);
        if (expired) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="badge-danger">Kedaluwarsa</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div> <p class="text-sm text-slate-600">${escape_html(token.exam_title)}</p> <p class="text-xs text-slate-400 mt-1">Berlaku hingga: ${escape_html(new Date(token.expires_at).toLocaleString("id-ID"))}</p></div> <div class="flex items-center gap-2 flex-shrink-0">`);
        if (!expired) {
          $$renderer2.push("<!--[0-->");
          if (token.is_released) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<form method="POST" action="?/revoke"><input type="hidden" name="id"${attr("value", token.id)}/> <button type="submit" class="btn-sm btn-warning">Tarik</button></form>`);
          } else {
            $$renderer2.push("<!--[-1-->");
            $$renderer2.push(`<form method="POST" action="?/release"><input type="hidden" name="id"${attr("value", token.id)}/> <button type="submit" class="btn-sm btn-success">Rilis</button></form>`);
          }
          $$renderer2.push(`<!--]-->`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <form method="POST" action="?/delete"><input type="hidden" name="id"${attr("value", token.id)}/> <button type="submit" class="btn-sm btn-ghost text-rose-400 hover:text-rose-600"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.trash)}></path></svg></button></form></div></div></div>`);
      }
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="text-center py-12 text-slate-400"><p>Belum ada token. Klik "Generate Token" untuk membuat.</p></div>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
    bind_props($$props, { data, form });
  });
}
export {
  _page as default
};
