import { h as head, e as escape_html, k as attr, c as stringify, i as ensure_array_like, f as bind_props } from "../../../../../../chunks/index.js";
import { I as ICONS } from "../../../../../../chunks/constants.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let data = $$props["data"];
    head("rqvtpa", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(data.examType.name)} — Ujian Online Madrasah</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6 animate-in"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div class="flex items-start sm:items-center gap-3"><a href="/admin/exams" class="btn-ghost p-2 rounded-lg text-slate-500 hover:text-slate-800 mt-1 sm:mt-0" title="Kembali ke Tipe Ujian"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg></a> <div><div class="flex flex-wrap items-center gap-2"><span class="text-xs font-mono font-bold tracking-wider text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">${escape_html(data.examType.code)}</span> <h1 class="text-2xl font-bold text-slate-800">${escape_html(data.examType.name)}</h1></div> <p class="text-sm text-slate-500 mt-1">Daftar kelas yang terdaftar pada tipe ujian ini</p></div></div> <a${attr("href", `/print/jadwal-rekap/type/${stringify(data.examType.id)}`)} target="_blank" class="btn-outline text-indigo-600 border-indigo-200 hover:bg-indigo-50 flex items-center justify-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> Cetak Jadwal Ujian</a></div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">`);
    const each_array = ensure_array_like(data.classes);
    if (each_array.length !== 0) {
      $$renderer2.push("<!--[-->");
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let cls = each_array[$$index];
        $$renderer2.push(`<div class="card-hover p-5 flex flex-col border border-slate-200"><div class="flex items-start justify-between mb-3"><div class="flex-1 min-w-0"><h3 class="font-bold text-slate-800 truncate text-lg">${escape_html(cls.name)}</h3></div></div> <div class="flex flex-col gap-2 mt-2 mb-4"><div class="flex items-center gap-2 text-sm text-slate-600"><svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.users)}></path></svg> <span class="font-medium">${escape_html(cls.student_count)}</span> Siswa Aktif</div> <div class="flex items-center gap-2 text-sm text-slate-600"><svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.exam)}></path></svg> <span class="font-medium">${escape_html(cls.exam_count)}</span> Ujian</div></div> <div class="mt-auto pt-4 border-t border-slate-100"><a${attr("href", `/admin/exams/type/${stringify(data.examType.id)}/class/${stringify(cls.id)}`)} class="btn-primary w-full justify-center">Masuk ke Kelas <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path></svg></a></div></div>`);
      }
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="col-span-full text-center py-12 text-slate-400 bg-white rounded-2xl border border-slate-200 border-dashed"><svg class="w-16 h-16 mx-auto mb-3 opacity-40 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg> <p class="font-medium text-slate-500">Belum ada kelas yang didaftarkan.</p> <p class="text-sm mt-1">Silakan kelola kelas di pengaturan tipe ujian (tombol Peserta Default).</p></div>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
