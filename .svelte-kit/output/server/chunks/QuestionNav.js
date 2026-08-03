import { l as fallback, c as ensure_array_like, d as attr_class, a as stringify, i as attr, e as escape_html, b as bind_props } from "./index.js";
function QuestionNav($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let questions = fallback($$props["questions"], () => [], true);
    let currentIndex = fallback($$props["currentIndex"], 0);
    function getButtonClass(q, index) {
      if (index === currentIndex) {
        return "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/30 scale-110";
      }
      if (q.doubted) {
        return "bg-amber-100 text-amber-700 border-2 border-amber-400";
      }
      if (q.answered) {
        return "bg-emerald-100 text-emerald-700 border border-emerald-300";
      }
      return "bg-white text-slate-500 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50";
    }
    $$renderer2.push(`<div class="space-y-3"><div class="flex flex-wrap gap-3 text-xs"><div class="flex items-center gap-1.5"><div class="w-4 h-4 rounded bg-gradient-to-r from-indigo-500 to-violet-500"></div> <span class="text-slate-600">Aktif</span></div> <div class="flex items-center gap-1.5"><div class="w-4 h-4 rounded bg-emerald-100 border border-emerald-300"></div> <span class="text-slate-600">Terjawab</span></div> <div class="flex items-center gap-1.5"><div class="w-4 h-4 rounded bg-amber-100 border-2 border-amber-400"></div> <span class="text-slate-600">Ragu-ragu</span></div> <div class="flex items-center gap-1.5"><div class="w-4 h-4 rounded bg-white border border-slate-200"></div> <span class="text-slate-600">Belum</span></div></div> <div class="grid grid-cols-8 sm:grid-cols-10 gap-1.5"><!--[-->`);
    const each_array = ensure_array_like(questions);
    for (let index = 0, $$length = each_array.length; index < $$length; index++) {
      let q = each_array[index];
      $$renderer2.push(`<button${attr_class(`w-full aspect-square rounded-lg text-xs font-bold transition-all duration-200 ${stringify(getButtonClass(q, index))}`)}${attr("title", `Soal ${stringify(q.question_number)}`)}>${escape_html(q.question_number)}</button>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
    bind_props($$props, { questions, currentIndex });
  });
}
export {
  QuestionNav as Q
};
