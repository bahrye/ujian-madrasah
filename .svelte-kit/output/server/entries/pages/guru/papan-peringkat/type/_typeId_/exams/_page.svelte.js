import { h as head, e as escape_html, i as ensure_array_like, k as attr, c as stringify, f as bind_props } from "../../../../../../../chunks/index.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let data = $$props["data"];
    head("17ukogp", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Papan Peringkat - ${escape_html(data.type_name)}</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6 animate-in"><div class="mb-8"><a href="/guru/papan-peringkat" class="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 mb-4 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg> Kembali ke Papan Peringkat</a> <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Per Ujian: ${escape_html(data.type_name)}</h1> <p class="text-slate-500 mt-1">Daftar papan peringkat untuk setiap ujian pada kategori ${escape_html(data.type_name)}</p></div> <section class="mb-10"><h2 class="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg> Daftar Ujian</h2> `);
    if (data.exams.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 shadow-sm"><p>Belum ada ujian yang tersedia untuk dilihat peringkatnya pada kategori ini.</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"><!--[-->`);
      const each_array = ensure_array_like(data.exams);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let exam = each_array[$$index];
        $$renderer2.push(`<div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow"><div class="flex items-start justify-between mb-4"><div><span class="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg mb-2">${escape_html(exam.type_name || "Ujian")}</span> <h3 class="font-bold text-slate-800 leading-tight">${escape_html(exam.title)}</h3> `);
        if (exam.subject) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<p class="text-sm text-slate-500 mt-1">${escape_html(exam.subject)}</p>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div></div> <div class="mt-auto pt-5 border-t border-slate-100"><a${attr("href", `/guru/papan-peringkat/${stringify(exam.id)}`)} class="btn btn-primary w-full justify-center">Lihat Peringkat</a></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></section></div>`);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
