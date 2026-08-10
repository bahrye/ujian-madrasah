import { i as ensure_array_like, s as store_get, j as attr_class, c as stringify, k as attr, e as escape_html, u as unsubscribe_stores } from "./index.js";
import { t as toasts } from "./toast.js";
function Toast($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const typeStyles = {
      success: {
        bg: "bg-emerald-50",
        border: "border-emerald-400",
        icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      },
      error: {
        bg: "bg-rose-50",
        border: "border-rose-400",
        icon: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      },
      warning: {
        bg: "bg-amber-50",
        border: "border-amber-400",
        icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      },
      info: {
        bg: "bg-sky-50",
        border: "border-sky-400",
        icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      }
    };
    const iconColors = {
      success: "text-emerald-500",
      error: "text-rose-500",
      warning: "text-amber-500",
      info: "text-sky-500"
    };
    $$renderer2.push(`<div class="fixed top-4 left-4 right-4 md:left-auto md:right-4 z-[9999] flex flex-col gap-3 md:max-w-sm w-auto md:w-full pointer-events-none"><!--[-->`);
    const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$toasts", toasts));
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let toast = each_array[$$index];
      $$renderer2.push(`<div${attr_class(`pointer-events-auto ${stringify(typeStyles[toast.type].bg)} border-l-4 ${stringify(typeStyles[toast.type].border)} rounded-xl shadow-lg p-4 flex items-start gap-3`)}><svg${attr_class(`w-5 h-5 ${stringify(iconColors[toast.type])} flex-shrink-0 mt-0.5`)} fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", typeStyles[toast.type].icon)}></path></svg> <p class="text-sm font-medium text-slate-700 flex-1">${escape_html(toast.message)}</p> <button class="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0" aria-label="Tutup notifikasi"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  Toast as T
};
