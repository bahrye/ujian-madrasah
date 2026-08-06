import { h as head, i as ensure_array_like, e as escape_html, k as attr, c as stringify, f as bind_props } from "../../../../chunks/index.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let data = $$props["data"];
    head("1ozf2kj", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Papan Peringkat - Admin</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6 animate-in"><div class="mb-8"><h1 class="text-3xl font-bold text-slate-800 tracking-tight">Papan Peringkat</h1> <p class="text-slate-500 mt-1">Lihat peringkat siswa untuk seluruh ujian di sekolah.</p></div> <section class="mb-10"><h2 class="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg> Peringkat Ujian</h2> `);
    if (data.exams.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 shadow-sm"><p>Belum ada ujian yang tersedia untuk dilihat peringkatnya.</p></div>`);
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
        $$renderer2.push(`<!--]--></div></div> <div class="mt-auto pt-5 border-t border-slate-100"><a${attr("href", `/admin/papan-peringkat/${stringify(exam.id)}`)} class="btn btn-primary w-full justify-center">Lihat Peringkat</a></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></section> <section><h2 class="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg> Peringkat Tipe Ujian (Akumulasi)</h2> `);
    if (data.examTypes.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 shadow-sm"><p>Belum ada tipe ujian yang tersedia.</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"><!--[-->`);
      const each_array_1 = ensure_array_like(data.examTypes);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let type = each_array_1[$$index_1];
        $$renderer2.push(`<div class="bg-gradient-to-br from-indigo-500 to-primary-600 rounded-2xl p-6 shadow-md text-white flex flex-col hover:shadow-lg transition-shadow"><div class="mb-6"><div class="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg></div> <h3 class="font-bold text-xl leading-tight">${escape_html(type.type_name)}</h3> <p class="text-white/80 text-sm mt-1">Rekapitulasi seluruh nilai ujian untuk tipe ini</p></div> <div class="mt-auto"><a${attr("href", `/admin/papan-peringkat/type/${stringify(type.id)}`)} class="bg-white text-primary-600 hover:bg-slate-50 font-semibold px-4 py-2.5 rounded-xl w-full text-center inline-block transition-colors shadow-sm">Lihat Peringkat Tipe</a></div></div>`);
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
