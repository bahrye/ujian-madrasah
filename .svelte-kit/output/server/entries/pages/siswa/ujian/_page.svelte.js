import { h as head, j as attr, e as escape_html, d as bind_props } from "../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import "../../../../chunks/state.svelte.js";
import { I as ICONS } from "../../../../chunks/constants.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let data = $$props["data"];
    let form = $$props["form"];
    let loading = false;
    head("1fczl58", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Mulai Ujian — Ujian Online Madrasah</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-md mx-auto mt-8 animate-in"><div class="card p-8 text-center"><div class="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-xl shadow-indigo-500/30 mb-6"><svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.token)}></path></svg></div> <h1 class="text-2xl font-bold text-slate-800 mb-2">Masukkan Token Ujian</h1> <div class="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-100"><p class="font-bold text-slate-700 text-lg">${escape_html(data.exam.title)}</p> <p class="text-sm text-slate-500">${escape_html(data.exam.subject || "Umum")}</p></div> <p class="text-sm text-slate-500 mb-6">Dapatkan token dari pengawas ujian Anda untuk memulai</p> `);
    if (form?.error) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium text-left flex items-center gap-2"><svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.warning)}></path></svg> ${escape_html(form.error)}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <form method="POST" action="?/validateToken" class="space-y-4"><input name="token" type="text" required="" class="input text-center text-2xl font-mono tracking-[0.3em] uppercase py-4" placeholder="_ _ _ _ _ _" maxlength="10" autocomplete="off"/> <input type="hidden" name="exam_id"${attr("value", data.exam.id)}/> <button type="submit"${attr("disabled", loading, true)} class="btn-primary w-full py-3 text-base justify-center">`);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`Mulai Ujian`);
    }
    $$renderer2.push(`<!--]--></button></form> <p class="text-xs text-slate-400 mt-4">Token bersifat sekali pakai dan memiliki batas waktu.</p></div></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { data, form });
  });
}
export {
  _page as default
};
