import { h as head, e as escape_html, i as ensure_array_like, k as attr, c as stringify, f as bind_props } from "../../../chunks/index.js";
import { S as StatCard } from "../../../chunks/StatCard.js";
import { I as ICONS } from "../../../chunks/constants.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let data = $$props["data"];
    head("jl43oy", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Dashboard Guru — Ujian Online Madrasah</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6 animate-in"><div><h1 class="text-2xl font-bold text-slate-800">Dashboard Guru</h1> <p class="text-sm text-slate-500 mt-1">Selamat datang, ${escape_html(data.user.name)}.</p></div> <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">`);
    StatCard($$renderer2, {
      label: "Total Ujian",
      value: data.stats.totalExams,
      icon: ICONS.exam,
      gradient: "indigo"
    });
    $$renderer2.push(`<!----> `);
    StatCard($$renderer2, {
      label: "Total Soal",
      value: data.stats.totalQuestions,
      icon: ICONS.questions,
      gradient: "cyan"
    });
    $$renderer2.push(`<!----> `);
    StatCard($$renderer2, {
      label: "Perlu Dinilai",
      value: data.stats.pendingGrading,
      icon: ICONS.grading,
      gradient: "amber"
    });
    $$renderer2.push(`<!----></div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-4"><div class="card p-5"><h2 class="text-lg font-bold text-slate-800 mb-4">Ujian Terbaru</h2> <div class="space-y-2">`);
    const each_array = ensure_array_like(data.recentExams);
    if (each_array.length !== 0) {
      $$renderer2.push("<!--[-->");
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let exam = each_array[$$index];
        $$renderer2.push(`<a${attr("href", `/guru/bank-soal/${stringify(exam.id)}`)} class="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group"><div><p class="text-sm font-medium text-slate-700 group-hover:text-indigo-600">${escape_html(exam.title)}</p> <p class="text-xs text-slate-400">${escape_html(exam.question_count)} soal</p></div> <svg class="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.chevronRight)}></path></svg></a>`);
      }
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<p class="text-sm text-slate-400 text-center py-4">Belum ada ujian.</p>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="card p-5"><h2 class="text-lg font-bold text-slate-800 mb-4">Aksi Cepat</h2> <div class="space-y-3"><a href="/guru/bank-soal" class="btn-primary w-full justify-center"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.questions)}></path></svg> Kelola Bank Soal</a> <a href="/guru/penilaian" class="btn-secondary w-full justify-center"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.grading)}></path></svg> Penilaian Jawaban</a></div></div></div></div>`);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
