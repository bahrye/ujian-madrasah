import { h as head, e as escape_html, i as ensure_array_like, j as attr_class, k as attr, f as bind_props } from "../../../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../../../chunks/exports.js";
import "../../../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../../../chunks/root.js";
import "../../../../../../chunks/state.svelte.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let data = $$props["data"];
    let expanded = /* @__PURE__ */ new Set();
    head("lvq6q8", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Papan Peringkat - ${escape_html(data.examType.name)}</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6 animate-in"><div class="mb-8"><a href="/guru/papan-peringkat" class="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 mb-4 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg> Kembali ke Papan Peringkat</a> <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Akumulasi: ${escape_html(data.examType.name)}</h1> <p class="text-slate-500 mt-1">Papan Peringkat berdasarkan total nilai seluruh ujian tipe ${escape_html(data.examType.code)}. Klik nama siswa untuk melihat detail per ujian.</p></div> <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6 flex flex-wrap items-center gap-3"><div class="flex items-center gap-2 text-slate-600 font-medium text-sm"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"></path></svg> Filter Kelas:</div> `);
    $$renderer2.select(
      {
        id: "class-filter",
        class: "form-input py-2 px-3 pr-8 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:border-primary-400 focus:ring-2 focus:ring-primary-100",
        value: data.classFilter
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "" }, ($$renderer4) => {
          $$renderer4.push(`Semua Kelas`);
        });
        $$renderer3.push(`<!--[-->`);
        const each_array = ensure_array_like(data.classes);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let cls = each_array[$$index];
          $$renderer3.option({ value: cls.id }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(cls.name)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
    $$renderer2.push(` `);
    if (data.classFilter) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="text-xs text-primary-600 font-semibold bg-primary-50 border border-primary-200 px-2.5 py-1 rounded-full">Menampilkan ${escape_html(data.leaderboard.length)} siswa</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden"><div class="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg> <h2 class="text-lg font-bold text-slate-800">Daftar Peringkat (Akumulasi Nilai)</h2></div> `);
    if (data.leaderboard.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="p-10 text-center text-slate-500"><p>${escape_html(data.classFilter ? "Tidak ada siswa dari kelas ini yang menyelesaikan ujian." : "Belum ada rekapan ujian untuk tipe ini.")}</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="overflow-x-auto"><table class="w-full text-left border-collapse"><thead><tr class="bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600"><th class="p-4 w-16 text-center">Peringkat</th><th class="p-4">Siswa</th><th class="p-4 text-center">Total Poin (Maks)</th><th class="p-4 text-center">Total Nilai</th><th class="p-4 text-center">Rata-rata</th></tr></thead><tbody><!--[-->`);
      const each_array_1 = ensure_array_like(data.leaderboard);
      for (let index = 0, $$length = each_array_1.length; index < $$length; index++) {
        let student = each_array_1[index];
        const isOpen = expanded.has(student.student_id);
        const details = data.detailMap[student.student_id] || [];
        $$renderer2.push(`<tr${attr_class("border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer select-none", void 0, { "bg-indigo-50": isOpen })}><td class="p-4 text-center align-middle">`);
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
          $$renderer2.push(`<div class="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold flex-shrink-0">${escape_html(student.student_name.charAt(0).toUpperCase())}</div>`);
        }
        $$renderer2.push(`<!--]--> <div class="min-w-0"><p class="font-bold text-slate-800 flex items-center gap-1.5">${escape_html(student.student_name)} <svg xmlns="http://www.w3.org/2000/svg"${attr_class(`h-4 w-4 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`)} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></p> <p class="text-xs text-slate-500">${escape_html(student.class_name || "Tidak ada kelas")} • ${escape_html(student.exams_completed)} Ujian</p></div></div></td><td class="p-4 text-center text-slate-600 font-medium">${escape_html(student.total_points)}</td><td class="p-4 text-center"><span class="inline-block px-3 py-1 bg-green-100 text-green-700 font-bold rounded-lg">${escape_html(student.total_score)}</span></td><td class="p-4 text-center text-slate-600 font-medium">${escape_html(student.avg_score.toFixed(2))}</td></tr> `);
        if (isOpen && details.length > 0) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<tr class="bg-indigo-50/60 border-b border-indigo-100"><td></td><td colspan="4" class="px-4 pb-4 pt-2"><div class="rounded-xl border border-indigo-100 overflow-hidden shadow-sm"><table class="w-full text-sm text-left border-collapse"><thead><tr class="bg-indigo-100 text-indigo-700 font-semibold"><th class="px-4 py-2.5">Nama Ujian</th><th class="px-4 py-2.5 text-center">Total Poin (Maks)</th><th class="px-4 py-2.5 text-center">Nilai</th></tr></thead><tbody class="divide-y divide-indigo-50 bg-white"><!--[-->`);
          const each_array_2 = ensure_array_like(details);
          for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
            let detail = each_array_2[$$index_1];
            $$renderer2.push(`<tr class="hover:bg-indigo-50/50 transition-colors"><td class="px-4 py-2.5 text-slate-700 font-medium">${escape_html(detail.exam_title)}</td><td class="px-4 py-2.5 text-center text-slate-600">${escape_html(detail.total_points)}</td><td class="px-4 py-2.5 text-center"><span class="inline-block px-2.5 py-0.5 bg-green-100 text-green-700 font-semibold rounded-md">${escape_html(detail.score)}</span></td></tr>`);
          }
          $$renderer2.push(`<!--]--></tbody></table></div></td></tr>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]-->`);
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
