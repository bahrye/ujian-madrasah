import { h as head, e as escape_html, f as ensure_array_like, j as attr, d as bind_props } from "../../../../../chunks/index.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let data = $$props["data"];
    function formatTime(ms) {
      const seconds = Math.floor(ms / 1e3);
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}m ${s}s`;
    }
    head("1sl60f0", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Papan Peringkat - ${escape_html(data.exam.title)}</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6 animate-in"><div class="mb-8"><a href="/admin/papan-peringkat" class="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 mb-4 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg> Kembali ke Papan Peringkat</a> <h1 class="text-3xl font-bold text-slate-800 tracking-tight">${escape_html(data.exam.title)}</h1> <p class="text-slate-500 mt-1">Papan Peringkat Seluruh Kelas untuk Ujian ${escape_html(data.exam.subject_name)}</p></div> <div class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden"><div class="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg> <h2 class="text-lg font-bold text-slate-800">Daftar Peringkat (Seluruh Siswa)</h2></div> `);
    if (data.leaderboard.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="p-10 text-center text-slate-500"><p>Belum ada siswa yang menyelesaikan ujian ini.</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="overflow-x-auto"><table class="w-full text-left border-collapse"><thead><tr class="bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600"><th class="p-4 w-16 text-center">Peringkat</th><th class="p-4">Siswa</th><th class="p-4 text-center">Total Poin (Maks)</th><th class="p-4 text-center">Total Nilai</th><th class="p-4 text-center">Waktu Pengerjaan</th></tr></thead><tbody class="divide-y divide-slate-100"><!--[-->`);
      const each_array = ensure_array_like(data.leaderboard);
      for (let index = 0, $$length = each_array.length; index < $$length; index++) {
        let student = each_array[index];
        const timeSpent = new Date(student.submit_time).getTime() - new Date(student.start_time).getTime();
        $$renderer2.push(`<tr class="hover:bg-slate-50 transition-colors"><td class="p-4 text-center align-middle">`);
        if (index === 0) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 font-bold text-lg shadow-sm">1</span>`);
        } else if (index === 1) {
          $$renderer2.push("<!--[1-->");
          $$renderer2.push(`<span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 text-slate-600 font-bold text-lg shadow-sm">2</span>`);
        } else if (index === 2) {
          $$renderer2.push("<!--[2-->");
          $$renderer2.push(`<span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold text-lg shadow-sm">3</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<span class="inline-flex items-center justify-center w-8 h-8 font-semibold text-slate-400">${escape_html(index + 1)}</span>`);
        }
        $$renderer2.push(`<!--]--></td><td class="p-4"><div class="flex items-center gap-3">`);
        if (student.photo) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<img${attr("src", student.photo)}${attr("alt", student.student_name)} class="w-10 h-10 rounded-full object-cover border border-slate-200"/>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<div class="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold">${escape_html(student.student_name.charAt(0).toUpperCase())}</div>`);
        }
        $$renderer2.push(`<!--]--> <div><p class="font-bold text-slate-800">${escape_html(student.student_name)}</p> <p class="text-xs text-slate-500">${escape_html(student.class_name || "Tidak ada kelas")}</p></div></div></td><td class="p-4 text-center text-slate-600 font-medium">${escape_html(student.total_points)}</td><td class="p-4 text-center"><span class="inline-block px-3 py-1 bg-green-100 text-green-700 font-bold rounded-lg">${escape_html(student.score)}</span></td><td class="p-4 text-center text-slate-500 text-sm">${escape_html(formatTime(timeSpent))}</td></tr>`);
      }
      $$renderer2.push(`<!--]--></tbody></table></div>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
