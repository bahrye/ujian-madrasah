import { h as head, e as escape_html, j as attr, d as bind_props } from "../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/root.js";
import "../../../chunks/state.svelte.js";
import { T as Toast } from "../../../chunks/Toast2.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let form = $$props["form"];
    let loading = false;
    head("1x05zx6", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Masuk — Ujian Online Madrasah</title>`);
      });
    });
    Toast($$renderer2);
    $$renderer2.push(`<!----> <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-950 via-primary-900 to-violet-900 relative overflow-hidden"><div class="absolute inset-0 overflow-hidden pointer-events-none"><div class="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div> <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl"></div> <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl"></div></div> <div class="w-full max-w-md relative z-10 animate-bounce-in"><div class="card-glass p-8 sm:p-10"><div class="text-center mb-8"><div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-xl shadow-indigo-500/30 mb-4"><svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg></div> <h1 class="text-2xl font-bold text-slate-800">Ujian Online Madrasah</h1> <p class="text-sm text-slate-500 mt-1">Masuk ke akun Anda untuk melanjutkan</p></div> `);
    if (form?.error) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium flex items-center gap-2"><svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg> ${escape_html(form.error)}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <form method="POST" class="space-y-5"><div><label for="username" class="label">Username</label> <div class="relative"><svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg> <input id="username" name="username" type="text" required="" class="input pl-10" placeholder="Masukkan username" autocomplete="username"/></div></div> <div><label for="password" class="label">Kata Sandi</label> <div class="relative"><svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg> <input id="password" name="password" type="password" required="" class="input pl-10" placeholder="Masukkan kata sandi" autocomplete="current-password"/></div></div> <button type="submit"${attr("disabled", loading, true)} class="btn-primary w-full justify-center py-3 text-base">`);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`Masuk`);
    }
    $$renderer2.push(`<!--]--></button></form> <div class="mt-6 pt-5 border-t border-slate-200 text-center"><p class="text-xs text-slate-400">Pertama kali? <a href="/api/setup" class="text-indigo-500 hover:text-indigo-600 font-medium">Inisialisasi Database</a></p></div></div> <p class="text-center text-xs text-primary-300/60 mt-6">© 2024 Ujian Online Madrasah. Seluruh hak dilindungi.</p></div></div>`);
    bind_props($$props, { form });
  });
}
export {
  _page as default
};
