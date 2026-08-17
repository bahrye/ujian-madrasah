import { h as head, k as attr, e as escape_html, i as ensure_array_like, j as attr_class, c as stringify, f as bind_props } from "../../../../../../chunks/index.js";
import { Q as QUESTION_TYPE_LABELS, I as ICONS } from "../../../../../../chunks/constants.js";
import "katex/dist/contrib/auto-render.mjs";
import { h as html } from "../../../../../../chunks/html.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let exam, analysis, totalAttempts, groupSize, summary;
    let data = $$props["data"];
    function getPCategoryColor(cat) {
      if (cat === "Sukar") return "text-rose-600 bg-rose-50 border-rose-200";
      if (cat === "Mudah") return "text-sky-600 bg-sky-50 border-sky-200";
      return "text-emerald-600 bg-emerald-50 border-emerald-200";
    }
    function getDCategoryColor(cat) {
      if (cat === "Sangat Baik" || cat === "Baik") return "text-emerald-600 bg-emerald-50 border-emerald-200";
      if (cat === "Cukup") return "text-amber-600 bg-amber-50 border-amber-200";
      return "text-rose-600 bg-rose-50 border-rose-200";
    }
    function getStatusColor(status) {
      if (status === "Gunakan") return "badge-success";
      if (status === "Revisi") return "badge-warning";
      return "badge-error";
    }
    exam = data.exam;
    analysis = data.analysis;
    totalAttempts = data.totalAttempts;
    groupSize = data.groupSize;
    summary = {
      total: analysis.length,
      gunakan: analysis.filter((a) => a.status === "Gunakan").length,
      revisi: analysis.filter((a) => a.status === "Revisi").length,
      buang: analysis.filter((a) => a.status === "Buang / Revisi Total").length
    };
    head("1onnrfj", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Analisis Butir Soal - ${escape_html(exam.title)}</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6 animate-in"><div class="flex items-center gap-3"><button type="button" class="btn-ghost btn-sm"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.chevronLeft)}></path></svg> Kembali</button></div> <div class="card p-6"><div class="flex flex-col md:flex-row justify-between gap-4"><div><h1 class="text-2xl font-bold text-slate-800">Analisis Butir Soal</h1> <p class="text-sm text-slate-500 mt-1">${escape_html(exam.title)} (${escape_html(exam.subject_name || "Umum")})</p></div> <div class="flex gap-4"><div class="text-right"><p class="text-xs text-slate-500 uppercase font-bold tracking-wider">Total Peserta</p> <p class="text-xl font-bold text-slate-800">${escape_html(totalAttempts)}</p></div> <div class="w-px bg-slate-200"></div> <div class="text-right"><p class="text-xs text-slate-500 uppercase font-bold tracking-wider">Sampel (27%)</p> <p class="text-xl font-bold text-slate-800">${escape_html(groupSize)} Atas / ${escape_html(groupSize)} Bawah</p></div></div></div></div> <div class="grid grid-cols-2 md:grid-cols-4 gap-4"><div class="card p-4 border-t-4 border-t-slate-800"><p class="text-3xl font-bold text-slate-800">${escape_html(summary.total)}</p> <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Total Soal</p></div> <div class="card p-4 border-t-4 border-t-emerald-500"><p class="text-3xl font-bold text-emerald-600">${escape_html(summary.gunakan)}</p> <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Gunakan (D Baik)</p></div> <div class="card p-4 border-t-4 border-t-amber-500"><p class="text-3xl font-bold text-amber-600">${escape_html(summary.revisi)}</p> <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Perlu Revisi (D Cukup)</p></div> <div class="card p-4 border-t-4 border-t-rose-500"><p class="text-3xl font-bold text-rose-600">${escape_html(summary.buang)}</p> <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Buang/Rombak (D Buruk)</p></div></div> `);
    if (totalAttempts === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="card p-12 text-center"><svg class="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <h3 class="text-lg font-bold text-slate-700">Belum Ada Data</h3> <p class="text-slate-500 mt-2 text-sm max-w-md mx-auto">Analisis butir soal baru dapat dilakukan jika sudah ada siswa yang menyelesaikan ujian ini.</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="card overflow-hidden"><div class="p-5 border-b border-slate-100 bg-slate-50/50"><h2 class="text-lg font-bold text-slate-800">Detail Analisis per Soal</h2></div> <div class="overflow-x-auto"><table class="table min-w-[1000px]"><thead><tr><th class="w-16 text-center">No.</th><th class="w-72">Teks Soal</th><th class="w-32">Tipe</th><th>Tingkat Kesukaran (P)</th><th>Daya Pembeda (D)</th><th class="w-32">Keputusan</th></tr></thead><tbody><!--[-->`);
      const each_array = ensure_array_like(analysis);
      for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
        let item = each_array[$$index_1];
        $$renderer2.push(`<tr class="hover:bg-slate-50/50 transition-colors"><td class="text-center font-bold text-slate-700">${escape_html(item.question_number)}</td><td><div class="line-clamp-2 text-sm text-slate-700"${attr("title", item.question_text)}>${html(item.question_text)}</div> `);
        if (Object.keys(item.distribution).length > 0) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="flex gap-2 mt-2 text-[10px] font-mono"><!--[-->`);
          const each_array_1 = ensure_array_like(["A", "B", "C", "D", "E"]);
          for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
            let opt = each_array_1[$$index];
            if (item.distribution[opt] !== void 0 || opt !== "E") {
              $$renderer2.push("<!--[0-->");
              $$renderer2.push(`<div class="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500"${attr("title", `Pemilih Opsi ${stringify(opt)}`)}>${escape_html(opt)}: ${escape_html(item.distribution[opt] || 0)}</div>`);
            } else {
              $$renderer2.push("<!--[-1-->");
            }
            $$renderer2.push(`<!--]-->`);
          }
          $$renderer2.push(`<!--]--></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></td><td><span class="text-xs badge-info">${escape_html(QUESTION_TYPE_LABELS[item.type] || item.type)}</span></td><td><div class="flex flex-col gap-1"><div class="flex items-center gap-2"><span class="font-bold text-slate-700">${escape_html(item.pIndex)}</span> <span${attr_class(`text-[10px] px-2 py-0.5 rounded border ${stringify(getPCategoryColor(item.pCategory))} font-medium`)}>${escape_html(item.pCategory)}</span></div> <div class="text-xs text-slate-400">Benar: ${escape_html(item.correctCount)} dari ${escape_html(totalAttempts)}</div></div></td><td><div class="flex flex-col gap-1"><div class="flex items-center gap-2"><span class="font-bold text-slate-700">${escape_html(item.dIndex)}</span> <span${attr_class(`text-[10px] px-2 py-0.5 rounded border ${stringify(getDCategoryColor(item.dCategory))} font-medium whitespace-nowrap`)}>${escape_html(item.dCategory)}</span></div> <div class="text-[10px] text-slate-400 font-mono mt-0.5 bg-slate-50 inline-block px-1 rounded border border-slate-100 self-start">${escape_html(item.upperCorrect)} Atas - ${escape_html(item.lowerCorrect)} Bawah</div></div></td><td><span${attr_class(`text-xs font-semibold px-2.5 py-1 rounded-full ${stringify(getStatusColor(item.status))} text-center block w-full whitespace-nowrap`)}>${escape_html(item.status)}</span></td></tr>`);
      }
      $$renderer2.push(`<!--]--></tbody></table></div></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"><div class="card p-6 bg-slate-50/50 border border-slate-200"><h3 class="font-bold text-slate-700 mb-3 text-sm flex items-center gap-2"><svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Tingkat Kesukaran (P)</h3> <ul class="text-xs text-slate-600 space-y-2"><li><strong class="text-rose-600">P &lt; 0.30</strong> : Soal Sukar</li> <li><strong class="text-emerald-600">0.30 ≤ P ≤ 0.70</strong> : Soal Sedang</li> <li><strong class="text-sky-600">P > 0.70</strong> : Soal Mudah</li></ul> <p class="mt-3 text-xs text-slate-500 leading-relaxed border-t border-slate-200 pt-3">Tingkat kesukaran yang ideal adalah yang menyebar, namun sebagian besar berada di kategori sedang. Soal yang terlalu mudah atau terlalu sukar tidak dapat membedakan kemampuan siswa.</p></div> <div class="card p-6 bg-slate-50/50 border border-slate-200"><h3 class="font-bold text-slate-700 mb-3 text-sm flex items-center gap-2"><svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Daya Pembeda (D)</h3> <ul class="text-xs text-slate-600 space-y-2"><li><strong class="text-emerald-600">D ≥ 0.40</strong> : Sangat Baik</li> <li><strong class="text-emerald-500">0.30 ≤ D ≤ 0.39</strong> : Baik</li> <li><strong class="text-amber-500">0.20 ≤ D ≤ 0.29</strong> : Cukup (Perlu Revisi)</li> <li><strong class="text-rose-600">D &lt; 0.20</strong> : Buruk (Buang / Revisi Total)</li></ul> <p class="mt-3 text-xs text-slate-500 leading-relaxed border-t border-slate-200 pt-3">Daya pembeda menunjukkan seberapa baik sebuah soal dapat membedakan siswa kelompok pandai (atas) dengan kelompok kurang (bawah). Nilai negatif berarti siswa kelompok bawah lebih banyak yang menjawab benar.</p></div></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
