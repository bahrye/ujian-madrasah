import { h as head, e as escape_html, f as ensure_array_like, j as attr, d as bind_props } from "../../../../../chunks/index.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let data = $$props["data"];
    head("aegoy", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Papan Peringkat - ${escape_html(data.exam.title)}</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6 animate-in"><div class="mb-8"><a href="/siswa/papan-peringkat" class="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 mb-4 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg> Kembali ke Papan Peringkat</a> <h1 class="text-3xl font-bold text-slate-800 tracking-tight">${escape_html(data.exam.title)}</h1> <p class="text-slate-500 mt-1">Papan Peringkat Kelas untuk Ujian ${escape_html(data.exam.subject_name)}</p></div> <div class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden"><div class="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg> <h2 class="text-lg font-bold text-slate-800">Daftar Peringkat</h2></div> `);
    if (data.leaderboard.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="p-10 text-center text-slate-500"><p>Belum ada siswa di kelas Anda yang menyelesaikan ujian ini.</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="divide-y divide-slate-100"><!--[-->`);
      const each_array = ensure_array_like(data.leaderboard);
      for (let index = 0, $$length = each_array.length; index < $$length; index++) {
        let student = each_array[index];
        $$renderer2.push(`<div class="flex items-center px-6 py-4 hover:bg-slate-50 transition-colors"><div class="w-12 flex-shrink-0 flex justify-center">`);
        if (index === 0) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 font-bold text-lg">1</span>`);
        } else if (index === 1) {
          $$renderer2.push("<!--[1-->");
          $$renderer2.push(`<span class="flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 text-slate-600 font-bold text-lg">2</span>`);
        } else if (index === 2) {
          $$renderer2.push("<!--[2-->");
          $$renderer2.push(`<span class="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold text-lg">3</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<span class="flex items-center justify-center w-8 h-8 font-semibold text-slate-400">${escape_html(index + 1)}</span>`);
        }
        $$renderer2.push(`<!--]--></div> <div class="ml-4 flex items-center gap-4 flex-grow">`);
        if (student.photo) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<img${attr("src", student.photo)}${attr("alt", student.student_name)} class="w-10 h-10 rounded-full object-cover border border-slate-200"/>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<div class="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold">${escape_html(student.student_name.charAt(0).toUpperCase())}</div>`);
        }
        $$renderer2.push(`<!--]--> <div><p class="font-bold text-slate-800">${escape_html(student.student_name)}</p> <p class="text-xs text-slate-400">Telah Menyelesaikan</p></div></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
